<script setup>
import { onMounted, ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { instanceConfig } from './config/instance.js'
import DashboardSection from './sections/DashboardSection.vue'
import LeadDetailSection from './sections/LeadDetailSection.vue'
import LeadsSection from './sections/LeadsSection.vue'

function readLeadId() {
  const match = window.location.pathname.match(/^\/(?:index\/)?lead\/([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : ''
}

const leadId = ref(readLeadId())
const activeNav = ref(leadId.value ? 'Lead' : 'Dashboard')
const sidebarOpen = ref(false)
const supabaseUrl = instanceConfig.supabaseUrl
const supabaseKey = instanceConfig.supabasePublishableKey
const accessToken = ref('')
const email = ref('')
const password = ref('')
const authError = ref('')
const authLoading = ref(false)

onMounted(() => {
  try {
    const session = JSON.parse(sessionStorage.getItem('crm-supabase-session') || 'null')
    if (session?.accessToken && session.expiresAt > Date.now()) accessToken.value = session.accessToken
    else sessionStorage.removeItem('crm-supabase-session')
  } catch {
    sessionStorage.removeItem('crm-supabase-session')
  }
  window.addEventListener('popstate', syncRoute)
})

function syncRoute() {
  leadId.value = readLeadId()
  activeNav.value = leadId.value ? 'Lead' : 'Dashboard'
}

function openLead(id) {
  const nextPath = `/index/lead/${encodeURIComponent(String(id))}`
  window.history.pushState({}, '', nextPath)
  leadId.value = String(id)
  activeNav.value = 'Lead'
}

function selectNav(page) {
  if (leadId.value) window.history.pushState({}, '', '/')
  leadId.value = ''
  activeNav.value = page
  sidebarOpen.value = false
}

function returnToLeads() {
  window.history.pushState({}, '', '/')
  leadId.value = ''
  activeNav.value = 'Lead'
}

async function signIn() {
  authError.value = ''
  if (!supabaseUrl || !supabaseKey) {
    authError.value = 'Configura URL e chiave publishable Supabase nel file .env del frontend.'
    return
  }
  authLoading.value = true
  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.msg || result.message || result.error_description || 'Accesso non riuscito. Controlla email e password.')
    const session = { accessToken: result.access_token, expiresAt: Date.now() + result.expires_in * 1000 }
    sessionStorage.setItem('crm-supabase-session', JSON.stringify(session))
    accessToken.value = session.accessToken
    password.value = ''
  } catch (cause) {
    authError.value = cause instanceof Error ? cause.message : "Errore durante l'accesso."
  } finally {
    authLoading.value = false
  }
}

function signOut() {
  sessionStorage.removeItem('crm-supabase-session')
  accessToken.value = ''
  activeNav.value = 'Dashboard'
}
</script>

<template>
  <main v-if="!accessToken" class="auth-screen">
    <form class="auth-card" @submit.prevent="signIn">
      <div class="auth-brand"><span class="brand-mark">{{ instanceConfig.agencyName.slice(0, 2).toUpperCase() }}</span><span>{{ instanceConfig.agencyName }}<small v-if="instanceConfig.agencyLocation"> {{ instanceConfig.agencyLocation }}</small></span></div>
      <p class="auth-eyebrow">AREA RISERVATA</p>
      <h1>Accedi al CRM</h1>
      <p class="auth-description">Usa l'account amministratore Supabase abilitato alla lettura dei lead.</p>
      <label>Email<input v-model.trim="email" type="email" autocomplete="username" required /></label>
      <label>Password<input v-model="password" type="password" autocomplete="current-password" required /></label>
      <p v-if="authError" class="auth-error" role="alert">{{ authError }}</p>
      <button class="auth-submit" type="submit" :disabled="authLoading">{{ authLoading ? 'ACCESSO...' : 'ACCEDI' }}</button>
    </form>
  </main>
  <div class="app-shell">
    <template v-if="accessToken">
    <button class="mobile-menu" aria-label="Apri menu" @click="sidebarOpen = !sidebarOpen">&#9776;</button>
    <Sidebar :open="sidebarOpen" :active-nav="activeNav" :agency-name="instanceConfig.agencyName" :agency-location="instanceConfig.agencyLocation" @select="selectNav" />
    <main class="main-area">
      <button class="auth-signout" @click="signOut">ESCI</button>
      <LeadDetailSection v-if="leadId" :lead-id="leadId" :access-token="accessToken" @back="returnToLeads" />
      <LeadsSection v-else-if="activeNav === 'Lead'" :access-token="accessToken" @open-lead="openLead" />
      <template v-else>
        <header class="page-header"><h1>DASHBOARD AMMINISTRATORE</h1><span class="current-page">{{ activeNav }}</span></header>
        <DashboardSection :agency-name="instanceConfig.agencyName" :agency-location="instanceConfig.agencyLocation" :access-token="accessToken" @navigate="activeNav = $event" @open-lead="openLead" />
      </template>
    </main>
    </template>
  </div>
</template>

<style>
.auth-screen { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f2f3f4; }
.auth-card { width: min(420px, 100%); display: grid; gap: 16px; padding: 32px; border: 1px solid var(--line); border-radius: 12px; background: #fff; box-shadow: 0 12px 40px #20222512; }
.auth-brand { display: flex; align-items: center; gap: 10px; color: var(--ink); font-size: 21px; font-weight: 750; letter-spacing: -.6px; }
.auth-brand .brand-mark { color: var(--red); font-size: 18px; }
.auth-eyebrow { margin: 12px 0 -12px; color: var(--red-dark); font-size: 10px; font-weight: 800; letter-spacing: 1.1px; }
.auth-card h1 { margin: 0; color: var(--ink); font-size: 26px; letter-spacing: -.6px; }
.auth-description { margin: -9px 0 4px; color: var(--muted); font-size: 13px; line-height: 1.55; }
.auth-card label { display: grid; gap: 7px; color: #555d63; font-size: 12px; font-weight: 650; }
.auth-card input { min-height: 42px; padding: 9px 11px; border: 1px solid #d9dcde; border-radius: 6px; color: var(--ink); font: inherit; }
.auth-card input:focus { outline: 2px solid #e52d3520; border-color: var(--red); }
.auth-error { margin: 0; color: var(--red-dark); font-size: 12px; line-height: 1.5; }
.auth-submit { min-height: 42px; border: 0; border-radius: 6px; background: var(--red); color: white; font-size: 11px; font-weight: 800; letter-spacing: .7px; }
.auth-submit:disabled { opacity: .65; cursor: wait; }
.auth-signout { position: fixed; z-index: 20; top: 13px; right: 18px; min-height: 33px; padding: 0 12px; border: 1px solid var(--line); border-radius: 6px; background: #fff; color: #51575c; font-size: 10px; font-weight: 750; }
</style>

