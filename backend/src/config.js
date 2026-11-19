function required(env, key) {
  const value = env[key]?.trim()
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

function isLegacyServiceRoleKey(key) {
  try {
    const payload = key.split('.')[1]
    return Boolean(payload) && JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).role === 'service_role'
  } catch {
    return false
  }
}

export function loadConfig(env = process.env) {
  const secretKey = required(env, 'SUPABASE_SECRET_KEY')
  if (!secretKey.startsWith('sb_secret_') && !isLegacyServiceRoleKey(secretKey)) {
    throw new Error('SUPABASE_SECRET_KEY must be an sb_secret_... key or the legacy service_role key for this project.')
  }

  const telegramBotToken = env.TELEGRAM_BOT_TOKEN?.trim() || ''
  const telegramChatId = env.TELEGRAM_ADMIN_CHAT_ID?.trim() || ''
  if (Boolean(telegramBotToken) !== Boolean(telegramChatId)) {
    throw new Error('Set both TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID, or leave both empty.')
  }

  return Object.freeze({
    tenant: Object.freeze({
      slug: env.TENANT_SLUG?.trim() || 'local',
      agencyName: env.AGENCY_NAME?.trim() || 'CRM Immobiliare',
      agencyLocation: env.AGENCY_LOCATION?.trim() || '',
    }),
    pollIntervalMs: Math.max(1_000, Number(env.POLL_INTERVAL_MS) || 10_000),
    leadTestSubjectPrefix: env.LEAD_TEST_SUBJECT_PREFIX?.trim() || '[LEAD TEST]',
    leadSourceDomains: (env.LEAD_SOURCE_DOMAINS || 'immobiliare.it')
      .split(',')
      .map((domain) => domain.trim().toLowerCase())
      .filter(Boolean),
    supabase: Object.freeze({
      url: required(env, 'SUPABASE_URL').replace(/\/$/, ''),
      secretKey,
      leadsTable: env.SUPABASE_LEADS_TABLE?.trim() || 'leads',
    }),
    telegram: telegramBotToken
      ? Object.freeze({ botToken: telegramBotToken, chatId: telegramChatId })
      : null,
  })
}
