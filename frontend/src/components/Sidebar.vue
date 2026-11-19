<script setup>
defineProps({
  open: Boolean,
  activeNav: String,
  agencyName: { type: String, default: 'CRM Immobiliare' },
  agencyLocation: { type: String, default: '' },
})
const navItems = [
  { icon: 'D', label: 'Dashboard' },
  { icon: 'L', label: 'Lead' },
]
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': open }">
    <div class="brand"><span class="brand-mark">{{ agencyName.slice(0, 2).toUpperCase() }}</span><span class="brand-name">{{ agencyName }}<small v-if="agencyLocation">{{ agencyLocation }}</small></span></div>
    <nav aria-label="Navigazione principale">
      <button v-for="item in navItems" :key="item.label" class="nav-item" :class="{ active: activeNav === item.label }" @click="$emit('select', item.label)">
        <span class="nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.brand-name { min-width: 0; overflow: hidden; font-size: 14px; letter-spacing: -.2px; text-overflow: ellipsis; }
.brand-name small { display: block; margin-top: 2px; color: var(--sidebar-muted); font-size: 9px; font-weight: 550; letter-spacing: .25px; }
.brand-mark { width: 34px; height: 34px; flex: 0 0 34px; display: grid; place-items: center; border-radius: 8px; background: #ffffff12; font-size: 11px; letter-spacing: .5px; }
</style>
