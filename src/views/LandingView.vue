<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="container nav-content">
        <div class="logo">
          <img src="/logo.png" alt="Sabor a Monte" class="logo-img" />
        </div>
        <div class="nav-actions-mobile">
          <button class="cart-trigger mobile-cart-trigger" @click.stop="isCartOpen = !isCartOpen">
             <span class="icon">🛒</span>
             <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </button>
          <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>

        <div class="nav-links desktop-nav">
          <a href="#" @click.prevent="scrollTo('features')">TIPO DE EXTRACTOS</a>
          <a href="#" @click.prevent="scrollTo('products')">PRODUCTOS</a>
          <div class="cart-container" @mouseenter="isCartOpen = true">
            <button class="cart-trigger" @click.stop="isCartOpen = !isCartOpen">
              <span class="icon">🛒</span>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </button>
            <transition name="fade">
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
            </transition>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <transition name="mobile-menu-fade">
        <div v-if="isMenuOpen" class="mobile-menu">
            <div class="mobile-menu-content">
                <a href="#" @click.prevent="scrollTo('features'); closeMenu()" class="mobile-link">TIPO DE EXTRACTOS</a>
                <a href="#" @click.prevent="scrollTo('products'); closeMenu()" class="mobile-link">PRODUCTOS</a>
                <a href="#" @click.prevent="router.push('/admin'); closeMenu()" class="mobile-link admin-link">ADMIN</a>
            </div>
        </div>
      </transition>

      <!-- Mobile Cart Dropdown (Separate from desktop to avoid nesting issues) -->
       <transition name="fade">
        <div v-if="isCartOpen && isMenuOpen === false" class="cart-dropdown mobile-cart glass-card animate-fade-in" v-click-outside="() => isCartOpen = false">
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
       </transition>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-bg" :style="{ backgroundImage: `url(${store.content.hero.image})` }"></div>
      <div class="container hero-content">
        <h1 class="animate-fade-in-up">{{ store.content.hero.title }}</h1>
        <p class="animate-fade-in-up" style="animation-delay: 0.2s">{{ store.content.hero.subtitle }}</p>
        <div class="hero-btns animate-fade-in-up" style="animation-delay: 0.4s">
          <button class="btn-secondary" @click="scrollTo('products')">{{ store.content.hero.cta }}</button>
        </div>
      </div>
    </header>

    <!-- Top Products Gallery (Duplicated) -->
    <section id="products-top" class="products-section gallery-top">
      <div class="container text-center">
        <div class="section-title-group">
          <h2 class="section-title">{{ store.content.topProductsTitle }}</h2>
          <button class="btn-layout-toggle" @click="toggleGrid" :title="'Cambiar vista: ' + gridCols + ' columnas'">
            <span v-if="gridCols === 3" class="icon">▦</span>
            <span v-else-if="gridCols === 2" class="icon">▤</span>
            <span v-else class="icon">▢</span>
          </button>
        </div>
        <div class="products-grid" :class="'cols-' + gridCols">
          <div v-for="product in activeTopProducts" :key="'top-' + product.id" class="product-card glass-card" v-motion-fade-visible>
            <div class="product-img">
              <img :src="product.image" :alt="product.name" crossorigin="anonymous" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-footer">
                <div class="product-actions full-width">
                  <button class="btn-details" @click="openCategoryModal(product)">Detalles</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Sections -->
    <div id="features"></div>
    <section v-for="(section, index) in store.content.sections" :key="section.id" :id="section.id" class="dynamic-section" :class="{ 'reverse': index % 2 !== 0, 'is-centered': section.centered }">
      <div class="container">
        <div v-if="section.centered" class="section-header-centered" v-motion-slide-visible-bottom>
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </div>
        <div v-else class="section-content">
          <div class="section-text" v-motion-slide-visible-bottom>
            <h2>{{ section.title }}</h2>
            <p>{{ section.text }}</p>
          </div>
          <div class="section-image" v-motion-roll-visible-right>
            <img :src="section.image" :alt="section.title" crossorigin="anonymous" />
          </div>
        </div>

        <!-- Category Cards (if present) -->
        <div v-if="section.categories && section.categories.length" class="categories-grid">
          <div 
            v-for="(cat, cIndex) in section.categories" 
            :key="cIndex" 
            class="category-card glass-card"
            @click="openCategoryModal(cat)"
          >
            <div class="category-img-container">
              <img :src="cat.image" :alt="cat.name" class="category-img" @error="$event.target.src='/images/hero.png'" />
            </div>
            <h3>{{ cat.name }}</h3>
            <p class="category-short-desc">{{ cat.description }}</p>
          </div>
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
                <span class="modal-badge">{{ isCategoryView ? 'Categoría' : 'Producto Ancestral' }}</span>
                <h2>{{ selectedProduct.name }}</h2>
                <p class="modal-desc">{{ selectedProduct.longDescription }}</p>
                
                <div v-if="!isCategoryView && isBuying" class="buy-section animate-fade-in">
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
                  <div class="modal-footer" v-if="!isCategoryView">
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
        <p>&copy; 2026 Sabor a Monte. Todos los derechos reservados.</p>
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
const isCategoryView = ref(false)

const isMenuOpen = ref(false)
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    if (isMenuOpen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

const closeMenu = () => {
    isMenuOpen.value = false
    document.body.style.overflow = ''
}

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

const activeTopProducts = computed(() => {
  return store.content.topProducts.filter(p => p.active)
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
  isCategoryView.value = false
  orderQuantity.value = 1
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const openCategoryModal = (category) => {
  selectedProduct.value = {
    ...category,
    longDescription: category.longDescription || category.description // Fallback
  }
  isBuying.value = false
  isCategoryView.value = true
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProduct.value = {}
    isBuying.value = false
    isCategoryView.value = false
  }, 300)
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

@media (max-width: 1024px) {
  html {
    scroll-snap-type: none;
    scroll-behavior: auto;
  }
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
  color: var(--bg); /* Usa el mismo color crema del título de marca */
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.navbar.scrolled {
  padding: 1.1rem 0; /* Un poco más de aire, no tan comprimido */
  background: rgba(237, 229, 207, 0.98);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--glass-border);
  color: var(--text);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.navbar.scrolled .logo-img {
  height: 85px; /* Logo un poco más grande para que no se pierda */
  filter: sepia(1) saturate(3) hue-rotate(60deg) brightness(0.4) drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

@media (min-width: 1200px) {
  .navbar .container {
    max-width: 1400px; /* Límitamos el ancho para que no quede 'despegado' del contenido */
    padding: 0 2rem;
  }
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

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  /* Filtro preciso para el color crema/hueso del título 'Sabor a Monte' */
  filter: brightness(0) invert(0.9) sepia(0.3) saturate(0.4) hue-rotate(5deg) brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  transition: all 0.3s ease;
}

@media (min-width: 1200px) {
  .logo-img {
    height: 120px;
  }
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  font-family: var(--font-primary);
  font-weight: 600; /* Increased weight */
  font-size: 1.2rem; /* Increased size */
  opacity: 0.9;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-links.desktop-nav a:hover {
  opacity: 1;
}


.nav-actions-mobile {
    display: none;
    align-items: center;
    gap: 0.8rem;
    margin-left: auto; /* Push to the right */
}

.hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: transparent;
    cursor: pointer;
    padding: 0;
    z-index: 2000;
    border: none;
}

.hamburger .bar {
    width: 100%;
    height: 2px;
    background-color: #ede5cf; /* Explicit light color */
    border-radius: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.navbar.scrolled .hamburger .bar,
.mobile-menu-active .hamburger .bar {
    background-color: var(--text); /* Dark on scroll or when menu open */
}

/* Explicitly styling the active state for visibility */
.hamburger.is-active .bar:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
    background-color: var(--text);
}

.hamburger.is-active .bar:nth-child(2) {
    opacity: 0;
}

.hamburger.is-active .bar:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
    background-color: var(--text);
}

.mobile-cart-trigger {
    color: #ede5cf;
    border: 1px solid rgba(237, 229, 207, 0.3);
}

.navbar.scrolled .mobile-cart-trigger {
    color: var(--text);
    border-color: var(--glass-border);
}

.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(237, 229, 207, 0.98);
    backdrop-filter: blur(15px);
    z-index: 1500;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-menu-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    text-align: center;
}

.mobile-link {
    font-family: var(--font-primary);
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
    text-transform: uppercase;
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}

.cart-dropdown.mobile-cart {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 350px;
    right: auto;
}


.admin-link {
  color: inherit !important;
  font-weight: 600 !important;
}

.admin-link:hover {
  text-decoration: underline;
}

.cart-trigger {
  color: inherit; /* Inherit navbar color */
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

@media (max-width: 768px) {
  .hero-bg {
    background-image: url('/hero-texture.jpg') !important;
    background-attachment: scroll; /* Better mobile support */
  }
}


.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  z-index: -1;
}

.hero-content h1 {
  font-size: 5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  max-width: 900px;
  color: var(--bg); /* Light text on dark overlay */
}

.hero-content p {
  font-size: 1.25rem;
  color: #ede5cf; /* Light cream text */
  max-width: 600px;
  margin: 0 auto 2.5rem;
  opacity: 0.9;
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

.section-header-centered {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem auto;
}

.section-header-centered h2 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.section-header-centered p {
  font-size: 1.25rem;
  color: var(--text-muted);
  line-height: 1.6;
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
  max-width: 1000px;
  max-height: 85vh;
  position: relative;
  overflow: hidden;
  padding: 0;
  background: var(--bg);
  border-radius: 30px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(89, 98, 75, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--text);
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.modal-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02); /* Slight contrast for the image area */
}

.modal-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Changed from cover to avoid cropping when centered */
  display: block;
}

.modal-info {
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 85vh;
}

/* Custom Scrollbar for Modal Info */
.modal-info::-webkit-scrollbar {
  width: 8px;
}

.modal-info::-webkit-scrollbar-track {
  background: rgba(89, 98, 75, 0.05);
}

.modal-info::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
  border: 2px solid var(--bg);
}

.modal-info::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

@media (max-width: 900px) {
  .modal-content {
    max-height: 95vh;
    display: block;
    overflow-y: auto;
  }
  .modal-body {
    grid-template-columns: 1fr;
  }
  .modal-image {
    height: 300px;
  }
  .modal-info {
    padding: 2rem;
    max-height: none;
    overflow-y: visible;
  }
}

.modal-badge {
  color: var(--secondary);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.modal-info h2 {
  font-family: var(--font-primary);
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--text);
  line-height: 1.1;
}

.modal-desc {
  color: var(--text);
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
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
  padding: 12px; /* Dlightly larger padding */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  font-size: 1.5rem; /* Increased icon size */
}

.cart-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--secondary);
  color: white;
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
  .nav-links.desktop-nav {
    display: none;
  }
  
  .nav-actions-mobile {
    display: flex;
  }

  .hero-content h1 {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
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
    grid-template-columns: 1fr;
  }
  
  /* Robust styling for modal on small screens */
  .modal-content {
    max-height: 90vh;
    display: block;
    overflow-y: auto;
  }

  .modal-body {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
  }

  .modal-image {
    height: 250px;
    margin-bottom: 0;
  }

  .modal-info {
    padding: 1.5rem;
    max-height: none;
    overflow-y: visible;
  }

  .modal-info h2 {
    font-size: 1.75rem;
  }

  .modal-price {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .modal-info h2 { font-size: 2rem; }
  /* .cart-dropdown rule removed to allow mobile-cart to take precedence */
  .modal-image {
      height: 250px;
      margin-bottom: 1rem;
  }
  .modal-body {
      display: flex;
      flex-direction: column;
  }
  .modal-info {
    padding: 1.5rem;
  }
}
</style>

<style scoped>
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem; /* More space */
  width: 100%;
}

@media (max-width: 900px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}


.category-card {
  padding: 1.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.5); /* Slightly lighter on hover */
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.1);
}

.category-img-container {
  width: 100%;
  height: 250px; /* Match product image height */
  overflow: hidden;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.category-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-card:hover .category-img {
  transform: scale(1.1);
}

.category-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-family: var(--font-primary);
}

.category-short-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>

<style scoped>
/* Always hide mobile cart on desktop (larger than 1024px) */
@media (min-width: 1025px) {
  .cart-dropdown.mobile-cart {
    display: none !important;
  }
}

</style>

