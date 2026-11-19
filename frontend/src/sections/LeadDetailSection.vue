<script setup>
import { computed, onMounted, ref } from 'vue'
import { instanceConfig } from '../config/instance.js'

const props = defineProps({
  leadId: { type: String, required: true },
  accessToken: { type: String, required: true },
})
const emit = defineEmits(['back'])
const record = ref(null)
const loading = ref(false)
const error = ref('')
const url = instanceConfig.supabaseUrl
const key = instanceConfig.supabasePublishableKey
const table = instanceConfig.leadsTable

const leadName = computed(() => record.value?.name || record.value?.nome || record.value?.full_name || record.value?.fullname || record.value?.contact_name || 'Lead')
const leadEmail = computed(() => record.value?.email || record.value?.e_mail || record.value?.contact_email || '')
const leadPhone = computed(() => record.value?.phone || record.value?.telefono || record.value?.mobile || record.value?.phone_number || '')
const leadStatus = computed(() => record.value?.status || record.value?.stato || 'NUOVO')
const leadSource = computed(() => record.value?.source || record.value?.fonte || 'Immobiliare.it')
const createdAt = computed(() => {
  const value = record.value?.created_at || record.value?.created || record.value?.data_creazione
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('it-IT', { dateStyle: 'long', timeStyle: 'short' }).format(date)
})

async function loadLead() {
  loading.value = true
  error.value = ''
  try {
    for (const idColumn of ['crm_id', 'id', 'uuid', 'lead_id', 'gmail_message_id']) {
      const params = new URLSearchParams({ [idColumn]: `eq.${props.leadId}`, select: '*', limit: '1' })
      const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}?${params}`, {
        headers: { apikey: key, Authorization: `Bearer ${props.accessToken}` },
      })
      if (!response.ok) {
        const detail = await response.text()
        let code = ''
        try { code = JSON.parse(detail).code || '' } catch { /* non JSON response */ }
        if (code === '42703') continue
        throw new Error(`Supabase (${response.status}): ${detail}`)
      }
      const rows = await response.json()
      if (rows[0]) {
        record.value = rows[0]
        break
      }
    }
    if (!record.value) error.value = 'Lead non trovato o non accessibile con questo account.'
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Errore durante il caricamento del lead.'
  } finally {
    loading.value = false
  }
}

onMounted(loadLead)
</script>

<template>
  <section class="lead-detail-page">
    <button class="lead-back-button" @click="emit('back')"><span aria-hidden="true">&larr;</span> Torna ai lead</button>
    <p v-if="loading" class="lead-data-message" role="status">Caricamento scheda...</p>
    <p v-else-if="error" class="lead-data-message" role="alert">{{ error }}</p>
    <div v-else class="lead-detail-layout">
      <div class="lead-detail-sidebar">
        <header class="lead-detail-heading">
          <div><p>SCHEDA LEAD</p><h1>{{ leadName }}</h1></div>
          <span class="lead-status-pill">{{ leadStatus }}</span>
        </header>

        <section class="lead-info-card" aria-labelledby="lead-contact-title">
          <div class="lead-card-heading"><span class="lead-card-icon" aria-hidden="true">i</span><div><p>CONTATTO</p><h2 id="lead-contact-title">Informazioni personali</h2></div></div>
          <dl class="lead-contact-details">
            <div><dt>Email</dt><dd><a v-if="leadEmail" :href="`mailto:${leadEmail}`">{{ leadEmail }}</a><span v-else>Non disponibile</span></dd></div>
            <div><dt>Telefono</dt><dd><a v-if="leadPhone" :href="`tel:${leadPhone}`">{{ leadPhone }}</a><span v-else>Non disponibile</span></dd></div>
          </dl>
        </section>

        <section class="lead-property-card" aria-labelledby="lead-property-title">
          <div class="lead-card-heading"><span class="lead-card-icon property-icon" aria-hidden="true">I</span><div><p>RICHIESTA RICEVUTA DA</p><h2 id="lead-property-title">{{ leadSource }}</h2></div></div>
          <div class="lead-property-placeholder"><span aria-hidden="true">&#9633;</span><div><strong>Immobile richiesto</strong><p>I dettagli dell'annuncio compariranno qui.</p></div></div>
        </section>

        <p v-if="createdAt" class="lead-created-at">Lead ricevuto il {{ createdAt }}</p>
      </div>

      <section class="lead-chat-card" aria-labelledby="lead-chat-title">
        <header class="lead-chat-header"><span class="chat-mark" aria-hidden="true">W</span><div><p>CONVERSAZIONE</p><h2 id="lead-chat-title">Chat WhatsApp</h2></div><span class="chat-future-tag">IN ARRIVO</span></header>
        <div class="lead-chat-body"><div class="chat-empty-icon" aria-hidden="true"><span></span><i></i></div><strong>La conversazione apparira qui</strong><p>Collegheremo i messaggi tra il bot e il numero del lead tramite WhatsApp API.</p></div>
        <div class="lead-chat-composer" aria-disabled="true"><span>La chat sara disponibile con l'integrazione WhatsApp</span><button type="button" disabled aria-label="Invio non disponibile">&#8593;</button></div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.lead-detail-page { display: grid; gap: 15px; }
.lead-back-button { justify-self: start; display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; border: 0; background: transparent; color: #646b70; font-size: 12px; font-weight: 650; }
.lead-back-button:hover { color: var(--red-dark); }
.lead-detail-layout { display: grid; grid-template-columns: minmax(280px, 390px) minmax(0, 1fr); align-items: stretch; gap: 18px; }
.lead-detail-sidebar { display: grid; align-content: start; gap: 14px; min-width: 0; }
.lead-detail-heading, .lead-info-card, .lead-property-card, .lead-chat-card { border: 1px solid var(--line); border-radius: 10px; background: #fff; box-shadow: 0 2px 8px #25282b08; }
.lead-detail-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 19px 20px; border-left: 4px solid var(--red); }
.lead-detail-heading p, .lead-card-heading p, .lead-chat-header p { margin: 0 0 5px; color: #858b90; font-size: 9px; font-weight: 800; letter-spacing: .85px; }
.lead-detail-heading h1 { margin: 0; color: var(--ink); font-size: clamp(18px, 2vw, 23px); letter-spacing: -.35px; overflow-wrap: anywhere; }
.lead-info-card, .lead-property-card { padding: 18px 19px; }
.lead-card-heading { display: flex; align-items: center; gap: 11px; }
.lead-card-heading h2, .lead-chat-header h2 { margin: 0; color: var(--ink); font-size: 14px; font-weight: 700; }
.lead-card-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; background: #f7e9ea; color: var(--red-dark); font-size: 14px; font-weight: 800; }
.property-icon { background: #f1f3f4; color: #535b61; }
.lead-contact-details { display: grid; gap: 13px; margin: 18px 0 0; padding-top: 15px; border-top: 1px solid #eceeef; }
.lead-contact-details dt { margin-bottom: 4px; color: #858b90; font-size: 10px; font-weight: 700; }
.lead-contact-details dd { margin: 0; overflow-wrap: anywhere; color: var(--ink); font-size: 12px; }
.lead-contact-details a { color: #353b40; text-decoration: none; }
.lead-contact-details a:hover { color: var(--red-dark); text-decoration: underline; }
.lead-property-placeholder { display: flex; align-items: center; gap: 12px; margin-top: 17px; padding: 14px; border: 1px dashed #dfe1e3; border-radius: 8px; background: #fafafa; }
.lead-property-placeholder > span { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 7px; background: #f0f1f2; color: #7a8186; font-size: 20px; }
.lead-property-placeholder strong { color: #444b50; font-size: 12px; }
.lead-property-placeholder p { margin: 4px 0 0; color: #858b90; font-size: 10px; line-height: 1.5; }
.lead-created-at { margin: 0; padding: 0 3px; color: #858b90; font-size: 10px; }
.lead-chat-card { min-height: 490px; display: grid; grid-template-rows: auto 1fr auto; overflow: hidden; }
.lead-chat-header { display: flex; align-items: center; gap: 11px; padding: 16px 19px; border-bottom: 1px solid #eceeef; }
.chat-mark { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #edf5ef; color: #4d805b; font-size: 12px; font-weight: 800; }
.lead-chat-header h2 { font-size: 14px; }
.chat-future-tag { margin-left: auto; padding: 5px 7px; border-radius: 4px; background: #f3f4f5; color: #777e83; font-size: 8px; font-weight: 800; letter-spacing: .5px; }
.lead-chat-body { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
.chat-empty-icon { position: relative; width: 54px; height: 43px; margin-bottom: 16px; border: 2px solid #dfe3e1; border-radius: 15px; }
.chat-empty-icon::after { position: absolute; bottom: -6px; left: 9px; width: 11px; height: 11px; border-bottom: 2px solid #dfe3e1; background: #fff; content: ''; transform: skew(-25deg) rotate(-25deg); }
.chat-empty-icon span, .chat-empty-icon i { position: absolute; top: 18px; width: 4px; height: 4px; border-radius: 50%; background: #aeb6b1; }
.chat-empty-icon span { left: 17px; }
.chat-empty-icon i { left: 29px; }
.lead-chat-body strong { color: #4d5550; font-size: 12px; }
.lead-chat-body p { max-width: 270px; margin: 7px 0 0; color: #858b90; font-size: 11px; line-height: 1.6; }
.lead-chat-composer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 13px; padding: 7px 8px 7px 13px; border: 1px solid #e7e9e8; border-radius: 8px; color: #9a9fa2; font-size: 10px; }
.lead-chat-composer button { width: 29px; height: 29px; border: 0; border-radius: 6px; background: #e9edeb; color: #a1a8a3; }
@media (max-width: 850px) { .lead-detail-layout { grid-template-columns: minmax(0, 1fr); } .lead-chat-card { min-height: 390px; } }
@media (max-width: 600px) { .lead-detail-heading { padding: 16px; } .lead-info-card, .lead-property-card { padding: 16px; } .lead-chat-body { padding: 24px 18px; } }
</style>
