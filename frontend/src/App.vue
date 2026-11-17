<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import DashboardSection from './sections/DashboardSection.vue'
import FollowUpSection from './sections/FollowUpSection.vue'
import CalendarSection from './sections/CalendarSection.vue'
import AgentsSection from './sections/AgentsSection.vue'
import LeadsSection from './sections/LeadsSection.vue'
import PropertiesSection from './sections/PropertiesSection.vue'
import DataMatchSection from './sections/DataMatchSection.vue'
import AppointmentsSection from './sections/AppointmentsSection.vue'

const activeNav = ref('Dashboard')
const sidebarOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <button class="mobile-menu" aria-label="Apri menu" @click="sidebarOpen = !sidebarOpen">&#9776;</button>
    <Sidebar :open="sidebarOpen" :active-nav="activeNav" @select="activeNav = $event; sidebarOpen = false" />
    <main class="main-area">
      <FollowUpSection v-if="activeNav === 'Follow Up'" />
      <CalendarSection v-else-if="activeNav === 'Calendario'" />
      <AgentsSection v-else-if="activeNav === 'Agenti'" />
      <LeadsSection v-else-if="activeNav === 'Lead'" />
      <PropertiesSection v-else-if="activeNav === 'Proprietà'" />
      <DataMatchSection v-else-if="activeNav === 'Incrocio dati'" />
      <AppointmentsSection v-else-if="activeNav === 'Appuntamenti'" />
      <template v-else>
        <header class="page-header"><h1>DASHBOARD AMMINISTRATORE</h1><span class="current-page">{{ activeNav }}</span></header>
        <DashboardSection />
      </template>
    </main>
  </div>
</template>
