<script setup>
defineProps({ open: Boolean, activeNav: String })
const navItems = [
  { icon: '⌂', label: 'Dashboard' },
  { icon: '☑', label: 'Follow Up' },
  { icon: '▦', label: 'Calendario' },
  { icon: '♙', label: 'Agenti' },
  { icon: '♟', label: 'Lead' },
  { icon: '▤', label: 'Proprietà' },
  { icon: '▽', label: 'Incrocio dati' },
  { icon: '▣', label: 'Appuntamenti' },
  { icon: '⚙', label: 'Configurazioni', expandable: true },
]
</script>

<template>
    <aside class="sidebar" :class="{ 'sidebar-open': open }">
      <div class="brand"><span class="brand-mark">◆<i>◆</i></span><span>professione<span class="brand-red">casa</span><small>®</small></span></div>
      <nav aria-label="Navigazione principale">
        <button v-for="item in navItems" :key="item.label" class="nav-item" :class="{ active: activeNav === item.label }" @click="$emit('select', item.label)">
          <span class="nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span><span v-if="item.expandable" class="chevron">⌄</span>
        </button>
      </nav>
    </aside>
</template>
