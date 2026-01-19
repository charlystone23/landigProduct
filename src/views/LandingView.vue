<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="container nav-content">
        <div class="logo">LUXE<span>TECH</span></div>
        <div class="nav-links">
          <a href="#" @click.prevent="scrollTo('products')">Productos</a>
          <a href="#" @click.prevent="scrollTo('features')">Características</a>
          <div class="cart-container" @mouseenter="isCartOpen = true">
            <button class="cart-trigger" @click.stop="isCartOpen = !isCartOpen">
              <span class="icon">🛒</span>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </button>
            <div v-if="isCartOpen" class="cart-dropdown glass-card animate-fade-in" v-click-outside="() => isCartOpen = false">
              <div class="cart-header">
                <h4>Tu Carrito</h4>
                <button class="btn-close-cart" @click.stop="isCartOpen = false">&times;</button>
              </div>
              <div v-if="store.content.cart.length === 0" class="empty-cart">
                El carrito está vacío
              </div>
              <div v-else class="cart-items">
                <div v-for="item in store.content.cart" :key="item.id" class="cart-item">
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span>${{ item.price * item.quantity }}</span>
                </div>
                <div class="cart-total">
                  <strong>Total:</strong>
                  <strong>${{ cartTotal }}</strong>
                </div>
                <button class="btn-primary w-full" @click="checkout">Pagar Ahora</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-bg" :style="{ backgroundImage: `url(${store.content.hero.image})` }"></div>
      <div class="container hero-content">
        <h1 class="animate-fade-in-up">{{ store.content.hero.title }}</h1>
        <p class="animate-fade-in-up" style="animation-delay: 0.2s">{{ store.content.hero.subtitle }}</p>
        <div class="hero-btns animate-fade-in-up" style="animation-delay: 0.4s">
          <button class="btn-primary" @click="scrollTo('products')">{{ store.content.hero.cta }}</button>
        </div>
      </div>
    </header>

    <!-- Sections -->
    <div id="features"></div>
    <section v-for="(section, index) in store.content.sections" :key="section.id" :id="section.id" class="dynamic-section" :class="{ 'reverse': index % 2 !== 0 }">
      <div class="container section-content">
        <div class="section-text" v-motion-slide-visible-bottom>
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </div>
        <div class="section-image" v-motion-roll-visible-right>
          <img :src="section.image" :alt="section.title" crossorigin="anonymous" />
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section id="products" class="products-section">
      <div class="container text-center">
        <div class="section-title-group">
          <h2 class="section-title">Nuestros Productos</h2>
          <button class="btn-layout-toggle" @click="toggleGrid" :title="'Cambiar vista: ' + gridCols + ' columnas'">
            <span v-if="gridCols === 3" class="icon">▦</span>
            <span v-else-if="gridCols === 2" class="icon">▤</span>
            <span v-else class="icon">▢</span>
          </button>
        </div>
        <div class="products-grid" :class="'cols-' + gridCols">
          <div v-for="product in activeProducts" :key="product.id" class="product-card glass-card" v-motion-fade-visible>
            <div class="product-img">
              <img :src="product.image" :alt="product.name" crossorigin="anonymous" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-footer">
                <span class="price">${{ product.price }}</span>
                <div class="product-actions">
                  <button class="btn-details" @click="openModal(product)">Detalles</button>
                  <button class="btn-buy" @click="openModal(product, true)">Comprar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content glass-card animate-modal" @keydown.esc="closeModal">
            <button class="modal-close" @click="closeModal">&times;</button>
            <div class="modal-body">
              <div class="modal-image">
                <img :src="selectedProduct.image" :alt="selectedProduct.name" crossorigin="anonymous" />
              </div>
              <div class="modal-info">
                <span class="modal-badge">Producto Ancestral</span>
                <h2>{{ selectedProduct.name }}</h2>
                <p class="modal-desc">{{ selectedProduct.longDescription }}</p>
                
                <div v-if="isBuying" class="buy-section animate-fade-in">
                  <div class="quantity-selector">
                    <label>Cantidad:</label>
                    <div class="quantity-controls">
                      <button class="btn-qty" @click="updateQty(-1)">-</button>
                      <input type="number" v-model="orderQuantity" min="1" class="qty-input">
                      <button class="btn-qty" @click="updateQty(1)">+</button>
                    </div>
                  </div>
                  <div class="modal-footer buy">
                    <div class="price-calc">
                      <span class="subtext">Total:</span>
                      <span class="modal-price">${{ selectedProduct.price * orderQuantity }}</span>
                    </div>
                    <button class="btn-primary" @click="confirmPurchase">Confirmar</button>
                  </div>
                </div>

                <div v-else>
                  <div class="modal-benefits">
                    <div class="benefit-item">
                      <span class="icon">🌿</span>
                      <span>100% Orgánico</span>
                    </div>
                    <div class="benefit-item">
                      <span class="icon">✨</span>
                      <span>Sabiduría Ancestral</span>
                    </div>
                    <div class="benefit-item">
                      <span class="icon">🔬</span>
                      <span>Calidad Lab</span>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <span class="modal-price">${{ selectedProduct.price }}</span>
                    <button class="btn-primary" @click="isBuying = true">Comprar Ahora</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer -->
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2026 LUXETECH. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLandingStore } from '../stores/landing'

const store = useLandingStore()
const router = useRouter()
const isScrolled = ref(false)
const isModalOpen = ref(false)
const isCartOpen = ref(false)
const isBuying = ref(false)
const selectedProduct = ref(null)
const orderQuantity = ref(1)
const gridCols = ref(3)

const toggleGrid = () => {
  if (gridCols.value === 3) gridCols.value = 2
  else if (gridCols.value === 2) gridCols.value = 1
  else gridCols.value = 3
}

// Directive to detect clicks outside an element
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const activeProducts = computed(() => {
  return store.content.products.filter(p => p.active)
})

const cartCount = computed(() => {
  return store.content.cart.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return store.content.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const openModal = (product, buying = false) => {
  selectedProduct.value = product
  isBuying.value = buying
  orderQuantity.value = 1
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  isBuying.value = false
  document.body.style.overflow = ''
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const updateQty = (delta) => {
  const newQty = orderQuantity.value + delta
  if (newQty >= 1) orderQuantity.value = newQty
}

const confirmPurchase = () => {
  store.addToCart(selectedProduct.value, orderQuantity.value)
  closeModal()
}

const checkout = () => {
  isCartOpen.value = false
  router.push('/checkout')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Global scroll snap settings */
html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
</style>

<style scoped>
.landing-page {
  position: relative;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  padding: 1rem 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
}

.logo span {
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 1;
}

.admin-link {
  color: var(--primary) !important;
  font-weight: 600 !important;
}

.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  text-align: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -2;
  transition: transform 0.5s ease;
}

.hero:hover .hero-bg {
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9));
  z-index: -1;
}

.hero-content h1 {
  font-size: 5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  max-width: 900px;
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.dynamic-section {
  padding: 10rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.dynamic-section.reverse .section-content {
  direction: rtl;
}

.dynamic-section.reverse .section-text {
  direction: ltr;
}

.section-text h2 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.section-text p {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.section-image img {
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.products-section {
  padding: 8rem 0;
  background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.05));
  min-height: 100vh;
  display: flex;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 0;
}

.section-title-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.btn-layout-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 10px 15px;
  border-radius: 12px;
  color: var(--primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-layout-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.products-grid {
  display: grid;
  gap: 2.5rem;
  transition: all 0.5s ease;
}

.products-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 1200px;
  margin: 0 auto;
}

.products-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 800px;
  margin: 0 auto;
}

.products-grid.cols-1 {
  grid-template-columns: 1fr;
  max-width: 450px;
  margin: 0 auto;
}

.products-grid.cols-1 .product-card {
  padding: 2.5rem;
}

.products-grid.cols-1 .product-img {
  height: 350px;
}

.product-card {
  padding: 1.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.product-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.1);
}

.product-img {
  height: 250px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 15px;
  flex-shrink: 0;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.1);
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.product-info p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.btn-buy {
  background: var(--glass-border);
  padding: 8px 20px;
  border-radius: 8px;
  color: var(--text);
  font-weight: 600;
}

.product-card:hover .btn-buy {
  background: var(--primary);
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-details {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 8px 15px;
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-details:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 900px;
  position: relative;
  overflow: hidden;
  padding: 0;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  z-index: 10;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image {
  height: 500px;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.modal-badge {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.modal-info h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.modal-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.benefit-item .icon {
  font-size: 1.25rem;
}

.modal-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .animate-modal {
  animation: modalScaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScaleUp {
  from {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Cart Styles */
.cart-container {
  position: relative;
}

.cart-trigger {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.cart-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary);
  color: black;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 1rem;
  width: 300px;
  padding: 1.5rem;
  z-index: 1001;
}

.cart-dropdown h4 {
  margin: 0;
  font-size: 1.1rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--glass-border);
}

.btn-close-cart {
  background: transparent;
  color: var(--text-muted);
  font-size: 1.5rem;
  line-height: 1;
  padding: 0 5px;
  transition: color 0.3s ease;
}

/* Responsive Media Queries */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* In a real app, you'd add a hamburger menu here */
  }

  .hero-content h1 {
    font-size: 3rem;
  }

  .hero-content p {
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  .section-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .dynamic-section {
    padding: 6rem 0;
  }

  .dynamic-section.reverse .section-content {
    direction: ltr;
  }

  .section-text h2 {
    font-size: 2.2rem;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .products-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-image {
    height: 300px;
  }

  .modal-info {
    padding: 2rem;
  }

  .modal-info h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .section-title-group {
    flex-direction: column;
    gap: 1rem;
  }

  .products-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-info {
    padding: 1.5rem;
  }

  .modal-info h2 {
    font-size: 1.75rem;
  }

  .modal-price {
    font-size: 1.5rem;
  }
}

.btn-close-cart:hover {
  color: var(--primary);
}

.empty-cart {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.footer {
  padding: 4rem 0;
  border-top: 1px solid var(--glass-border);
  opacity: 0.6;
  scroll-snap-align: end;
}

.cart-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

/* Modal Buy Section */
.buy-section {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.quantity-selector {
  margin-bottom: 2rem;
}

.quantity-selector label {
  display: block;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.quantity-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-qty {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--glass-border);
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-qty:hover {
  background: rgba(255, 255, 255, 0.15);
}

.qty-input {
  width: 60px;
  background: transparent;
  border: 1px solid var(--glass-border);
  text-align: center;
  border-radius: 10px;
  padding: 8px;
  font-weight: 700;
  color: white;
}

.modal-footer.buy {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-calc {
  display: flex;
  flex-direction: column;
}

.price-calc .subtext {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
}

.w-full { width: 100%; }

.animate-fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .modal-body { grid-template-columns: 1fr; }
  .modal-image { height: 300px; }
  .modal-info { padding: 2rem; }
  .modal-info h2 { font-size: 2rem; }
  .cart-dropdown { right: -60px; width: 280px; }
}
</style>
