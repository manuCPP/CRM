<script setup>
import { ref } from 'vue'

const query = ref('')
const type = ref('Tutti i tipi')
const tag = ref('Tutti i tag')
const fromDate = ref('')
const toDate = ref('')
const applied = ref(false)
const apply = () => { applied.value = true }
const reset = () => { query.value=''; type.value='Tutti i tipi'; tag.value='Tutti i tag'; fromDate.value=''; toDate.value=''; applied.value=false }
</script>

<template>
  <section class="appointments-page">
    <header class="appointments-heading"><div><span class="section-kicker">PC SCANDIANO / AGENDA</span><h1>Elenco appuntamenti</h1><p>Visualizza e gestisci tutti gli appuntamenti fissati.</p></div></header>
    <section class="appointments-filter"><header class="section-bar"><span>Filtri</span></header><form class="appointment-filter-grid" @submit.prevent="apply">
      <label class="appointment-search"><span>Cerca</span><div><span aria-hidden="true">⌕</span><input v-model="query" placeholder="Cerca titolo o parola..." /></div></label>
      <label><span>Tipo appuntamento</span><select v-model="type"><option>Tutti i tipi</option><option>Visita immobile</option><option>Incontro in agenzia</option><option>Valutazione</option></select></label>
      <label><span>Tag appuntamento</span><select v-model="tag"><option>Tutti i tag</option><option>Acquirente</option><option>Venditore</option><option>Visita</option></select></label>
      <label><span>Da data</span><input v-model="fromDate" type="date" /></label><label><span>A data</span><input v-model="toDate" type="date" /></label>
      <div class="appointment-filter-actions"><button class="appointment-apply" type="submit" aria-label="Applica filtri">⌕</button><button class="appointment-reset" type="button" aria-label="Reset filtri" @click="reset">↻</button></div>
    </form></section>
    <section class="appointments-empty"><span class="empty-calendar-icon" aria-hidden="true">▦</span><strong>Nessun appuntamento trovato con i filtri correnti.</strong><p>{{ applied ? 'Prova a modificare i filtri per ampliare la ricerca.' : 'Gli appuntamenti fissati appariranno qui.' }}</p></section>
  </section>
</template>
