<script setup>
import { ref } from 'vue'

const shareCalendar = ref(true)
const notifications = ref({ single: true, summary: true, telegram: true, news: true, unmatched: true })
const showForm = ref(false)
const copied = ref(false)
const endpoint = 'https://pc-scandiano.nowcrm.it/api/v1/location'
const copyEndpoint = async () => {
  try { await navigator.clipboard.writeText(endpoint); copied.value = true; setTimeout(() => copied.value = false, 1800) }
  catch { copied.value = false }
}
</script>

<template>
  <section class="agents-page">
    <header class="records-titlebar"><h1>GESTIONE AGENTI</h1><button class="record-primary" @click="showForm = !showForm">{{ showForm ? 'CHIUDI' : 'NUOVO AGENTE' }}</button></header>
    <form v-if="showForm" class="agent-create" @submit.prevent="showForm = false"><label>Nome<input placeholder="Nome agente" required /></label><label>Email<input type="email" placeholder="nome@agenzia.it" required /></label><button class="solid-red">AGGIUNGI AGENTE</button></form>
    <div class="agent-table-wrap">
      <table class="agent-table"><thead><tr><th>ID</th><th>IMMAGINE</th><th>NOME</th><th>TITOLO</th><th>EMAIL</th><th>TELEFONO</th><th>SPECIALIZZAZIONE</th><th>STATO</th><th>CONDIVISIONE CALENDARIO</th><th>NOTIFICHE APPUNTAMENTI</th><th>AZIONI</th></tr></thead>
        <tbody><tr><td>11</td><td><div class="agent-avatar">PC</div></td><td>Agenzia<small>GPS non disponibile</small></td><td>agenzia</td><td>ag.scandiano@professionecasa.it</td><td>0522 082601</td><td>Residenziale</td><td><span class="status-pill">ATTIVO</span></td><td><label class="share-toggle"><input v-model="shareCalendar" type="checkbox" /><span></span>Agenzia — condividi dettagli</label><button class="outline-blue">SALVA</button><small>Attivo: i colleghi vedono i dettagli.<br />Disattivo: vedono «Occupato».</small></td><td><div class="notify-list"><label v-for="(value, key) in notifications" :key="key" :class="`notify-${key}`"><span>{{ ({single:'EMAIL SINGOLO',summary:'EMAIL RIEPILOGO',telegram:'TELEGRAM',news:'TG NOTIZIE',unmatched:'PROP. NON TROVATA'})[key] }}</span><input v-model="notifications[key]" type="checkbox" /><b>{{ value ? 'ON' : 'OFF' }}</b></label></div></td><td><div class="agent-actions"><button @click="showForm = true">VISUALIZZA</button><button @click="showForm = true">MODIFICA</button><button @click="showForm = true">ELIMINA</button></div></td></tr></tbody>
      </table>
    </div>
    <section class="endpoint-card"><header>ENDPOINT DI LOCALIZZAZIONE</header><div class="endpoint-body"><div class="qr-placeholder" aria-label="Codice QR segnaposto"><span></span></div><div class="endpoint-info"><p>Scansiona questo QR code con il tuo dispositivo mobile per configurare il tracciamento GPS:</p><div class="endpoint-copy"><input :value="endpoint" readonly aria-label="Endpoint di localizzazione" /><button @click="copyEndpoint">{{ copied ? 'COPIATO' : '▢ COPIA' }}</button></div><small>Questo endpoint è generico e può essere utilizzato da tutti gli agenti.</small></div></div></section>
  </section>
</template>
