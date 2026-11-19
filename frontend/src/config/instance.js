export const instanceConfig = Object.freeze({
  tenantSlug: import.meta.env.VITE_TENANT_SLUG || 'local',
  agencyName: import.meta.env.VITE_AGENCY_NAME || 'CRM Immobiliare',
  agencyLocation: import.meta.env.VITE_AGENCY_LOCATION || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  leadsTable: import.meta.env.VITE_SUPABASE_LEADS_TABLE || 'leads',
})
