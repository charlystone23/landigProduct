<template>
  <div class="admin-view">
    <!-- Login Simulation -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-card glass-card animate-fade-in-up">
        <h2>Panel de Administración</h2>
        <p>Por favor, identifícate para continuar.</p>
        <div class="form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            @keyup.enter="login"
            placeholder="Introduce tu contraseña (admin)"
            class="form-control"
          />
        </div>
        <button class="btn-primary w-full" @click="login">Entrar</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <router-link to="/" class="back-link">Volver a la web</router-link>
      </div>
    </div>

    <!-- Editor UI -->
    <div v-else class="admin-layout">
      <aside class="sidebar glass-card">
        <div class="sidebar-header">
          <div class="logo">LUXE<span>ADMIN</span></div>
          <button class="btn-logout" @click="logout">Cerrar Sesión</button>
        </div>
        
        <nav class="sidebar-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>

        <router-link to="/" class="btn-view-web">Ver Landing Page</router-link>
      </aside>

      <main class="editor-content">
        <div class="glass-card editor-card">
          <!-- Hero Editor -->
          <div v-if="activeTab === 'hero'" class="editor-section">
            <h2>Editar Hero</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Título</label>
                <input v-model="store.content.hero.title" class="form-control" />
              </div>
              <div class="form-group">
                <label>Subtítulo</label>
                <textarea v-model="store.content.hero.subtitle" class="form-control"></textarea>
              </div>
              <div class="form-group">
                <label>Texto Botón</label>
                <input v-model="store.content.hero.cta" class="form-control" />
              </div>
              <div class="form-group">
                <label>Imagen Fondo (URL)</label>
                <input v-model="store.content.hero.image" class="form-control" />
              </div>
            </div>
          </div>

          <!-- Sections Editor -->
          <div v-if="activeTab === 'sections'" class="editor-section">
            <h2>Editar Secciones</h2>
            <div v-for="section in store.content.sections" :key="section.id" class="sub-section">
              <h3>Sección: {{ section.title }}</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Título</label>
                  <input v-model="section.title" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Imagen (URL)</label>
                  <input v-model="section.image" class="form-control" />
                </div>
                <div class="form-group full">
                  <label>Texto</label>
                  <textarea v-model="section.text" class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Editor -->
          <div v-if="activeTab === 'products'" class="editor-section">
            <div class="section-header">
              <h2>Editar Productos</h2>
              <button class="btn-primary" @click="store.addProduct()">+ Añadir Producto</button>
            </div>
            
            <div v-for="product in store.content.products" :key="product.id" class="sub-section">
              <div class="sub-section-header">
                <h3>{{ product.name }}</h3>
                <button class="btn-delete" @click="store.removeProduct(product.id)">Eliminar</button>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nombre</label>
                  <input v-model="product.name" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Precio</label>
                  <input type="number" v-model="product.price" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Imagen (URL)</label>
                  <input v-model="product.image" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Resumen (Caja)</label>
                  <textarea v-model="product.description" class="form-control"></textarea>
                </div>
                <div class="form-group full">
                  <label>Descripción Detallada (Modal)</label>
                  <textarea v-model="product.longDescription" class="form-control" placeholder="Escribe aquí la historia o beneficios detallados del producto..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLandingStore } from '../stores/landing'

const store = useLandingStore()
const isAuthenticated = ref(false)
const password = ref('')
const error = ref('')
const activeTab = ref('hero')

const tabs = [
  { id: 'hero', name: 'Cabecera' },
  { id: 'sections', name: 'Secciones' },
  { id: 'products', name: 'Productos' }
]

const login = () => {
  if (password.value === 'admin') {
    isAuthenticated.value = true
    localStorage.setItem('is_auth', 'true')
    error.value = ''
  } else {
    error.value = 'Contraseña incorrecta'
  }
}

const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('is_auth')
  password.value = ''
}

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('is_auth') === 'true'
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  display: flex;
  background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
}

/* Login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-card {
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.login-card h2 { margin-bottom: 1rem; }
.login-card p { color: var(--text-muted); margin-bottom: 2rem; }

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 12px;
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.1);
}

.error-msg {
  color: #ef4444;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.back-link {
  display: block;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.w-full { width: 100%; }

/* Admin Layout */
.admin-layout {
  display: flex;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-logout {
  background: transparent;
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.sidebar-nav button {
  text-align: left;
  padding: 12px 1rem;
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  font-weight: 500;
}

.sidebar-nav button.active {
  background: var(--primary);
  color: white;
}

.btn-view-web {
  margin-top: auto;
  padding: 12px;
  text-align: center;
  background: var(--glass-border);
  border-radius: 10px;
  font-weight: 600;
}

/* Editor */
.editor-content {
  flex-grow: 1;
  overflow-y: auto;
}

.editor-card {
  padding: 2.5rem;
}

.editor-section h2 {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sub-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group.full {
  grid-column: span 2;
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.sub-section {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--glass-border);
}

.sub-section h3 {
  margin-bottom: 1.5rem;
  color: var(--primary);
}
</style>
