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
  /* Use global solid background color */
  background-color: var(--bg);
  color: var(--text);
}

.checkout-header {
  margin-bottom: 3rem;
  text-align: left;
}

.checkout-header h1 {
  font-family: var(--font-primary);
  font-size: 3rem;
  margin: 1rem 0 0.5rem;
  color: var(--text);
}

.checkout-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
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
  transition: transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back:hover {
  transform: translateX(-5px);
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.item-info {
  flex-grow: 1;
}

.item-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-family: var(--font-primary);
  color: var(--text);
}

.unit-price {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--glass-border);
  padding: 0.4rem;
  border-radius: 10px;
}

.btn-qty {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text);
  transition: all 0.2s;
}

.btn-qty:hover {
  background: rgba(255, 255, 255, 0.7);
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
  transition: transform 0.2s;
}

.btn-remove:hover {
  transform: scale(1.1);
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
  font-family: var(--font-primary);
  color: var(--text);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-weight: 500;
}

.summary-line.total {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-primary);
}

.btn-whatsapp {
  margin-top: 2rem;
  padding: 1rem !important;
  font-size: 1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.whatsapp-note {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-state p {
  margin-bottom: 2rem;
  color: var(--text-muted);
  font-size: 1.2rem;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .checkout-view {
    padding: 6rem 1.5rem 3rem;
  }
  
  .checkout-actions {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 600px) {
  .checkout-view {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .checkout-header h1 {
    font-size: 2.2rem;
  }
  
  .cart-item-detailed {
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 2rem;
  }
  
  .item-thumb {
    width: 60px;
    height: 60px;
  }
  
  .item-info {
    width: calc(100% - 80px); /* Fill remaining space next to image */
    padding-right: 2.5rem; /* Space for remove button */
  }
  
  .item-qty {
    order: 3;
    margin-left: auto; /* Push to right */
  }
  
  .item-total {
    width: auto;
    order: 2;
    font-size: 1.25rem;
    margin-right: auto; /* Push to left */
  }
  
  .btn-remove {
    position: absolute;
    top: 0; /* Align with top of item */
    right: 0;
    margin: 0;
  }
}
</style>
