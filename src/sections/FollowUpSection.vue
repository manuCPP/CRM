<script setup>
import { computed, ref } from 'vue'

const formatFollowupLabel = (value) => {
  const label = value.replace(/^nowcrm_pc_/, '').replace(/_/g, ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const followupGroups = [
  { status: 'acquirente_che_vende', rows: [
    { order: 0, name: 'nowcrm_pc_acquirente_deve_vendere_1', template: 'nowcrm_pc_acquirente_deve_vendere_1', message: 'Salve, sono Viola di Professionecasa Scandiano, v...', delay: 168 },
    { order: 1, name: 'nowcrm_pc_acquirente_deve_vendere_2', template: 'nowcrm_pc_acquirente_deve_vendere_2', message: 'Salve, sono Viola di Professionecasa Scandiano, c...', delay: 168 },
  ]},
  { status: 'acquirente_con_mutuo', rows: [
    { order: 0, name: 'nowcrm_pc_acquirente_mutuo_1', template: 'nowcrm_pc_acquirente_mutuo_1', message: 'Salve, sono Viola di Professionecasa Scandiano, pos...', delay: 168 },
    { order: 1, name: 'nowcrm_pc_acquirente_mutuo_2', template: 'nowcrm_pc_acquirente_mutuo_2', message: 'Salve, sono Viola di Professionecasa Scandiano, sic...', delay: 168 },
    { order: 2, name: 'nowcrm_pc_acquirente_mutuo_3', template: 'nowcrm_pc_acquirente_mutuo_3', message: 'Salve, sono Viola di Professionecasa Scandiano, non...', delay: 168 },
  ]},
  { status: 'acquirente_senza_esigenze', rows: [
    { order: 1, name: 'nowcrm_pc_acquisto_senza_esigenze_1', template: 'nowcrm_pc_acquisto_senza_esigenze_1', message: 'Salve, sono Viola di Professionecasa Scandiano, v...', delay: 240 },
    { order: 2, name: 'nowcrm_pc_acquisto_senza_esigenze_2', template: 'nowcrm_pc_acquisto_senza_esigenze_2', message: 'Salve, sono Viola di Professionecasa Scandiano, c...', delay: 360 },
  ]},
  { status: 'appuntamento_acquisto_mutuo_fatto', rows: [
    { order: 1, name: 'appuntamento acquisto mutuo fatto', template: 'nowcrm_pc_richiesta_locazione_2', message: 'Salve, sono Viola di Professionecasa Scandiano, vol...', delay: 24 },
  ]},
  { status: 'appuntamento_acquisto_normale_fatto', rows: [
    { order: 1, name: 'appuntamento acquisto normale fatto', template: 'nowcrm_pc_richiesta_locazione_2', message: 'Salve, sono Viola di Professionecasa Scandiano, vol...', delay: 24 },
  ]},
  { status: 'appuntamento_acquisto_vendere_fatto', rows: [
    { order: 1, name: 'appuntamento acquisto vendere fatto', template: 'nowcrm_pc_richiesta_locazione_2', message: 'Salve, sono Viola di Professionecasa Scandiano, vol...', delay: 24 },
  ]},
  { status: 'appuntamento_locazione_fatto', rows: [
    { order: 1, name: 'nowcrm_pc_richiesta_locazione_2', template: 'nowcrm_pc_richiesta_locazione_2', message: 'Salve, sono Viola di Professionecasa Scandiano, vol...', delay: 24 },
  ]},
  { status: 'lead_generico', rows: [
    { order: 0, name: 'nowcrm_pc_leadgenerico_1', template: 'Lead generico', message: 'Salve, sono Viola di Professionecasa Scandiano, ...', delay: 24 },
  ]},
  { status: 'locatore', rows: [
    { order: 0, name: 'nowcrm_pc_locatore_1', template: 'nowcrm_pc_locatore_1', message: 'Salve, sono Viola di Professionecasa Scandiano, pos...', delay: 168 },
    { order: 1, name: 'nowcrm_pc_locatore_2', template: 'nowcrm_pc_locatore_2', message: 'Salve, sono Viola di Professionecasa Scandiano, sic...', delay: 168 },
    { order: 2, name: 'nowcrm_pc_locatore_3', template: 'nowcrm_pc_locatore_3', message: 'Salve, sono Viola di Professionecasa Scandiano, non...', delay: 168 },
  ]},
  { status: 'richiesta_locazione', rows: [
    { order: 2, name: 'nowcrm_pc_richiesta_locazione_3', template: 'nowcrm_pc_richiesta_locazione_3', message: 'Salve, sono Viola di Professionecasa Scandiano, ...', delay: 360 },
    { order: 3, name: 'nowcrm_pc_richiesta_locazione_4', template: 'nowcrm_pc_richiesta_locazione_4', message: 'Salve, sono Viola di Professionecasa Scandiano, ...', delay: 360 },
  ]},
  { status: 'venditore', rows: [
    { order: 0, name: 'nowcrm_pc_venditore_1', template: 'nowcrm_pc_venditore_1', message: 'Salve, sono Viola di Professionecasa Scandiano, v...', delay: 168 },
    { order: 1, name: 'nowcrm_pc_venditore_2', template: 'nowcrm_pc_venditore_2', message: 'Salve, sono Viola di Professionecasa Scandiano', delay: 168 },
    { order: 2, name: 'nowcrm_pc_venditore_3', template: 'nowcrm_pc_venditore_3', message: 'Salve, sono Viola di Professionecasa Scandiano, non...', delay: 168 },
  ]},
]
const followupStatusFilter = ref('')
const appliedFollowupStatus = ref('')
const filteredFollowupGroups = computed(() => followupGroups.filter(group =>
  !appliedFollowupStatus.value || group.status === appliedFollowupStatus.value
))
const applyFollowupFilter = () => { appliedFollowupStatus.value = followupStatusFilter.value }
const totalFollowups = followupGroups.reduce((total, group) => total + group.rows.length, 0)
</script>

<template>
  <section class="followup-view">
    <header class="followup-page-heading">
      <div>
        <span class="followup-eyebrow">PC SCANDIANO / AUTOMAZIONI</span>
        <h1>Follow Up</h1>
        <p>Sequenze organizzate per stato del lead</p>
      </div>
      <div class="followup-overview">
        <strong>{{ totalFollowups }}</strong>
        <span>sequenze</span>
      </div>
    </header>

    <div class="followup-toolbar">
      <button class="followup-new" type="button">Nuovo follow up</button>
      <form class="followup-filters" @submit.prevent="applyFollowupFilter">
        <label for="followup-status-filter">Stato del lead</label>
        <select id="followup-status-filter" v-model="followupStatusFilter">
          <option value="">Tutti gli stati</option>
          <option v-for="group in followupGroups" :key="group.status" :value="group.status">
            {{ formatFollowupLabel(group.status) }}
          </option>
        </select>
        <button type="submit">Filtra</button>
      </form>
    </div>

    <div class="followup-groups">
      <details
        v-for="(group, index) in filteredFollowupGroups"
        :key="group.status"
        class="followup-group"
        :open="filteredFollowupGroups.length === 1 || (!appliedFollowupStatus && index === 0)"
      >
        <summary class="followup-group-summary">
          <span class="followup-group-toggle" aria-hidden="true">+</span>
          <span class="followup-group-title">
            <strong>{{ formatFollowupLabel(group.status) }}</strong>
            <small>{{ group.rows.length }} regole attive</small>
          </span>
          <span class="followup-group-count">{{ group.rows.length }}</span>
        </summary>

        <div class="followup-group-rows">
          <article v-for="row in group.rows" :key="row.name" class="followup-item">
            <div class="followup-order">
              <span>Ordine</span>
              <strong>{{ row.order }}</strong>
            </div>
            <div class="followup-item-content">
              <div class="followup-item-heading">
                <h2>{{ formatFollowupLabel(row.name) }}</h2>
                <span v-if="row.template !== row.name" class="followup-template-label">
                  Template: {{ formatFollowupLabel(row.template) }}
                </span>
              </div>
              <p class="followup-message">{{ row.message }}</p>
              <div class="followup-meta">
                <span class="followup-channel"><span class="wa-dot"></span>WhatsApp</span>
                <span class="followup-delay">{{ row.delay }} ore</span>
              </div>
            </div>
            <div class="followup-actions">
              <button type="button" class="followup-edit">Modifica</button>
              <button type="button" class="followup-delete">Elimina</button>
            </div>
          </article>
        </div>
      </details>

      <div v-if="filteredFollowupGroups.length === 0" class="followup-empty-state">
        Nessun follow up per questo stato.
      </div>
    </div>
  </section>
</template>
