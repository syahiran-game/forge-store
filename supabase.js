// ── SUPABASE CONFIG ────────────────────────────────────────
const SUPABASE_URL = 'https://lwtwefrubpupkkzcmhsa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dHdlZnJ1YnB1cGtremNtaHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMDIxMzAsImV4cCI6MjA5NTc3ODEzMH0.cnL955J1xzo1491FAvHh_g4eUqxzSoQPbVlGiy9Dm60'

// ── TELEGRAM CONFIG ────────────────────────────────────────
const TELEGRAM_BOT_TOKEN = '8808527077:AAGVasdsCtorA9n6Nrh5uNjVRguYMGaRkzk'
const TELEGRAM_CHAT_ID = '8333284745'

// ── INIT CLIENT ────────────────────────────────────────────
let db

function initSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.error('Supabase library belum load!')
    return
  }
  const { createClient } = window.supabase
  db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  })
  console.log('Supabase connected ✅')
}

// Jalankan bila DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase)
} else {
  initSupabase()
}