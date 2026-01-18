<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="container nav-content">
        <div class="logo">LUXE<span>TECH</span></div>
        <div class="nav-links">
          <a href="#products">Productos</a>
          <a href="#features">Características</a>
          <router-link to="/admin" class="admin-link">Admin</router-link>
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
        <h2 class="section-title">Nuestros Productos</h2>
        <div class="products-grid">
          <div v-for="product in store.content.products" :key="product.id" class="product-card glass-card" v-motion-fade-visible>
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
                  <button class="btn-buy">Comprar</button>
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
                  <button class="btn-primary" @click="closeModal">Añadir al Carrito</button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useLandingStore } from '../stores/landing'

const store = useLandingStore()
const isScrolled = ref(false)
const isModalOpen = ref(false)
const selectedProduct = ref(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const openModal = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

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
}

.section-title {
  font-size: 3rem;
  margin-bottom: 4rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.product-card {
  padding: 1.5rem;
  text-align: left;
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

@media (max-width: 768px) {
  .modal-body { grid-template-columns: 1fr; }
  .modal-image { height: 300px; }
  .modal-info { padding: 2rem; }
  .modal-info h2 { font-size: 2rem; }
}

.footer {
  padding: 4rem 0;
  border-top: 1px solid var(--glass-border);
  opacity: 0.6;
}

.text-center { text-align: center; }

@media (max-width: 1024px) {
  .hero-content h1 { font-size: 3.5rem; }
  .section-content { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
  .dynamic-section.reverse .section-content { direction: ltr; }
}
</style>
