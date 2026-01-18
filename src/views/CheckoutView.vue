<template>
  <div class="checkout-view glass-container">
    <div class="container checkout-content animate-fade-in-up">
      <header class="checkout-header">
        <button @click="goBackToProducts" class="btn-back">← Volver a la tienda</button>
        <h1>Resumen de tu Pedido</h1>
        <p>Revisa los detalles de tu medicina ancestral antes de finalizar.</p>
      </header>

      <div class="checkout-grid">
        <main class="order-summary glass-card">
          <div v-if="store.content.cart.length === 0" class="empty-state">
            <p>Tu carrito está vacío.</p>
            <router-link to="/" class="btn-primary">Explorar Productos</router-link>
          </div>
          <div v-else class="cart-list">
            <div v-for="item in store.content.cart" :key="item.id" class="cart-item-detailed">
              <img :src="item.image" :alt="item.name" class="item-thumb">
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p class="unit-price">${{ item.price }} c/u</p>
              </div>
              <div class="item-qty">
                <button class="btn-qty" @click="store.updateCartQuantity(item.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button class="btn-qty" @click="store.updateCartQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              <div class="item-total">
                ${{ item.price * item.quantity }}
              </div>
              <button class="btn-remove" @click="store.removeFromCart(item.id)">&times;</button>
            </div>
          </div>
        </main>

        <aside class="checkout-actions glass-card">
          <h2>Monto Total</h2>
          <div class="summary-line">
            <span>Subtotal</span>
            <span>${{ cartTotal }}</span>
          </div>
          <div class="summary-line total">
            <span>Total a pagar</span>
            <span>${{ cartTotal }}</span>
          </div>
          
          <button 
            class="btn-primary btn-whatsapp w-full" 
            :disabled="store.content.cart.length === 0"
            @click="sendWhatsApp"
          >
            Continuar al Pago (WhatsApp)
          </button>
          
          <p class="whatsapp-note">
            Al hacer clic, serás redirigido a WhatsApp para coordinar el pago y la entrega directamente con nosotros.
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLandingStore } from '../stores/landing'

const store = useLandingStore()
const router = useRouter()

const cartTotal = computed(() => {
  return store.content.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const goBackToProducts = async () => {
  await router.push('/')
  setTimeout(() => {
    const el = document.getElementById('products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const sendWhatsApp = () => {
  const phone = "5491123456789" // Reemplazar por el número real del usuario
  
  let message = "*Resumen de Pedido - LUXETECH*\n\n"
  
  store.content.cart.forEach(item => {
    message += `• *${item.name}*\n`
    message += `  Cantidad: ${item.quantity}\n`
    message += `  Precio: $${item.price} c/u\n`
    message += `  Subtotal: $${item.price * item.quantity}\n\n`
  })
  
  message += `*Total a pagar: $${cartTotal.value}*`
  
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: radial-gradient(circle at top right, #1e1b4b, #0c0f0a);
}

.checkout-header {
  margin-bottom: 3rem;
  text-align: left;
}

.checkout-header h1 {
  font-size: 3rem;
  margin: 1rem 0 0.5rem;
}

.btn-back {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.order-summary {
  padding: 2rem;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item-detailed {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.cart-item-detailed:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.item-info {
  flex-grow: 1;
}

.item-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
}

.unit-price {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 10px;
}

.btn-qty {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.item-total {
  width: 100px;
  text-align: right;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary);
}

.btn-remove {
  background: transparent;
  color: #ef4444;
  font-size: 1.5rem;
  margin-left: 1rem;
}

.checkout-actions {
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.checkout-actions h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.summary-line.total {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 700;
}

.summary-line .free {
  color: var(--primary);
  font-weight: 700;
}

.btn-whatsapp {
  margin-top: 2rem;
  padding: 1.25rem !important;
  font-size: 1.1rem !important;
}

.whatsapp-note {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-state p {
  margin-bottom: 2rem;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .cart-item-detailed {
    flex-wrap: wrap;
    gap: 1rem;
  }
  .item-total {
    width: 100%;
    text-align: right;
  }
}
</style>
