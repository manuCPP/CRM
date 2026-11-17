<script setup>
import { computed, ref } from 'vue'

const weekOffset = ref(0)
const view = ref('Settimana')
const refreshedAt = ref('12:29:58')
const viewOptions = ['Mese', 'Settimana', 'Giorno', 'Lista']
const weekdays = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
const baseMonday = new Date(2026, 10, 16)
const weekDates = computed(() => {
  const monday = new Date(baseMonday)
  monday.setDate(monday.getDate() + weekOffset.value * 7)
  return weekdays.map((name, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return { name, day: date.getDate(), date }
  })
})
const weekLabel = computed(() => {
  const first = weekDates.value[0].date
  const last = weekDates.value[6].date
  const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
  return `${first.getDate()} – ${last.getDate()} ${months[last.getMonth()]} ${last.getFullYear()}`
})
const hours = Array.from({ length: 14 }, (_, index) => index + 8)
const toggle = ref('')
const refresh = () => {
  refreshedAt.value = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
}
</script>

<template>
  <section class="calendar-view" aria-label="Calendario appuntamenti">
    <header class="calendar-titlebar">
      <h1>CALENDARIO APPUNTAMENTI</h1>
      <button class="calendar-refresh" @click="refresh"><span aria-hidden="true">↻</span> AGGIORNA</button>
    </header>
    <div class="calendar-content">
      <div class="calendar-tools">
        <div class="calendar-tool-group">
          <button v-for="name in ['Filtri e vista', 'Condivisione', 'Collegamenti e guida']" :key="name" class="calendar-tool" @click="toggle = toggle === name ? '' : name" :aria-expanded="toggle === name">
            <span class="tool-triangle" aria-hidden="true">{{ toggle === name ? '▾' : '▸' }}</span>{{ name }}
          </button>
          <button class="calendar-personal">IMPEGNO PERSONALE / FERIE</button>
        </div>
        <span v-if="toggle" class="calendar-tool-note">{{ toggle }} · Vista globale per tutti gli agenti</span>
      </div>
      <div class="calendar-meta"><strong>Vista globale — tutti gli agenti.</strong><span>Dati caricati alle {{ refreshedAt }} · Aggiornamento ogni 5 minuti</span></div>
      <div class="calendar-controls">
        <div class="calendar-nav">
          <div class="calendar-arrows"><button aria-label="Settimana precedente" @click="weekOffset--">‹</button><button aria-label="Settimana successiva" @click="weekOffset++">›</button></div>
          <button class="calendar-today" @click="weekOffset = 0">Oggi</button>
        </div>
        <h2>{{ weekLabel }}</h2>
        <div class="calendar-views" aria-label="Vista calendario">
          <button v-for="option in viewOptions" :key="option" :class="{ selected: view === option }" @click="view = option">{{ option }}</button>
        </div>
      </div>
      <div class="calendar-scroll">
        <div v-if="view === 'Lista'" class="calendar-list">
          <article v-for="day in weekDates" :key="`list-${day.name}`"><strong>{{ day.name }} {{ day.day }}</strong><span>Nessun appuntamento programmato</span></article>
        </div>
        <div v-else class="calendar-grid" :class="`view-${view.toLowerCase()}`">
          <div class="calendar-corner"></div>
          <div v-for="day in weekDates" :key="day.name" class="calendar-dayhead">
            <span>{{ day.name }}</span><strong>{{ day.day }}</strong>
          </div>
          <div class="calendar-all-day-label">Tutto il<br />giorno</div>
          <div v-for="day in weekDates" :key="`all-${day.name}`" class="calendar-all-day" :class="{ 'today-column': day.name === 'MAR' && weekOffset === 0 }"></div>
          <template v-for="hour in hours" :key="hour">
            <div class="calendar-hour">{{ hour }}</div>
            <div v-for="day in weekDates" :key="`${hour}-${day.name}`" class="calendar-slot" :class="{ 'today-column': day.name === 'MAR' && weekOffset === 0 }"></div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
