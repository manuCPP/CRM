<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const type = ref('Tutte le tipologie')
const status = ref('Tutti gli stati')
const priceMin = ref('')
const priceMax = ref('')
const message = ref('')
const properties = [
  { id:98, title:'VILLA MINOZZO VILLA SINGOLA CON TERRENO, VISTA PANORAMICA', price:135000, type:'Casa', address:'Villa Minozzo, Reggio Emilia', rooms:5, baths:2, area:180, date:'23/10/2026 15:18', status:'Disponibile', leads:0 },
  { id:97, title:'Appartamento', price:330000, type:'Appartamento', address:'Via Alva Myrdal, Quattro Castella, Reggio Emilia', rooms:4, baths:2, area:145, date:'23/10/2026 15:16', status:'Nessuna zona', leads:0 },
  { id:95, title:'Casa indipendente in vendita - Via Sebastiano Corrado, Scandiano', price:350000, type:'Casa', address:'Via Sebastiano Corrado, Scandiano, Reggio Emilia', rooms:5, baths:2, area:190, date:'23/10/2026 15:14', status:'Disponibile', leads:1 },
  { id:92, title:'Villa bifamiliare in vendita', price:430000, type:'Villa', address:'Scandiano, Reggio Emilia', rooms:6, baths:3, area:220, date:'23/10/2026 15:12', status:'Nessuna disponibilità', leads:0 },
  { id:91, title:'SABBIANO-LUMINOSO ATTICO MANSARDATO', price:800, type:'Appartamento', address:'Sabbiano, Scandiano, Reggio Emilia', rooms:3, baths:2, area:95, date:'23/10/2026 15:10', status:'Nessuna disponibilità', leads:0 },
  { id:90, title:'SABBIONE-ELEGANTE APPARTAMENTO CON GIARDINO E GARAGE DOPPIO', price:1000, type:'Appartamento', address:'Via Eugenio Curiel, Reggio Emilia', rooms:3, baths:2, area:116, date:'23/10/2026 15:17', status:'Disponibile', leads:4 },
  { id:89, title:'Villa a schiera in vendita a Scandiano', price:365000, type:'Villa', address:'Via I Maggio 14/5, Scandiano, Reggio Emilia', rooms:3, baths:3, area:204, date:'23/10/2026 15:15', status:'Disponibile', leads:2 },
  { id:88, title:'Appartamento in vendita a Cadelbosco di Sopra', price:128000, type:'Appartamento', address:'Via I Maggio 14/5, Cadelbosco di Sopra', rooms:2, baths:1, area:71, date:'23/10/2026 15:13', status:'Disponibile', leads:2 },
  { id:87, title:'Appartamento in vendita a Scandiano', price:280000, type:'Appartamento', address:'Scandiano, Reggio Emilia', rooms:2, baths:2, area:90, date:'23/10/2026 15:11', status:'Disponibile', leads:0 },
  { id:86, title:'VEZZANO, PORZIONE DI CASA CON INGRESSO INDIPENDENTE', price:79000, type:'Casa', address:'Via Travaglioli, Vezzano sul Crostolo, Reggio Emilia', rooms:4, baths:1, area:120, date:'23/10/2026 15:05', status:'Disponibile', leads:2 },
  { id:85, title:'MAISONETTE CON GIARDINO AD ANGOLO', price:275000, type:'Casa', address:'Via Partitora, Scandiano, Reggio Emilia', rooms:2, baths:2, area:116, date:'23/10/2026 14:59', status:'Nessuna disponibilità', leads:0 },
  { id:84, title:'Appartamento in affitto', price:750, type:'Appartamento', address:'Scandiano, Reggio Emilia', rooms:2, baths:1, area:80, date:'23/10/2026 14:55', status:'Disponibile', leads:0 },
  { id:83, title:'Villa a schiera in vendita a Scandiano', price:195000, type:'Villa', address:'Scandiano, Reggio Emilia', rooms:4, baths:2, area:130, date:'23/10/2026 14:50', status:'Disponibile', leads:2 },
  { id:82, title:'Villa a schiera in vendita a Scandiano', price:330000, type:'Villa', address:'Scandiano, Reggio Emilia', rooms:5, baths:2, area:155, date:'23/10/2026 14:45', status:'Nessuna disponibilità', leads:0 },
  { id:81, title:'Villa a schiera', price:290000, type:'Villa', address:'Scandiano, Reggio Emilia', rooms:4, baths:2, area:145, date:'23/10/2026 14:40', status:'Disponibile', leads:1 },
]
const visibleProperties = computed(() => properties.filter(item => {
  const query = search.value.trim().toLowerCase()
  return (!query || `${item.title} ${item.address}`.toLowerCase().includes(query)) &&
    (type.value === 'Tutte le tipologie' || item.type === type.value) &&
    (status.value === 'Tutti gli stati' || item.status === status.value) &&
    (!priceMin.value || item.price >= Number(priceMin.value)) && (!priceMax.value || item.price <= Number(priceMax.value))
}))
const reset = () => { search.value=''; type.value='Tutte le tipologie'; status.value='Tutti gli stati'; priceMin.value=''; priceMax.value='' }
const formatPrice = value => new Intl.NumberFormat('it-IT', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(value)
const action = name => { message.value = `${name}: funzione dimostrativa` }
</script>

<template>
  <section class="properties-page">
    <header class="properties-heading"><div><span class="section-kicker">PC SCANDIANO / IMMOBILI</span><h1>Gestione proprietà</h1><p>Annunci e disponibilità degli immobili</p></div><div class="property-tools"><button class="property-secondary" @click="action('Archiviate')">Archiviate</button><button class="property-secondary" @click="action('Importa da URL')">＋ Importa da URL</button><button class="property-primary" @click="action('Nuova proprietà')">＋ Nuova proprietà</button></div></header>
    <section class="property-filters"><header class="section-bar"><span>Filtra proprietà</span><small>{{ visibleProperties.length }} immobili</small></header><div class="property-filter-grid"><label class="property-search"><span>Ricerca</span><input v-model="search" placeholder="Titolo, indirizzo, descrizione" /></label><label><span>Tipologia</span><select v-model="type"><option>Tutte le tipologie</option><option>Appartamento</option><option>Casa</option><option>Villa</option></select></label><label><span>Stato</span><select v-model="status"><option>Tutti gli stati</option><option>Disponibile</option><option>Nessuna disponibilità</option><option>Nessuna zona</option></select></label><label><span>Prezzo min</span><input v-model="priceMin" type="number" placeholder="€" /></label><label><span>Prezzo max</span><input v-model="priceMax" type="number" placeholder="€" /></label><button class="property-primary filter-submit">Filtra</button><button class="property-reset" @click="reset">Reset</button></div></section>
    <p v-if="message" class="property-notice" role="status">{{ message }} <button aria-label="Chiudi" @click="message = ''">×</button></p>
    <div class="property-grid"><article v-for="item in visibleProperties" :key="item.id" class="property-card">
      <div class="property-placeholder" aria-label="Immagine immobile non disponibile"><span aria-hidden="true">⌂</span><small>Foto immobile</small><b>#{{ item.id }}</b></div>
      <div class="property-card-body"><div class="property-card-top"><span class="property-type">{{ item.type }}</span><span class="property-id">ID {{ item.id }}</span></div><h2>{{ item.title }}</h2><strong class="property-price">{{ formatPrice(item.price) }}</strong><p class="property-address">{{ item.address }}</p><div class="property-facts"><span>{{ item.rooms }} camere</span><span>{{ item.baths }} bagni</span><span>{{ item.area }} m²</span></div><div class="property-owner">Agente <b>Agenzia</b><span>Creato il {{ item.date }}</span></div><div class="property-badges"><span class="availability-badge" :class="{ unavailable: item.status !== 'Disponibile' }">{{ item.status }}</span><span class="zone-badge">Nessuna zona</span></div></div>
      <footer class="property-card-actions"><span class="compatible-count">♧ <b>{{ item.leads }}</b></span><div><button class="view-action" title="Visualizza" @click="action(`Visualizza immobile ${item.id}`)">◎</button><button title="Modifica" @click="action(`Modifica immobile ${item.id}`)">✎</button><button title="Elimina" @click="action(`Elimina immobile ${item.id}`)">⌫</button></div></footer>
    </article><div v-if="!visibleProperties.length" class="property-empty">Nessuna proprietà trovata con i filtri correnti.</div></div>
    <footer class="property-pagination"><span>Showing {{ visibleProperties.length }} of 71 results</span><div><button>‹</button><button class="selected">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button></div></footer>
  </section>
</template>
