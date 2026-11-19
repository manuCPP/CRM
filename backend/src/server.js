import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';
import { simpleParser } from 'mailparser';
import { Telegraf } from 'telegraf';
import { loadConfig } from './config.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const config = loadConfig();

const credentialsPath = path.join(root, 'credentials.json');
const tokenPath = path.join(root, 'token.json');
const credentialsText = await readFile(credentialsPath, 'utf8');
const credentialsFile = JSON.parse(credentialsText.replace(String.fromCharCode(0xfeff), ''));
const clientConfig = credentialsFile.installed || credentialsFile.web;
if (!clientConfig) throw new Error('credentials.json must contain an installed or web OAuth client.');
const oauth = new google.auth.OAuth2(clientConfig.client_id, clientConfig.client_secret, clientConfig.redirect_uris?.[0]);
const tokenText = await readFile(tokenPath, 'utf8');
oauth.setCredentials(JSON.parse(tokenText.replace(String.fromCharCode(0xfeff), '')));
const gmail = google.gmail({ version: 'v1', auth: oauth });
const bot = config.telegram ? new Telegraf(config.telegram.botToken) : null;
const usesLegacyServiceRoleKey = !config.supabase.secretKey.startsWith('sb_secret_');
let stopping = false;

function sourceDomain(parsed) {
  const addresses = parsed.from?.value?.map(({ address = '' }) => address.toLowerCase()) || [];
  const content = `${parsed.subject || ''}\n${parsed.text || ''}`.toLowerCase();
  return config.leadSourceDomains.find((domain) =>
    addresses.some((address) => address.endsWith(`@${domain}`) || address.endsWith(`.${domain}`))
      || content.includes(domain),
  ) || '';
}

function isLeadTestEmail(parsed) {
  return (parsed.subject || '').trim().toLowerCase().startsWith(config.leadTestSubjectPrefix.toLowerCase());
}

function isSupportedLeadEmail(parsed) {
  return Boolean(sourceDomain(parsed)) || isLeadTestEmail(parsed);
}

function formatLead(parsed) {
  const sender = parsed.from?.text || 'mittente sconosciuto';
  const subject = parsed.subject || '(senza oggetto)';
  const body = (parsed.text || '(corpo non disponibile)').replace(/[ \t]+/g, ' ').trim();
  const phone = body.match(/(?:\+?\d[\d .()\/-]{7,}\d)/)?.[0] || 'non trovato';
  const source = sourceDomain(parsed) || 'email di test';
  return `Nuova richiesta ${config.tenant.agencyName}\nFonte: ${source}\nDa: ${sender}\nOggetto: ${subject}\nTelefono rilevato: ${phone}\n\n${body}`.slice(0, 3900);
}

function extractLead(parsed) {
  const body = (parsed.text || '').trim();
  const nameMatch = body.match(/(?:nome e cognome|nominativo|nome|richiedente|referente)\s*[:\-]\s*([^\r\n]+)/i);
  const emailsInBody = (body.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])
    .filter((address) => !/@(?:[a-z0-9-]+\.)*immobiliare\.it$/i.test(address));
  const senderEmail = parsed.from?.value?.find(({ address = '' }) => address && !/@(?:[a-z0-9-]+\.)*immobiliare\.it$/i.test(address))?.address;
  const phone = body.match(/(?:\+?\d[\d .()\/-]{7,}\d)/)?.[0];
  const date = parsed.date && !Number.isNaN(parsed.date.getTime()) ? parsed.date : new Date();

  return {
    name: nameMatch?.[1]?.trim() || 'Nuovo lead',
    email: emailsInBody[0] || senderEmail || null,
    phone: phone || null,
    status: 'NUOVO',
    source: sourceDomain(parsed) || 'test',
    created_at: date.toISOString(),
    message: body || null,
  };
}

async function saveLead(parsed, gmailMessageId) {
  const endpoint = new URL(`/rest/v1/${encodeURIComponent(config.supabase.leadsTable)}`, config.supabase.url);
  endpoint.searchParams.set('on_conflict', 'gmail_message_id');
  const headers = {
    apikey: config.supabase.secretKey,
    'Content-Type': 'application/json',
    Prefer: 'resolution=ignore-duplicates,return=minimal',
  };
  if (usesLegacyServiceRoleKey) headers.Authorization = `Bearer ${config.supabase.secretKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...extractLead(parsed), gmail_message_id: gmailMessageId }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase (${response.status}): ${detail || response.statusText}`);
  }
}

async function scanInbox() {
  const { data } = await gmail.users.messages.list({ userId: 'me', q: 'in:inbox is:unread', maxResults: 50 });
  const messages = data.messages || [];
  if (messages.length) console.log(`Trovate ${messages.length} email non lette in Inbox.`);
  for (const item of messages) {
    try {
      const { data: message } = await gmail.users.messages.get({ userId: 'me', id: item.id, format: 'raw' });
      const raw = Buffer.from(message.raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
      const parsed = await simpleParser(raw);
      if (isSupportedLeadEmail(parsed)) {
        await saveLead(parsed, item.id);
        console.log(`[${config.tenant.slug}] Email ${item.id} salvata in Supabase (fonte: ${sourceDomain(parsed) || 'test'}).`);
        if (bot) await bot.telegram.sendMessage(config.telegram.chatId, formatLead(parsed));
      } else {
        console.log(`[${config.tenant.slug}] Email ${item.id} ignorata: la fonte non e' configurata e l'oggetto non inizia con ${config.leadTestSubjectPrefix}.`);
      }
      await gmail.users.messages.modify({ userId: 'me', id: item.id, requestBody: { removeLabelIds: ['UNREAD'] } });
    } catch (error) {
      console.error(`Errore sulla mail ${item.id}:`, error.message);
    }
  }
}

async function run() {
  console.log(`[${config.tenant.slug}] Monitoraggio Gmail API avviato (intervallo ${config.pollIntervalMs} ms).`);
  if (!bot) console.log(`[${config.tenant.slug}] Notifiche Telegram disattivate per questa istanza.`);
  while (!stopping) {
    try { await scanInbox(); }
    catch (error) { console.error('Errore durante la scansione Gmail:', error.message); }
    if (!stopping) await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs));
  }
}

process.once('SIGINT', () => { stopping = true; });
process.once('SIGTERM', () => { stopping = true; });
run().catch((error) => { console.error(error); process.exitCode = 1; });

