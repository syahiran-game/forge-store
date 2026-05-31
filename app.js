// ── PRODUCT DATA ──────────────────────────────────────────
const products = [
  {
    id: 1, cat: "vps", icon: "🖥️",
    badge: "POPULAR", badgeType: "",
    name: "VPS STATIC",
    specs: ["2 vCPU", "4GB RAM", "50GB SSD NVMe", "Unlimited Bandwidth", "Full Root Access"],
    price: 13, unit: "/bulan"
  },
  {
    id: 2, cat: "vps", icon: "🖥️",
    badge: null,
    name: "VPS MEDIUM",
    specs: ["4 vCPU", "8GB RAM", "100GB SSD NVMe", "Unlimited Bandwidth", "DDoS Protection"],
    price: 17, unit: "/bulan"
  },
  {
    id: 3, cat: "hosting", icon: "🌐",
    badge: null,
    name: "SA-MP Hosting Pro",
    specs: ["50 Slot Players", "4GB RAM", "1 Database (PHPMYADMIN)", "Anti-Crash System", "Panel Pterodactyl"],
    price: 7, unit: "/bulan"
  },
  {
    id: 4, cat: "hosting", icon: "🌐",
    badge: "NEW", badgeType: "",
    name: "FiveM Hosting",
    specs: ["128 Slot Players", "6GB RAM", "MySQL Included", "Custom Resources", "Panel Pterodactyl"],
    price: 45, unit: "/bulan"
  },
  {
    id: 5, cat: "bot", icon: "🤖",
    badge: "HOT", badgeType: "hot",
    name: "Bot Discord.js Basic",
    specs: ["Node.js 20 LTS", "256MB RAM", "24/7 Online", "1 Bot Token", "Restart Otomatis"],
    price: 8, unit: "/bulan"
  },
  {
    id: 6, cat: "bot", icon: "🤖",
    badge: null,
    name: "Bot Discord.js Pro",
    specs: ["Node.js 20 LTS", "1GB RAM", "24/7 Online", "3 Bot Token", "MongoDB Included"],
    price: 20, unit: "/bulan"
  },
  {
    id: 7, cat: "bot", icon: "🤖",
    badge: "NEW", badgeType: "",
    name: "Python Bot Hosting",
    specs: ["Python 3.11", "512MB RAM", "24/7 Online", "discord.py / nextcord", "Restart Otomatis"],
    price: 10, unit: "/bulan"
  },
  {
    id: 8, cat: "jasa", icon: "🔧",
    badge: null,
    name: "Install Panel Pterodactyl",
    specs: ["Setup Domain + SSL", "Nginx Config", "MySQL Setup", "Wings Node Setup", "Tempoh: 1-3 Jam"],
    price: 50, unit: "/sekali"
  },
  {
    id: 9, cat: "jasa", icon: "🔧",
    badge: "POPULAR", badgeType: "",
    name: "Setup SAMP Server",
    specs: ["Install SA-MP Server", "Config Gamemode", "Install Plugin Asas", "Optimize Performance", "Tempoh: 2-4 Jam"],
    price: 40, unit: "/sekali"
  },
  {
    id: 10, cat: "jasa", icon: "🔧",
    badge: null,
    name: "Develop Bot Discord",
    specs: ["Custom Commands", "Embed Messages", "Role Management", "Prefix / Slash Commands", "Source Code Diberikan"],
    price: 80, unit: "/projek"
  }
]

// ── CART STATE ─────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('nexacart') || '[]')

// ── RENDER PRODUCTS ────────────────────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid')
  if (!grid) return

  const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter)
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-cat="${p.cat}">
      ${p.badge ? `<span class="product-badge ${p.badgeType}">${p.badge}</span>` : ''}
      <div class="product-icon">${p.icon}</div>
      <div class="product-body">
        <div class="product-cat">${catLabel(p.cat)}</div>
        <div class="product-name">${p.name}</div>
        <ul class="product-specs">
          ${p.specs.map(s => `<li>${s}</li>`).join('')}
        </ul>
        <div class="product-footer">
          <div class="product-price">
            RM${p.price}
            <small>${p.unit}</small>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ ADD</button>
        </div>
      </div>
    </div>
  `).join('')
}

function catLabel(cat) {
  return { vps:'VPS Hosting', hosting:'Game Hosting', bot:'Bot Hosting', jasa:'Jasa / Service' }[cat] || cat
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  renderProducts(cat)
}

// ── CART FUNCTIONS ─────────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id)
  if (!product) return

  const existing = cart.find(i => i.id === id)
  if (existing) {
    existing.qty = (existing.qty || 1) + 1
  } else {
    cart.push({ id, name: product.name, price: product.price, unit: product.unit, qty: 1 })
  }

  saveCart()
  updateCartUI()
  showAddFeedback(id)
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id)
  saveCart()
  updateCartUI()
}

function saveCart() {
  localStorage.setItem('nexacart', JSON.stringify(cart))
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount')
  const itemsEl = document.getElementById('cartItems')
  const totalEl = document.getElementById('cartTotal')

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0)

  if (countEl) countEl.textContent = count
  if (totalEl) totalEl.textContent = `RM${total.toFixed(2)}`

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Troli kosong. Tambah produk!</p>'
      return
    }
    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${i.name}</div>
          <div style="font-size:0.75rem;color:var(--muted);">x${i.qty || 1} ${i.unit}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="cart-item-price">RM${(i.price * (i.qty||1)).toFixed(2)}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button>
        </div>
      </div>
    `).join('')
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar')
  const overlay = document.getElementById('cartOverlay')
  sidebar.classList.toggle('open')
  overlay.classList.toggle('open')
}

function showAddFeedback(id) {
  const grid = document.getElementById('productGrid')
  if (!grid) return
  const cards = grid.querySelectorAll('.product-card')
  cards.forEach(card => {
    const btn = card.querySelector('.add-btn')
    if (btn && btn.getAttribute('onclick') === `addToCart(${id})`) {
      btn.textContent = '✔ ADDED'
      btn.style.background = 'var(--accent)'
      btn.style.color = 'var(--bg)'
      setTimeout(() => {
        btn.textContent = '+ ADD'
        btn.style.background = ''
        btn.style.color = ''
      }, 1000)
    }
  })
}

// ── CHECKOUT ───────────────────────────────────────────────
function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem('nexacart') || '[]')
  const summaryEl = document.getElementById('orderSummary')
  const totalEl = document.getElementById('orderTotal')
  if (!summaryEl) return

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p style="color:var(--muted);font-size:0.9rem;">Tiada item dalam cart.</p>'
    return
  }

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)
  summaryEl.innerHTML = cart.map(i => `
    <div class="order-item">
      <span>${i.name} x${i.qty||1}</span>
      <span>RM${(i.price*(i.qty||1)).toFixed(2)} ${i.unit}</span>
    </div>
  `).join('')
  if (totalEl) totalEl.textContent = `RM${total.toFixed(2)}`
}

async function submitOrder(e) {
  e.preventDefault()

  const btn = document.getElementById('submitBtn')
  const errEl = document.getElementById('submitError')
  const cart = JSON.parse(localStorage.getItem('nexacart') || '[]')

  // Semak db wujud
  if (typeof db === 'undefined' || !db) {
    if (errEl) errEl.textContent = '❌ Sambungan database gagal. Reload page dan cuba lagi.'
    return
  }

  if (cart.length === 0) {
    if (errEl) errEl.textContent = '⚠ Cart kosong! Tambah produk dulu.'
    return
  }

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Menghantar...' }
  if (errEl) errEl.textContent = ''

  const name = document.getElementById('buyerName').value
  const email = document.getElementById('buyerEmail').value
  const contact = document.getElementById('buyerContact').value
  const note = document.getElementById('buyerNote').value
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  try {
    const { data, error } = await db.from('orders').insert([{
      name, email, contact, note,
      items: cart,
      total,
      status: 'pending'
    }]).select()

    if (error) {
      console.error('Supabase error:', error)
      if (errEl) errEl.textContent = `❌ Error: ${error.message}`
      if (btn) { btn.disabled = false; btn.textContent = '✔ HANTAR ORDER' }
      return
    }

    // Hantar notif Telegram (tak block kalau gagal)
    try {
      await sendTelegramNotif({ name, contact, cart, total, note, id: data[0].id })
    } catch (tErr) {
      console.warn('Telegram notif gagal:', tErr)
    }

    localStorage.removeItem('nexacart')
    document.getElementById('modalOverlay').classList.add('open')

  } catch (err) {
    console.error('Submit error:', err)
    if (errEl) errEl.textContent = '❌ Gagal hantar order. Cuba lagi.'
  }

  if (btn) { btn.disabled = false; btn.textContent = '✔ HANTAR ORDER' }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open')
  window.location.href = 'index.html'
}

// ── TELEGRAM NOTIF ─────────────────────────────────────────
async function sendTelegramNotif({ name, contact, cart, total, note, id }) {
  const items = cart.map(i => `▸ ${i.name} x${i.qty||1} — RM${(i.price*(i.qty||1)).toFixed(2)}`).join('\n')

  const msg = `
🛒 *ORDER BARU MASUK!*
━━━━━━━━━━━━━━━━━
🆔 ID: #${id.toString().slice(-6)}
👤 Nama: ${name}
📞 Contact: ${contact}

📦 *Items:*
${items}

💰 *Jumlah: RM${total.toFixed(2)}*
📝 Note: ${note || 'Tiada'}
━━━━━━━━━━━━━━━━━
  `.trim()

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: msg,
      parse_mode: 'Markdown'
    })
  })
}

// ── AUTH FUNCTIONS ─────────────────────────────────────────
function switchTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none'
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none'
}

async function loginUser() {
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value
  const errEl = document.getElementById('loginError')

  const { error } = await db.auth.signInWithPassword({ email, password })

  if (error) {
    errEl.textContent = 'Email atau password salah.'
    return
  }

  window.location.href = 'index.html'
}

async function registerUser() {
  const name = document.getElementById('regName').value
  const email = document.getElementById('regEmail').value
  const password = document.getElementById('regPassword').value
  const errEl = document.getElementById('registerError')

  if (password.length < 6) {
    errEl.textContent = 'Password kena sekurang-kurangnya 6 karakter.'
    return
  }

  const { error } = await db.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  })

  if (error) {
    errEl.textContent = error.message
    return
  }

  errEl.style.color = 'var(--accent)'
  errEl.textContent = 'Daftar berjaya! Semak email untuk verify akaun.'
}

async function forgotPassword() {
  const email = prompt('Masukkan email anda:')
  if (!email) return
  await db.auth.resetPasswordForEmail(email)
  alert('Email reset password dah dihantar!')
}

// ── ANNOUNCEMENT ───────────────────────────────────────────
function closeAnnouncement() {
  const bar = document.getElementById('announcementBar')
  if (!bar) return
  bar.style.height = '0'
  bar.style.borderBottom = 'none'
  bar.style.transition = 'height 0.3s ease'
  sessionStorage.setItem('announcementClosed', 'true')
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts()
  updateCartUI()

  if (sessionStorage.getItem('announcementClosed')) {
    const bar = document.getElementById('announcementBar')
    if (bar) bar.style.display = 'none'
  }
})