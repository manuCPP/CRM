<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const messageSearch = ref('')
const status = ref('Tutti')
const messageStatus = ref('Tutti')
const agent = ref('Tutti')
const source = ref('Tutte')
const onlyNew = ref(false)
const customColumns = ref(false)
const quickOpen = ref(false)
const modal = ref('')
const filtered = ref(false)
const page = ref(1)
const leads = [
  { name:'Roberto Cardone', flow:'DEFAULT', source:'immobiliare.it', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'17/11/2026 11:53', phone:true },
  { name:'Salvatore', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'17/11/2026 11:04', phone:true },
  { name:'Giuseppe Dangelo', flow:'DEFAULT', source:'immobiliare.it', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'17/11/2026 09:50', phone:true },
  { name:'Piero Rivarone', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 22:08', phone:true },
  { name:'Priscila Ducati', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 21:19', phone:false },
  { name:'Agron Lule', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 20:49', phone:true },
  { name:'Fabio', flow:'FLUSSO RICHIESTA', source:'immobiliare.it', status:'NUOVO', agent:'Agenzia', messages:7, read:'LETTO', created:'16/11/2026 19:34', phone:true },
  { name:'Leonardo', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 19:00', phone:true },
  { name:'Margherita Ferroni', flow:'DEFAULT', source:'immobiliare.it', status:'NUOVO', agent:'Agenzia', messages:5, read:'LETTO', created:'16/11/2026 16:17', phone:true },
  { name:'Letizia Simonelli', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 15:43', phone:true },
  { name:'manuel', flow:'DEFAULT', source:'immobiliare.it', status:'NUOVO', agent:'Agenzia', messages:1, read:'INVIATO', created:'16/11/2026 15:18', phone:true },
  { name:'Zaheer Ahmed', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'16/11/2026 13:01', phone:true },
  { name:'sandro grillenzoni', flow:'DEFAULT', source:'idealista', status:'NUOVO', agent:'NA', messages:2, read:'INVIATO', created:'14/07/2026 07:52', phone:true },
  { name:'Hamza', flow:'DEFAULT', source:'immobiliare.it', status:'NUOVO', agent:'NA', messages:0, read:'NESSUN MESSAGGIO', created:'15/11/2026 20:56', phone:true },
]
const rows = computed(() => filtered.value ? leads.filter(item => {
  const text = `${item.name} ${item.source} ${item.agent}`.toLowerCase()
  return (!search.value || text.includes(search.value.toLowerCase())) && (!messageSearch.value || item.read.toLowerCase().includes(messageSearch.value.toLowerCase())) && (status.value === 'Tutti' || item.status === status.value) && (messageStatus.value === 'Tutti' || item.read === messageStatus.value) && (agent.value === 'Tutti' || item.agent === agent.value) && (source.value === 'Tutte' || item.source === source.value)
}) : leads)
const applyFilters = () => { filtered.value = true; page.value = 1 }
const resetFilters = () => { search.value=''; messageSearch.value=''; status.value='Tutti'; messageStatus.value='Tutti'; agent.value='Tutti'; source.value='Tutte'; onlyNew.value=false; filtered.value=false; page.value=1 }
</script>

<template>
  <section class="leads-page">
    <header class="records-titlebar leads-titlebar"><h1>GESTIONE LEAD</h1><div class="lead-toolbar"><div class="quick-wrap"><button class="quick-button" @click="quickOpen = !quickOpen">ϟ AZIONI RAPIDE ▾</button><div v-if="quickOpen" class="quick-menu"><button @click="modal='Batch invii';quickOpen=false">Avvia batch invii</button><button @click="modal='Esporta CSV';quickOpen=false">Esporta selezione</button><button @click="modal='Importa CSV';quickOpen=false">Importa contatti</button></div></div><button class="toolbar-cyan" @click="modal='Batch invii'">◷ BATCH INVII</button><button class="toolbar-red" @click="modal='Esporta CSV'">⇩ ESPORTA CSV</button><button class="toolbar-green" @click="modal='Importa CSV'">⇧ IMPORTA CSV</button><button class="toolbar-gray" @click="modal='Nuovo lead'">NUOVO LEAD</button><button class="toolbar-dark" @click="modal='Segna tutti come visti'">◎ SEGNA TUTTI COME VISTI <b>5925</b></button></div></header>
    <section class="lead-filters">
      <label class="filter-field budget-range"><span>Budget compatibile (€)</span><div><label>Da<input type="number" placeholder="es. 150000" /></label><label>A<input type="number" placeholder="es. 250000" /></label></div><small>Mostra i budget che si sovrappongono alla fascia, anche con un solo limite dichiarato. Esclude chi non ha un budget.</small></label>
      <label class="filter-field"><span>Ricerca</span><input v-model="search" placeholder="Nome, Email, Telefono" /></label>
      <label class="filter-field"><span>Ricerca Messaggi</span><input v-model="messageSearch" placeholder="Testo messaggio" /></label>
      <label class="filter-field"><span>Stato</span><select v-model="status"><option>Tutti</option><option>NUOVO</option></select></label>
      <label class="filter-field"><span>Stato Msg</span><select v-model="messageStatus"><option>Tutti</option><option>LETTO</option><option>INVIATO</option><option>NESSUN MESSAGGIO</option></select></label>
      <label class="filter-field"><span>Agente</span><select v-model="agent"><option>Tutti</option><option>Agenzia</option><option>NA</option></select></label>
      <label class="filter-field"><span>Proprietà</span><select><option>Tutte</option></select></label>
      <label class="filter-field"><span>Zona</span><select><option>Tutte</option></select></label>
      <label class="filter-field"><span>Batch</span><select><option>Tutti</option></select></label>
      <label class="filter-field"><span>N. Messaggi</span><select><option>Tutti</option><option>Con messaggi</option><option>Senza messaggi</option></select></label>
      <label class="filter-field"><span>Group Tag</span><select><option>Tutti</option></select></label>
      <label class="filter-field"><span>Telefono</span><select><option>Tutti</option><option>Presente</option><option>Assente</option></select></label>
      <button class="tag-filter">▸ Tag cliente (0 selezionati)</button><label class="new-only"><input v-model="onlyNew" type="checkbox" /> Solo nuovi</label>
      <label class="filter-field compact-field"><span>Locali min</span><input type="number" placeholder="es. 2" /></label><label class="filter-field compact-field"><span>Locali max</span><input type="number" placeholder="es. 5" /></label><button class="qa-filter">♧ FILTRO QA</button>
      <div class="filter-actions"><button class="solid-red" @click="applyFilters">FILTRA</button><button class="reset-button" @click="resetFilters">RESET</button></div>
    </section>
    <button class="columns-toggle" @click="customColumns = !customColumns">▸ ▥ PERSONALIZZA COLONNE</button>
    <div v-if="customColumns" class="column-prefs">Seleziona le colonne da mostrare: <label v-for="col in ['Zona','Proprietà','Agente','Messaggi']" :key="col"><input type="checkbox" checked />{{ col }}</label></div>
    <div class="lead-table-wrap"><table class="lead-table"><thead><tr><th><input type="checkbox" aria-label="Seleziona tutti" /></th><th>NOME</th><th>FLUSSO</th><th>EMAIL</th><th>TELEFONO</th><th>STATO</th><th>GROUP TAG</th><th>FONTE</th><th>ZONA</th><th>PROP.</th><th>AGENTE</th><th>MESSAGGI</th><th>SUM</th><th>CREATO</th><th>AZIONI</th></tr></thead><tbody><tr v-for="lead in rows" :key="lead.name"><td><input type="checkbox" :aria-label="`Seleziona ${lead.name}`" /></td><td><strong>{{ lead.name }}</strong><small>◉</small></td><td><span class="flow-pill">{{ lead.flow }}</span></td><td><button class="contact-link" aria-label="Email">✉</button></td><td><span class="contact-link">{{ lead.phone ? '☎' : '—' }}</span></td><td><span class="lead-status">{{ lead.status }}</span></td><td>–</td><td>{{ lead.source }}</td><td>–</td><td>{{ lead.agent === 'Agenzia' ? '1' : '0' }}</td><td>{{ lead.agent }}</td><td class="message-number">{{ lead.messages }}</td><td><span :class="lead.read === 'LETTO' ? 'read-pill' : 'unread-pill'">{{ lead.read }}</span></td><td>{{ lead.created }}</td><td><div class="row-actions"><button title="Visualizza" @click="modal=`Lead: ${lead.name}`">◎</button><button title="Modifica" @click="modal=`Modifica: ${lead.name}`">✎</button><button title="Messaggi" @click="modal=`Messaggi: ${lead.name}`">☏</button><button title="Elimina" @click="modal=`Elimina: ${lead.name}`">⌫</button></div></td></tr><tr v-if="!rows.length"><td colspan="15" class="no-leads">Nessun lead corrisponde ai filtri selezionati.</td></tr></tbody></table></div>
    <footer class="lead-pagination"><label>Record per pagina: <select><option>15</option><option>25</option><option>50</option></select></label><span>Showing {{ rows.length ? (page - 1) * 15 + 1 : 0 }} to {{ rows.length ? Math.min(page * 15, rows.length) : 0 }} of {{ filtered ? rows.length : 6663 }} results</span><div><button @click="page = Math.max(1, page - 1)">‹</button><button class="current-page-number">{{ page }}</button><button v-for="n in [2,3,4,5]" :key="n" @click="page=n">{{ n }}</button><button>…</button><button>445</button><button @click="page++">›</button></div></footer>
    <div v-if="modal" class="lead-modal-backdrop" @click.self="modal = ''"><section class="lead-modal" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Chiudi" @click="modal = ''">×</button><h2>{{ modal }}</h2><p>Questa azione è pronta per essere collegata ai dati del CRM.</p><button class="solid-red" @click="modal = ''">CHIUDI</button></section></div>
  </section>
</template>
