// ── ADMIN EMAIL (tukar kepada email admin anda) ────────────
const ADMIN_EMAIL = 'sazuanmukris78@gmail.com'

let allOrders = []

// ── CHECK AUTH ─────────────────────────────────────────────
async function checkAdminAuth() {
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    window.location.href = 'login.html'
    return
  }

  if (user.email !== ADMIN_EMAIL) {
    alert('Akses ditolak. Bukan admin.')
    await db.auth.signOut()
    window.location.href = 'login.html'
    return
  }

  document.getElementById('adminEmail').textContent = user.email
  loadOrders()
  subscribeOrders()
}

// ── LOAD ORDERS ────────────────────────────────────────────
async function loadOrders() {
  const { data, error } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return }

  allOrders = data
  renderStats(data)
  renderOrders(data)
}

// ── REALTIME SUBSCRIBE ─────────────────────────────────────
function subscribeOrders() {
  db.channel('orders-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
      allOrders.unshift(payload.new)
      renderStats(allOrders)
      renderOrders(allOrders)
      playNotifSound()
    })
    .subscribe()
}

function playNotifSound() {
  const ctx = new AudioContext()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g); g.connect(ctx.destination)
  o.frequency.value = 880
  g.gain.setValueAtTime(0.3, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  o.start(); o.stop(ctx.currentTime + 0.4)
}

// ── RENDER STATS ───────────────────────────────────────────
function renderStats(orders) {
  const total = orders.length
  const pending = orders.filter(o => o.status === 'pending').length
  const done = orders.filter(o => o.status === 'selesai').length
  const revenue = orders
    .filter(o => o.status === 'selesai')
    .reduce((s, o) => s + (o.total || 0), 0)

  document.getElementById('statTotal').textContent = total
  document.getElementById('statPending').textContent = pending
  document.getElementById('statDone').textContent = done
  document.getElementById('statRevenue').textContent = `RM${revenue.toFixed(2)}`
}

// ── RENDER ORDERS TABLE ────────────────────────────────────
function renderOrders(orders) {
  const tbody = document.getElementById('ordersTableBody')

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:2rem;">Tiada order lagi</td></tr>'
    return
  }

  tbody.innerHTML = orders.map(o => {
    const items = Array.isArray(o.items) ? o.items.map(i => `${i.name} x${i.qty||1}`).join(', ') : '-'
    const date = new Date(o.created_at).toLocaleString('ms-MY')
    const statusClass = { pending:'status-pending', processing:'status-processing', selesai:'status-done', batal:'status-batal' }[o.status] || ''

    return `
      <tr>
        <td style="font-size:0.75rem;color:var(--muted);">#${o.id.toString().slice(-6)}</td>
        <td>${o.name}</td>
        <td style="font-size:0.82rem;">${o.contact}</td>
        <td style="font-size:0.8rem;max-width:200px;">${items}</td>
        <td style="color:var(--accent);font-family:'Rajdhani',sans-serif;">RM${(o.total||0).toFixed(2)}</td>
        <td style="font-size:0.78rem;color:var(--muted);">${date}</td>
        <td><span class="status-badge ${statusClass}">${o.status}</span></td>
        <td>
          <select class="status-select" onchange="updateStatus('${o.id}', this.value)">
            <option ${o.status==='pending'?'selected':''}>pending</option>
            <option ${o.status==='processing'?'selected':''}>processing</option>
            <option ${o.status==='selesai'?'selected':''}>selesai</option>
            <option ${o.status==='batal'?'selected':''}>batal</option>
          </select>
        </td>
      </tr>
    `
  }).join('')
}

// ── FILTER ORDERS ──────────────────────────────────────────
function filterOrders(status, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  const filtered = status === 'all' ? allOrders : allOrders.filter(o => o.status === status)
  renderOrders(filtered)
}

// ── UPDATE STATUS ──────────────────────────────────────────
async function updateStatus(id, status) {
  const { error } = await db.from('orders').update({ status }).eq('id', id)
  if (error) { alert('Gagal update status'); return }

  const idx = allOrders.findIndex(o => o.id === id)
  if (idx !== -1) allOrders[idx].status = status
  renderStats(allOrders)
}

// ── LOGOUT ─────────────────────────────────────────────────
async function logoutAdmin() {
  await db.auth.signOut()
  window.location.href = 'login.html'
}

// ── INIT ───────────────────────────────────────────────────
checkAdminAuth()