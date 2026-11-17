<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const propertyType = ref('Tutte')
const zone = ref('Tutte')
const priceMin = ref('')
const priceMax = ref('')
const sizeMin = ref('')
const sizeMax = ref('')
const bedrooms = ref('')
const bathrooms = ref('')
const roomsMin = ref('')
const roomsMax = ref('')
const featureName = ref('')
const featureValue = ref('')
const message = ref('')
const homes = [
  { id:98,title:'VILLA MINOZZO VILLA SINGOLA CON TERRENO, VISTA PANORAMICA',price:135000,zone:'Villa Minozzo',type:'Casa' },
  { id:97,title:'Appartamento',price:330000,zone:'Quattro Castella',type:'Appartamento' },
  { id:95,title:'Casa indipendente in vendita - Via Sebastiano Corrado, Scandiano',price:350000,zone:'Scandiano',type:'Casa' },
  { id:92,title:'Villa bifamiliare in vendita',price:430000,zone:'Scandiano',type:'Villa' },
  { id:91,title:'SABBIANO-LUMINOSO ATTICO MANSARDATO',price:800,zone:'Sabbiano',type:'Appartamento' },
  { id:90,title:'SABBIONE-ELEGANTE APPARTAMENTO CON GIARDINO E GARAGE DOPPIO',price:1000,zone:'Sabbione',type:'Appartamento' },
  { id:89,title:'Villa a schiera in vendita a Scandiano',price:365000,zone:'Scandiano',type:'Villa' },
  { id:88,title:'Appartamento in vendita a Cadelbosco di Sopra',price:128000,zone:'Cadelbosco di Sopra',type:'Appartamento' },
  { id:87,title:'Appartamento in vendita a Scandiano',price:280000,zone:'Scandiano',type:'Appartamento' },
  { id:86,title:'VEZZANO, PORZIONE DI CASA CON INGRESSO INDIPENDENTE',price:79000,zone:'Vezzano sul Crostolo',type:'Casa' },
  { id:85,title:'MAISONETTE CON GIARDINO AD ANGOLO',price:275000,zone:'Scandiano',type:'Casa' },
]
const results = computed(() => homes.filter(home => (!search.value || home.title.toLowerCase().includes(search.value.toLowerCase())) && (propertyType.value === 'Tutte' || home.type === propertyType.value) && (zone.value === 'Tutte' || home.zone === zone.value) && (!priceMin.value || home.price >= Number(priceMin.value)) && (!priceMax.value || home.price <= Number(priceMax.value))))
const clear = () => { search.value=''; propertyType.value='Tutte'; zone.value='Tutte'; priceMin.value=''; priceMax.value=''; sizeMin.value=''; sizeMax.value=''; bedrooms.value=''; bathrooms.value=''; roomsMin.value=''; roomsMax.value=''; featureName.value=''; featureValue.value='' }
const formatPrice = value => new Intl.NumberFormat('it-IT', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(value)
const action = label => { message.value = `${label}: funzione dimostrativa` }
</script>

<template>
  <section class="match-page">
    <header class="match-heading"><div><span class="section-kicker">PC SCANDIANO / RICERCA</span><h1>Incrocio dati</h1><p>Trova gli immobili compatibili con le esigenze dei lead.</p></div><button class="match-secondary" @click="action('Batch invii')">Batch invii</button></header>
    <section class="match-panel"><header class="section-bar"><span>Filtri immobili</span><small>Affina la ricerca</small></header><div class="match-fields">
      <label><span>Ricerca</span><input v-model="search" placeholder="Titolo, indirizzo, descrizione" /></label><label><span>Tipologia</span><select v-model="propertyType"><option>Tutte</option><option>Appartamento</option><option>Casa</option><option>Villa</option></select></label><label><span>Zona</span><select v-model="zone"><option>Tutte</option><option>Scandiano</option><option>Quattro Castella</option><option>Villa Minozzo</option><option>Sabbiano</option></select></label><label><span>Interesse di mercato del lead</span><select><option>Qualunque</option><option>Vendita</option><option>Affitto</option></select></label>
      <label><span>Prezzo min</span><input v-model="priceMin" type="number" placeholder="€" /></label><label><span>Prezzo max</span><input v-model="priceMax" type="number" placeholder="€" /></label><label><span>Mq min</span><input v-model="sizeMin" type="number" placeholder="m²" /></label><label><span>Mq max</span><input v-model="sizeMax" type="number" placeholder="m²" /></label><label><span>Camere min</span><input v-model="bedrooms" type="number" min="0" /></label><label><span>Bagni min</span><input v-model="bathrooms" type="number" min="0" /></label><label><span>Locali min</span><input v-model="roomsMin" type="number" min="0" /></label><label><span>Locali max</span><input v-model="roomsMax" type="number" min="0" /></label>
      <div class="feature-editor"><span>Servizi / Caratteristiche</span><div><input v-model="featureName" placeholder="Caratteristica" /><select v-model="featureValue"><option value="">Seleziona valore (opzionale)</option><option>Sì</option><option>No</option></select><button class="match-remove" @click="featureName='';featureValue=''">Rimuovi</button></div><button class="match-add" @click="action('Aggiungi caratteristica')">＋ Aggiungi caratteristica</button><small>Se inserisci solo il nome, verrà filtrata la presenza della chiave. Se inserisci anche il valore, il match sarà esatto.</small></div>
      <div class="match-actions"><button class="match-primary" @click="message = `${results.length} immobili compatibili trovati`">Cerca</button><button class="match-reset" @click="clear">Reset</button></div>
    </div></section>
    <p v-if="message" class="match-notice" role="status">{{ message }} <button @click="message = ''">×</button></p>
    <section class="match-panel match-results"><header class="section-bar"><span>Risultati</span><small>{{ results.length }} immobili</small></header><div class="match-table-wrap"><table class="match-table"><thead><tr><th>Immobile</th><th>Prezzo</th><th>Zona</th><th>Lead compatibili</th><th>Azioni</th></tr></thead><tbody><tr v-for="home in results" :key="home.id"><td><div class="match-property"><div class="mini-property-placeholder">⌂</div><div><small>ID {{ home.id }}</small><strong>{{ home.title }}</strong></div></div></td><td>{{ formatPrice(home.price) }}</td><td>{{ home.zone }}</td><td><span class="match-count">0</span></td><td><div class="match-row-actions"><button @click="action(`Lead immobile ${home.id}`)">Lead / invia</button><button @click="action(`Modifica immobile ${home.id}`)">Modifica</button></div></td></tr><tr v-if="!results.length"><td colspan="5" class="match-empty">Nessun immobile corrisponde ai filtri selezionati.</td></tr></tbody></table></div></section>
  </section>
</template>
