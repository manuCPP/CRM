import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';
import { simpleParser } from 'mailparser';
import { Telegraf } from 'telegraf';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_CHAT_ID'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);

const credentialsPath = path.join(root, 'credentials.json');
const tokenPath = path.join(root, 'token.json');
const credentialsFile = JSON.parse(await readFile(credentialsPath, 'utf8'));
const clientConfig = credentialsFile.installed || credentialsFile.web;
if (!clientConfig) throw new Error('credentials.json must contain an installed or web OAuth client.');
const oauth = new google.auth.OAuth2(clientConfig.client_id, clientConfig.client_secret, clientConfig.redirect_uris?.[0]);
oauth.setCredentials(JSON.parse(await readFile(tokenPath, 'utf8')));
const gmail = google.gmail({ version: 'v1', auth: oauth });
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const intervalMs = Number(process.env.POLL_INTERVAL_MS || 30_000);
let stopping = false;

function isImmobiliareEmail(parsed) {
  const addresses = parsed.from?.value?.map(({ address = '' }) => address.toLowerCase()) || [];
  const body = `${parsed.subject || ''}\n${parsed.text || ''}`;
  return addresses.some((address) => /@(?:[a-z0-9-]+\.)*immobiliare\.it$/i.test(address))
    || /immobiliare\.it/i.test(body);
}

function formatLead(parsed) {
  const sender = parsed.from?.text || 'mittente sconosciuto';
  const subject = parsed.subject || '(senza oggetto)';
  const body = (parsed.text || '(corpo non disponibile)').replace(/[ \t]+/g, ' ').trim();
  const phone = body.match(/(?:\+?\d[\d .()\/-]{7,}\d)/)?.[0] || 'non trovato';
  return `Nuova richiesta Immobiliare.it\nDa: ${sender}\nOggetto: ${subject}\nTelefono rilevato: ${phone}\n\n${body}`.slice(0, 3900);
}

async function scanInbox() {
  const { data } = await gmail.users.messages.list({ userId: 'me', q: 'in:inbox is:unread', maxResults: 50 });
  for (const item of data.messages || []) {
    try {
      const { data: message } = await gmail.users.messages.get({ userId: 'me', id: item.id, format: 'raw' });
      const raw = Buffer.from(message.raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
      const parsed = await simpleParser(raw);
      if (isImmobiliareEmail(parsed)) {
        await bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID, formatLead(parsed));
      }
      await gmail.users.messages.modify({ userId: 'me', id: item.id, requestBody: { removeLabelIds: ['UNREAD'] } });
    } catch (error) {
      console.error(`Errore sulla mail ${item.id}:`, error.message);
    }
  }
}

async function run() {
  console.log(`Monitoraggio Gmail API avviato (intervallo ${intervalMs} ms).`);
  while (!stopping) {
    try { await scanInbox(); }
    catch (error) { console.error('Errore durante la scansione Gmail:', error.message); }
    if (!stopping) await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

process.once('SIGINT', () => { stopping = true; });
process.once('SIGTERM', () => { stopping = true; });
run().catch((error) => { console.error(error); process.exitCode = 1; });
