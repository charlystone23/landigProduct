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
        
        <button class="btn-save-all" @click="saveEverything">
          <span>💾</span> Guardar Cambios
        </button>
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
                <label>Imagen Fondo</label>
                <div class="input-with-action">
                  <input v-model="store.content.hero.image" class="form-control" placeholder="URL o sube una imagen" />
                  <label class="btn-browse">
                    <span>📂 Examinar</span>
                    <input type="file" @change="e => handleFileUpload(e, store.content.hero, 'image')" accept="image/*" hidden />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Sections Editor -->
          <div v-if="activeTab === 'sections'" class="editor-section">
            <div class="section-header">
              <h2>Editar Secciones</h2>
              <button class="btn-primary" @click="store.addSection">
                + Nueva Sección
              </button>
            </div>
            
            <div v-for="(section, index) in store.content.sections" :key="section.id" class="sub-section">
              <div class="sub-section-header">
                <h3>Sección {{ index + 1 }}</h3>
                <button class="btn-delete-mini" @click="store.removeSection(section.id)" title="Eliminar sección">
                  🗑️
                </button>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Título</label>
                  <input v-model="section.title" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Imagen</label>
                  <div class="input-with-action">
                    <input v-model="section.image" class="form-control" placeholder="URL o sube una imagen" />
                    <label class="btn-browse">
                      <span>📂 Examinar</span>
                      <input type="file" @change="e => handleFileUpload(e, section, 'image')" accept="image/*" hidden />
                    </label>
                  </div>
                </div>
                <div class="form-group full">
                  <label>Texto</label>
                  <textarea v-model="section.text" class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Elegidos Editor -->
          <div v-if="activeTab === 'top-products'" class="editor-section">
            <div class="section-header">
              <h2>Editar Tipos de extractos</h2>
              <button class="btn-primary" @click="openModal(null, true)">+ Añadir Tipo</button>
            </div>

            <div class="form-group full" style="margin-bottom: 2rem;">
              <label>Título de la Sección en la Web</label>
              <input v-model="store.content.topProductsTitle" class="form-control" placeholder="Ej: Elegidos para ti" />
            </div>
            
            <div class="products-grid-admin">
              <div v-for="product in store.content.topProducts" :key="product.id" class="product-item glass-card" :class="{ inactive: !product.active }">
                <div class="product-info-mini">
                  <img :src="product.image" :alt="product.name" class="product-thumb">
                  <div>
                    <h4>{{ product.name }}</h4>
                    <span class="price-tag">${{ product.price }}</span>
                  </div>
                </div>
                <div class="product-actions">
                  <button class="btn-status" :class="product.active ? 'active' : 'inactive'" @click="product.active = !product.active">
                    {{ product.active ? 'Activo' : 'Inactivo' }}
                  </button>
                  <button class="btn-edit" @click="openModal(product, true)">Editar</button>
                  <button class="btn-delete-mini" @click="store.removeTopProduct(product.id)">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Editor -->
          <div v-if="activeTab === 'products'" class="editor-section">
            <div class="section-header">
              <h2>Editar Productos Generales</h2>
              <button class="btn-primary" @click="openModal(null, false)">+ Añadir Producto</button>
            </div>
            
            <div class="products-grid-admin">
              <div v-for="product in store.content.products" :key="product.id" class="product-item glass-card" :class="{ inactive: !product.active }">
                <div class="product-info-mini">
                  <img :src="product.image" :alt="product.name" class="product-thumb">
                  <div>
                    <h4>{{ product.name }}</h4>
                    <span class="price-tag">${{ product.price }}</span>
                  </div>
                </div>
                <div class="product-actions">
                  <button class="btn-status" :class="product.active ? 'active' : 'inactive'" @click="product.active = !product.active">
                    {{ product.active ? 'Activo' : 'Inactivo' }}
                  </button>
                  <button class="btn-edit" @click="openModal(product, false)">Editar</button>
                  <button class="btn-delete-mini" @click="store.removeProduct(product.id)">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Product Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content glass-card animate-scale-up">
        <div class="modal-header">
          <h3>{{ editingId ? 'Editar Producto' : 'Añadir Nuevo Producto' }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="formProduct.name" class="form-control" placeholder="Ej: Extracto de Chaga" />
            </div>
            <div v-if="!isEditingTop" class="form-group">
              <label>Precio</label>
              <input type="number" v-model="formProduct.price" class="form-control" />
            </div>
            <div class="form-group full">
              <label>Imagen</label>
              <div class="url-input-group">
                <div class="input-with-action">
                  <input v-model="formProduct.image" class="form-control" placeholder="URL o sube una imagen" />
                  <label class="btn-browse">
                    <span>📂 Examinar</span>
                    <input type="file" @change="e => handleFileUpload(e, formProduct, 'image')" accept="image/*" hidden />
                  </label>
                </div>
                <div class="image-preview-admin glass-card">
                  <img :src="formProduct.image" @error="handleImageError" alt="Preview" class="preview-img">
                  <span v-if="imageError" class="preview-error">Imagen no válida</span>
                </div>
              </div>
            </div>
            <div class="form-group full">
              <label>Resumen (Caja)</label>
              <textarea v-model="formProduct.description" class="form-control" placeholder="Breve descripción..."></textarea>
            </div>
            <div class="form-group full">
              <label>Descripción Detallada (Modal)</label>
              <textarea v-model="formProduct.longDescription" class="form-control" placeholder="Escribe aquí la historia o beneficios del producto..."></textarea>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formProduct.active">
                Producto Activo
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="saveProduct">
            {{ editingId ? 'Guardar Cambios' : 'Crear Producto' }}
          </button>
        </div>
      </div>
    </div>


    <!-- Notification Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification glass-card">
        <span class="icon">✅</span>
        <span>Cambios guardados correctamente</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useLandingStore } from '../stores/landing'

const store = useLandingStore()
const isAuthenticated = ref(false)
const password = ref('')
const error = ref('')
const activeTab = ref('hero')
const imageError = ref(false)
const showToast = ref(false)

const handleFileUpload = (event, target, key) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    target[key] = e.target.result // Base64 string
    imageError.value = false
  }
  reader.readAsDataURL(file)
}

const handleImageError = (e) => {
  imageError.value = true
  e.target.src = '/images/hero.png' // Fallback
}

// Modal state
const showModal = ref(false)
const editingId = ref(null)
const formProduct = reactive({
  name: '',
  price: 0,
  image: '/images/hero.png',
  description: '',
  longDescription: '',
  active: true
})

const tabs = [
  { id: 'hero', name: 'Cabecera' },
  { id: 'sections', name: 'Secciones' },
  { id: 'top-products', name: 'Tipos de extractos' },
  { id: 'products', name: 'Productos Generales' }
]

const isEditingTop = ref(false)

const openModal = (product = null, isTop = false) => {
  imageError.value = false
  isEditingTop.value = isTop
  if (product) {
    editingId.value = product.id
    formProduct.name = product.name
    formProduct.price = product.price
    formProduct.image = product.image
    formProduct.description = product.description
    formProduct.longDescription = product.longDescription
    formProduct.active = product.active
  } else {
    editingId.value = null
    formProduct.name = ''
    formProduct.price = 0
    formProduct.image = '/images/hero.png'
    formProduct.description = ''
    formProduct.longDescription = ''
    formProduct.active = true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = () => {
  if (editingId.value) {
    if (isEditingTop.value) {
      store.updateTopProduct(editingId.value, { ...formProduct })
    } else {
      store.updateProduct(editingId.value, { ...formProduct })
    }
  } else {
    if (isEditingTop.value) {
      store.addTopProduct({ ...formProduct })
    } else {
      store.addProduct({ ...formProduct })
    }
  }
  closeModal()
}

const login = () => {
  if (password.value === 'admin') {
    isAuthenticated.value = true
    localStorage.setItem('is_auth', 'true')
    error.value = ''
  } else {
  }
}

const saveEverything = () => {
  // Since we use v-model directly on the store state, data is already updated reactively.
  // We just need to trigger the save to localStorage (which the store watcher does)
  // and show a confirmation.
  store.content = { ...store.content } // Trigger watch
  
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
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


.login-card h2 { margin-bottom: 1rem; }
.login-card p { color: var(--text-muted); margin-bottom: 2rem; }

.input-with-action {
  display: flex;
  gap: 0.5rem;
}

.btn-browse {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  background: var(--glass-border);
  border: 1px solid var(--text-muted);
  padding: 0 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-browse:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

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
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--text-muted);
  padding: 12px;
  border-radius: 10px;
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.8);
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
.admin-view {
  min-height: 100vh;
  background-image: url('/hero-texture.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: var(--font-secondary);
  color: var(--text);
}

.admin-layout {
  display: flex;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.4); /* Subtle glass overlay */
  backdrop-filter: blur(5px);
}

.login-container {
  min-height: 100vh;
  background-image: url('/hero-texture.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  text-align: center;
  /* Glass effect inherited from global */
  background: rgba(255, 255, 255, 0.85) !important;
  box-shadow: 0 10px 40px rgba(89, 98, 75, 0.2);
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
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
  box-shadow: 0 4px 12px rgba(89, 98, 75, 0.4);
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

/* Products Admin Grid */
.products-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-item {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: opacity 0.3s ease;
}

.product-item.inactive {
  opacity: 0.6;
}

.product-info-mini {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumb {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.05);
}

.product-info-mini h4 {
  margin: 0;
  font-size: 1.1rem;
}

.price-tag {
  font-weight: 700;
  color: var(--primary);
  font-size: 0.9rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.btn-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.btn-status.active {
  background: rgba(132, 204, 22, 0.1);
  color: #84cc16;
  border: 1px solid rgba(132, 204, 22, 0.2);
}

.btn-status.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-edit {
  padding: 6px 12px;
  background: var(--glass-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-delete-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(239, 68, 68, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { margin: 0; }

.btn-close {
  background: transparent;
  font-size: 1.5rem;
  color: var(--text-muted);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.url-input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview-admin {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed var(--glass-border);
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-error {
  position: absolute;
  bottom: 10px;
  background: rgba(239, 68, 68, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Admin Responsive */
@media (max-width: 900px) {
  .admin-layout {
    flex-direction: column;
    padding: 1rem;
  }

  .sidebar {
    width: 100%;
    padding: 1.5rem;
  }

  .sidebar-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .sidebar-nav button {
    white-space: nowrap;
  }

  .editor-card {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: span 1;
  }

  .products-grid-admin {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .modal-content {
    max-height: 95vh;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}


/* Toast Notification */
.btn-save-all {
  margin-top: 1rem;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-save-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(89, 98, 75, 0.4);
}

.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(132, 204, 22, 0.9) !important; /* Greenish */
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 3000;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  font-weight: 600;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
