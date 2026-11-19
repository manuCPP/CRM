<script setup>
import { onMounted, ref } from 'vue'
import { instanceConfig } from '../config/instance.js'

const props = defineProps({
  agencyName: { type: String, default: instanceConfig.agencyName },
  agencyLocation: { type: String, default: instanceConfig.agencyLocation },
  accessToken: { type: String, required: true },
})
const emit = defineEmits(['navigate', 'open-lead'])
const totalLeads = ref(0)
const newLeads = ref(0)
const recentLeads = ref([])
const loading = ref(false)
const error = ref('')
const supabaseUrl = instanceConfig.supabaseUrl
const supabaseKey = instanceConfig.supabasePublishableKey
const table = instanceConfig.leadsTable

function resultCount(response, rows) {
  const range = response.headers.get('content-range')
  const total = range?.split('/').at(-1)
  return total && total !== '*' ? Number(total) : rows.length
}

async function queryLeads(filters, range) {
  const params = new URLSearchParams(filters)
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}?${params}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${props.accessToken}`,
      Range: range,
      Prefer: 'count=exact',
    },
  })
  if (!response.ok) throw new Error(`Supabase (${response.status}): ${await response.text()}`)
  const rows = await response.json()
  return { rows, count: resultCount(response, rows) }
}

async function loadOverview() {
  loading.value = true
  error.value = ''
  try {
    const fields = 'crm_id,name,email,phone,status,source,created_at'
    const [recent, fresh] = await Promise.all([
      queryLeads({ select: fields, order: 'created_at.desc' }, '0-4'),
      queryLeads({ select: 'crm_id', status: 'eq.NUOVO' }, '0-0'),
    ])
    totalLeads.value = recent.count
    newLeads.value = fresh.count
    recentLeads.value = recent.rows
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Impossibile caricare la panoramica.'
  } finally {
    loading.value = false
  }
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('it-IT', { dateStyle: 'short' }).format(date)
}

onMounted(loadOverview)
</script>

<template>
  <section class="overview-page">
    <header class="overview-heading">
      <div><span class="overview-kicker">{{ agencyName }}<template v-if="agencyLocation"> / {{ agencyLocation }}</template></span><h2>Panoramica</h2><p>Riepilogo dei lead della tua agenzia.</p></div>
      <button class="overview-primary" @click="emit('navigate', 'Lead')">Vai ai lead <span aria-hidden="true">&rarr;</span></button>
    </header>

    <p v-if="error" class="overview-message" role="alert">{{ error }}</p>
    <p v-else-if="loading" class="overview-message" role="status">Aggiornamento dati...</p>

    <div class="overview-metrics">
      <article class="overview-metric"><span class="metric-mark">L</span><div><p>LEAD TOTALI</p><strong>{{ loading ? '...' : totalLeads.toLocaleString('it-IT') }}</strong></div></article>
      <article class="overview-metric"><span class="metric-mark metric-mark-new">+</span><div><p>NUOVI LEAD</p><strong>{{ loading ? '...' : newLeads.toLocaleString('it-IT') }}</strong></div></article>
    </div>

    <section class="overview-recent">
      <header><div><span class="overview-kicker">ATTIVITA'</span><h3>Lead recenti</h3></div><button @click="loadOverview" :disabled="loading">AGGIORNA</button></header>
      <div v-if="!loading && !error && !recentLeads.length" class="overview-empty">I lead ricevuti compariranno qui.</div>
      <div v-else-if="recentLeads.length" class="overview-table-wrap">
        <table>
          <thead><tr><th>LEAD</th><th>CONTATTO</th><th>STATO</th><th>RICEVUTO</th><th><span class="sr-only">Apri</span></th></tr></thead>
          <tbody>
            <tr v-for="lead in recentLeads" :key="lead.crm_id">
              <td><strong>{{ lead.name || 'Nuovo lead' }}</strong><small>{{ lead.source || 'email' }}</small></td>
              <td><span>{{ lead.email || '-' }}</span><small>{{ lead.phone || '' }}</small></td>
              <td><span class="overview-status">{{ lead.status || 'NUOVO' }}</span></td>
              <td>{{ formatDate(lead.created_at) }}</td>
              <td><button class="overview-open" :aria-label="`Apri ${lead.name || 'lead'}`" @click="emit('open-lead', lead.crm_id)">&rarr;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.overview-page { display: grid; gap: 18px; }
.overview-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 24px; border: 1px solid var(--line); border-left: 4px solid var(--red); border-radius: 10px; background: #fff; }
.overview-kicker { color: var(--red-dark); font-size: 9px; font-weight: 800; letter-spacing: .9px; text-transform: uppercase; }
.overview-heading h2 { margin: 7px 0 4px; color: var(--ink); font-size: 25px; letter-spacing: -.6px; }
.overview-heading p { margin: 0; color: var(--muted); font-size: 12px; }
.overview-primary { min-height: 38px; display: inline-flex; align-items: center; gap: 11px; padding: 0 13px; border: 0; border-radius: 6px; background: var(--red); color: #fff; font-size: 11px; font-weight: 750; }
.overview-primary:hover { background: var(--red-dark); }
.overview-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.overview-metric { display: flex; align-items: center; gap: 13px; min-height: 105px; padding: 18px; border: 1px solid var(--line); border-radius: 9px; background: #fff; }
.metric-mark { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 9px; background: #f7e9ea; color: var(--red-dark); font-size: 13px; font-weight: 800; }
.metric-mark-new { background: #edf4ef; color: #3d7c53; font-size: 21px; }
.overview-metric p { margin: 0 0 5px; color: #858b90; font-size: 9px; font-weight: 800; letter-spacing: .6px; }
.overview-metric strong { color: var(--ink); font-size: 23px; letter-spacing: -.5px; }
.overview-recent { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
.overview-recent > header { display: flex; align-items: center; justify-content: space-between; padding: 16px 19px; border-bottom: 1px solid #eceeef; }
.overview-recent h3 { margin: 4px 0 0; color: var(--ink); font-size: 15px; }
.overview-recent > header button { padding: 7px 9px; border: 1px solid var(--line); border-radius: 5px; background: #fff; color: #60676c; font-size: 9px; font-weight: 750; }
.overview-recent > header button:disabled { opacity: .5; }
.overview-table-wrap { overflow-x: auto; }
.overview-table-wrap table { width: 100%; min-width: 620px; border-collapse: collapse; text-align: left; }
.overview-table-wrap th { padding: 10px 14px; background: #f7f8f8; color: #80868a; font-size: 8px; letter-spacing: .65px; }
.overview-table-wrap td { padding: 12px 14px; border-top: 1px solid #eff0f1; color: #555d62; font-size: 11px; }
.overview-table-wrap td strong, .overview-table-wrap td small { display: block; }
.overview-table-wrap td strong { color: #303438; font-size: 11px; }
.overview-table-wrap td small { margin-top: 4px; color: #858b90; font-size: 9px; }
.overview-status { display: inline-block; padding: 4px 7px; border-radius: 999px; background: #fbecee; color: var(--red-dark); font-size: 8px; font-weight: 750; }
.overview-open { width: 28px; height: 28px; border: 1px solid #f0d9da; border-radius: 6px; background: #fff7f7; color: var(--red-dark); }
.overview-empty, .overview-message { padding: 24px; color: #70777c; font-size: 12px; }
.overview-message { margin: 0; border: 1px solid var(--line); border-radius: 8px; background: #fff; }
.overview-message[role='alert'] { border-color: #efcccf; color: var(--red-dark); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 650px) { .overview-heading { align-items: flex-start; flex-direction: column; padding: 18px; }.overview-metrics { grid-template-columns: 1fr; } }
</style>
