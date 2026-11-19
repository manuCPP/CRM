<script setup>
import { computed, onMounted, ref } from 'vue'
import { instanceConfig } from '../config/instance.js'

const props = defineProps({ accessToken: { type: String, required: true } })
const emit = defineEmits(['open-lead'])

const leads = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const supabaseUrl = instanceConfig.supabaseUrl
const supabaseKey = instanceConfig.supabasePublishableKey
const table = instanceConfig.leadsTable

const first = (row, ...keys) => keys.map(key => row[key]).find(value => value !== null && value !== undefined && value !== '')
const formatDate = value => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}
const normalizeLead = (row, index) => {
  const recordId = first(row, 'crm_id', 'id', 'uuid', 'lead_id', 'gmail_message_id')
  return {
  id: recordId ?? `missing-${index}`,
  canOpen: Boolean(recordId),
  name: first(row, 'name', 'nome', 'full_name', 'fullname', 'contact_name') ?? '-',
  email: first(row, 'email', 'e_mail') ?? '-',
  phone: first(row, 'phone', 'telefono', 'mobile', 'phone_number') ?? '-',
  status: first(row, 'status', 'stato') ?? '-',
  source: first(row, 'source', 'fonte', 'origin') ?? '-',
  created: formatDate(first(row, 'created_at', 'created', 'data_creazione', 'inserted_at')),
  }
}
const filteredLeads = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('it')
  if (!query) return leads.value
  return leads.value.filter(lead => [lead.name, lead.email, lead.phone, lead.status, lead.source].some(value => String(value).toLocaleLowerCase('it').includes(query)))
})

async function loadLeads() {
  if (!supabaseUrl || !supabaseKey) {
    error.value = 'Configura VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nel file .env del frontend.'
    return
  }
  if (supabaseKey.startsWith('sb_secret_')) {
    error.value = 'Hai configurato una chiave Supabase secret. Nel frontend usa una chiave publishable (sb_publishable_...).'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}?select=*`
    const allRows = []
    const pageSize = 1000
    for (let offset = 0; ; offset += pageSize) {
      const response = await fetch(endpoint, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${props.accessToken}`,
          Range: `${offset}-${offset + pageSize - 1}`,
        },
      })
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(`Supabase (${response.status}): ${detail || response.statusText}`)
      }
      const rows = await response.json()
      allRows.push(...rows)
      if (rows.length < pageSize) break
    }
    leads.value = allRows.map(normalizeLead)
    if (allRows.length === 0) {
      error.value = 'Supabase ha risposto ma non ha restituito righe. Verifica che la tabella sia public.leads e che esista una policy RLS SELECT per il ruolo usato.'
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Errore durante il caricamento dei lead.'
  } finally {
    loading.value = false
  }
}

onMounted(loadLeads)
</script>

<template>
  <section class="leads-page">
    <header class="records-titlebar leads-titlebar">
      <h1>GESTIONE LEAD</h1>
      <div class="lead-toolbar">
        <input v-model="search" aria-label="Cerca lead" placeholder="Cerca nome, email o telefono" />
        <button class="toolbar-gray" :disabled="loading" @click="loadLeads">{{ loading ? 'CARICAMENTO...' : 'AGGIORNA' }}</button>
      </div>
    </header>
    <p v-if="error" class="lead-data-message" role="alert">{{ error }}</p>
    <p v-else-if="loading" class="lead-data-message" role="status">Caricamento lead da Supabase...</p>
    <div v-else class="lead-table-wrap">
      <table class="lead-table">
        <thead><tr><th>LEAD</th><th>CONTATTO</th><th>STATO</th><th class="lead-action-heading"><span class="sr-only">Apri scheda</span></th></tr></thead>
        <tbody>
          <tr v-for="lead in filteredLeads" :key="lead.id">
            <td class="lead-identity"><strong>{{ lead.name }}</strong><small>{{ lead.created }}</small></td>
            <td class="lead-contact"><a v-if="lead.email !== '-'" :href="`mailto:${lead.email}`">{{ lead.email }}</a><span v-else>-</span><a v-if="lead.phone !== '-'" :href="`tel:${lead.phone}`">{{ lead.phone }}</a></td>
            <td><span class="lead-status-pill">{{ lead.status }}</span></td>
            <td class="lead-action-cell"><a v-if="lead.canOpen" class="lead-open-button" :href="`/index/lead/${encodeURIComponent(String(lead.id))}`" :aria-label="`Apri la scheda di ${lead.name}`" title="Apri scheda" @click.prevent="emit('open-lead', lead.id)"><span aria-hidden="true">↗</span></a><button v-else class="lead-open-button" type="button" disabled aria-label="ID scheda non disponibile" title="Aggiorna la migrazione Supabase"><span aria-hidden="true">↗</span></button></td>
          </tr>
          <tr v-if="!filteredLeads.length"><td colspan="4" class="no-leads">Nessun lead trovato.</td></tr>
        </tbody>
      </table>
    </div>
    <footer v-if="!error && !loading" class="lead-pagination">{{ filteredLeads.length }} lead visualizzati <span>Fonte: Supabase / {{ table }}</span></footer>
  </section>
</template>

