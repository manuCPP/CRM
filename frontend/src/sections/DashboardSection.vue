<script setup>
const leads = [
  { name: 'ROBERTO CARDONE', date: '17/11/2026' },
  { name: 'Salvatore', date: '17/11/2026' },
  { name: 'Giuseppe Dangelo', date: '17/11/2026' },
  { name: 'Piero Rivarone', date: '16/11/2026' },
  { name: 'Priscila Ducatti', date: '16/11/2026', noPhone: true },
]
const days = ['11/11', '12/11', '13/11', '14/11', '15/11', '16/11', '17/11']
</script>

<template>
<div class="dashboard-content">
        

        

        

        

        

        
        <section class="dashboard-section">
          <div class="section-heading">
            <div><span class="section-kicker brand-kicker"><span class="brand-mark-mini" aria-hidden="true"><i></i><i></i></span><span>PROFESSIONECASA</span><span class="brand-location">SCANDIANO</span></span><h2>Panoramica CRM</h2></div>
            <p>Lead, propriet&agrave;, appuntamenti e agenti</p>
          </div>
<section class="entity-grid">
          <article class="entity-card lead-card"><h2>Lead</h2><strong>6663</strong><p><b>5925 nuovi</b> (non ancora aperti)</p><a href="#" @click.prevent="activeNav = 'Lead'">Gestisci Lead <span>›</span></a></article>
          <article class="entity-card property-card"><h2>Proprietà</h2><strong>71</strong><a href="#" @click.prevent="activeNav = 'Proprietà'">Gestisci Proprietà</a></article>
          <article class="entity-card appointment-card"><h2>Appuntamenti</h2><strong>0 / 0</strong><a href="#" @click.prevent="activeNav = 'Appuntamenti'">Gestisci Appuntamenti</a></article>
          <article class="entity-card agent-card"><h2>Agenti</h2><strong>1</strong><a href="#" @click.prevent="activeNav = 'Agenti'">Gestisci Agenti</a></article>
        </section>
        </section>
        <section class="dashboard-section">
          <div class="section-heading">
            <div><span class="section-kicker">PC SCANDIANO</span><h2>Crediti e messaggi</h2></div>
            <p>Utilizzo e servizi attivi</p>
          </div>
<section class="top-grid">
          <article class="usage-card">
            <div><span class="eyebrow">WHATSAPP - LIMITE<br />TEMPLATE 24H</span><strong class="usage-value">3/250 <span>1,2% Uso:</span></strong><p>Uso: 1,2%</p><p>Aggiornato: 2026-11-17<br />04:10:03</p></div>
            <span class="wa-icon" aria-label="WhatsApp">◉</span>
          </article>
          <article class="summary-card">
            <span class="card-label cyan">CREDITI TOTALI</span><strong class="summary-number">3.979</strong>
            <div class="split-stats"><div><span class="red">MENSILI</span><b>2.979</b></div><div><span class="green">ACQUISTATI</span><b>1.000</b></div></div>
            <button class="buy-button">ACQUISTA CREDITI</button>
          </article>
          <article class="summary-card">
            <span class="card-label red">MESSAGGI GESTITI</span><strong class="summary-number">316</strong>
            <div class="split-stats"><div><span class="cyan">↗ INVIATI</span><b>53</b></div><div><span class="cyan">↙ RICEVUTI</span><b>263</b></div></div>
          </article>
          <article class="summary-card feature-card">
            <span class="card-label orange">FUNZIONALITÀ ATTIVE</span><strong class="feature-count">1</strong><p><span class="check">✓</span> Whatsapp Number Check</p>
          </article>
        </section>
        </section>
        <section class="dashboard-section">
          <div class="section-heading">
            <div><span class="section-kicker">PC SCANDIANO</span><h2>Attivit&agrave; recente</h2></div>
            <p>Ultimi lead e prossimi appuntamenti</p>
          </div>
<section class="tables-grid">
          <article class="panel">
            <h2 class="panel-heading">ULTIMI LEAD</h2>
            <div class="table-wrap"><table><thead><tr><th>NOME</th><th>EMAIL</th><th>TELEFONO</th><th>MESSAGGI</th><th>DATA</th></tr></thead>
              <tbody><tr v-for="lead in leads" :key="lead.name"><td>{{ lead.name }}</td><td class="mail">✉</td><td :class="{ muted: lead.noPhone }">{{ lead.noPhone ? '-' : '☎' }}</td><td><span class="message-count">0</span></td><td>{{ lead.date }}</td></tr></tbody>
            </table></div>
          </article>
          <article class="panel">
            <h2 class="panel-heading">PROSSIMI APPUNTAMENTI</h2>
            <div class="table-wrap"><table><thead><tr><th>LEAD</th><th>AGENTE</th><th>DATA</th><th>STATO</th></tr></thead><tbody></tbody></table></div>
          </article>
        </section>
        </section>
        <section class="dashboard-section">
          <div class="section-heading">
            <div><span class="section-kicker">PC SCANDIANO</span><h2>Telefonate perse</h2></div>
            <p>Riepilogo, andamento e dettaglio</p>
          </div>
<section class="mini-grid">
          <article class="mini-card"><span class="orange">CHIAMATE PERSE TOTALI</span><strong>0</strong></article>
          <article class="mini-card"><span class="red">NON GESTITE</span><strong>0</strong></article>
          <article class="mini-card"><span class="green">OGGI</span><strong>0</strong></article>
          <article class="mini-card"><span class="cyan">QUESTA SETTIMANA</span><strong>0</strong></article>
        </section>
<section class="charts-grid">
          <article class="panel chart-panel"><h2 class="panel-heading">ANDAMENTO CHIAMATE PERSE (ULTIMI 7 GIORNI)</h2>
            <div class="chart"><div class="y-label">1</div><div class="plot"><div class="gridline top"></div><div class="gridline bottom"></div><div class="zero-line"></div><div class="y-zero">0</div>
              <div v-for="(day, i) in days" :key="day" class="chart-tick" :style="{ left: (i * 100 / (days.length - 1)) + '%' }"><span class="point"></span><span class="x-label">{{ day }}</span></div>
            </div></div>
          </article>
          <article class="panel source-panel"><h2 class="panel-heading">CHIAMATE PER FONTE</h2><div class="empty-chart"></div></article>
        </section>
<section class="panel missed-panel">
          <h2 class="panel-heading">ULTIME CHIAMATE PERSE <small>ULTIME 10 CHIAMATE</small></h2>
          <div class="table-wrap"><table><thead><tr><th>NOME</th><th>TELEFONO</th><th>EMAIL</th><th>DATA/ORA</th><th>FONTE</th><th>AGENTE</th><th>GESTIONE LEAD</th><th>STATO CHIAMATA</th></tr></thead>
            <tbody><tr><td colspan="8" class="empty-row">Nessuna chiamata persa</td></tr></tbody></table></div>
        </section>
        </section>
      </div>
</template>
