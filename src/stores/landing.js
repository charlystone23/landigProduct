import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLandingStore = defineStore('landing', () => {
  const content = ref({
    hero: {
      title: 'Sabiduría Ancestral en cada Esencia',
      subtitle: 'Reconecta con la naturaleza a través del poder curativo de los hongos medicinales y la medicina tradicional.',
      cta: 'Explorar medicina',
      image: '/hero-texture.jpg'
    },
    sections: [
      {
        id: 'ancestral',
        title: 'TIPO DE EXTRACTOS',
        text: 'Nuestros hongos son cultivados siguiendo ciclos lunares y métodos ancestrales para preservar su fuerza vital.',
        image: '/images/section1.png',
        centered: true,
        categories: [
          {
            name: 'Tintura Madre Espagírica',
            image: '/images/category-tincture.jpg',
            description: 'Extracto concentrado de alta potencia.',
            longDescription: 'La tintura madre espagírica captura la esencia completa del hongo, combinando el extracto alcohólico con las sales minerales purificadas de la planta. Este proceso alquímico asegura una biodisponibilidad superior y una potencia máxima.'
          },
          {
            name: 'Aceites',
            image: '/images/category-oils.jpg',
            description: 'Aceites infusionados para uso tópico e interno.',
            longDescription: 'Nuestros aceites medicinales son infusionados lentamente para extraer los compuestos liposolubles de los hongos. Ideales para aplicaciones tópicas o como suplemento dietético suave y nutritivo.'
          },
          {
            name: 'Microdosis',
            image: '/images/category-microdosis.jpg',
            description: 'Dosis precisas para integración diaria.',
            longDescription: 'Las microdosis permiten integrar los beneficios de los hongos medicinales en tu rutina diaria de manera sutil pero efectiva. Perfectas para mantener el equilibrio y la claridad mental sin efectos abrumadores.'
          }
        ]
      },
      {
        id: 'science',
        title: 'Ciencia y Espíritu',
        text: 'Combinamos la sabiduría milenaria con procesos de extracción modernos para garantizar la máxima biodisponibilidad.',
        image: '/images/section2.png'
      }
    ],
    products: [
      {
        id: 1,
        name: 'Extracto de Melena de León',
        description: 'Potencia tu claridad mental, enfoque y regeneración neuronal con medicina natural pura.',
        longDescription: 'La Melena de León (Hericium erinaceus) es un hongo excepcional conocido por su capacidad para estimular el Factor de Crecimiento Nervioso (NGF). Ayuda a la memoria, la concentración y la salud general del cerebro.',
        price: 45,
        image: '/images/product1.png',
        active: true
      },
      {
        id: 2,
        name: 'Tintura de Reishi (Inmortalidad)',
        description: 'Encuentra el equilibrio profundo, reduce el estrés y fortalece tu sistema inmunológico.',
        longDescription: 'El Reishi (Ganoderma lucidum) ha sido valorado durante milenos en la medicina oriental. Es un adaptógeno potente que ayuda al cuerpo a manejar el estrés, mejora la calidad del sueño y equilibra el sistema inmunológico.',
        price: 38,
        image: '/images/product2.png',
        active: true
      },
      {
        id: 3,
        name: 'Fórmulas Ancestrales',
        description: 'Mezcla sagrada de hierbas y hongos para una conexión espiritual y sanación integral.',
        longDescription: 'Nuestras fórmulas combinan el conocimiento de los antiguos herbolarios con la pureza de los hongos medicinales. Diseñadas para rituales de sanación y meditación profunda.',
        price: 55,
        image: '/images/product3.png',
        active: true
      },
      {
        id: 4,
        name: 'Cordyceps Militaris',
        description: 'Energía natural y rendimiento físico sin estimulantes artificiales.',
        longDescription: 'Conocido como el hongo de la energía, el Cordyceps ayuda a mejorar la utilización del oxígeno y aumenta los niveles de ATP, mejorando el rendimiento deportivo y la vitalidad diaria.',
        price: 42,
        image: '/images/hero.png',
        active: true
      },
      {
        id: 5,
        name: 'Chaga Ártico',
        description: 'El antioxidante más potente de la naturaleza para proteger tu ADN.',
        longDescription: 'Recolectado de bosques prístinos, el Chaga es rico en melanina y superóxido dismutasa. Fortalece la piel, el cabello y protege las células contra el daño oxidativo.',
        price: 48,
        image: '/images/hero.png',
        active: false
      },
      {
        id: 6,
        name: 'Cola de Pavo',
        description: 'Inmunomodulador esencial para la salud digestiva y sistémica.',
        longDescription: 'Rico en polisacáridos Krestin (PSK), este hongo es fundamental para equilibrar el microbioma intestinal y fortalecer las defensas naturales del cuerpo.',
        price: 35,
        image: '/images/hero.png',
        active: true
      },
      {
        id: 7,
        name: 'Shiitake Vital',
        description: 'Nutrición superior y apoyo cardiovascular ancestral.',
        longDescription: 'Más que un hongo culinario, el Shiitake contiene lentinano, que ayuda a mantener niveles saludables de colesterol y apoya el bienestar circulatorio.',
        price: 30,
        image: '/images/hero.png',
        active: true
      }
    ],
    topProductsTitle: 'Tipos de extractos',
    topProducts: [
      {
        id: 101,
        name: 'Pack Energía Ancestral',
        description: 'La combinación perfecta para tu día a día.',
        longDescription: 'Este pack incluye nuestro extracto de Melena de León y Cordyceps para darte el enfoque y la energía que necesitas sin caídas.',
        price: 75,
        image: '/images/product1.png',
        active: true
      },
      {
        id: 102,
        name: 'Kit Inmunidad Total',
        description: 'Protección profunda para todo el año.',
        longDescription: 'Combina el poder del Reishi y el Chaga para crear un escudo natural impenetrable contra el estrés y las agresiones externas.',
        price: 80,
        image: '/images/product2.png',
        active: true
      }
    ],
    theme: {
      primary: '#59624b',
      secondary: '#9e7c38',
      background: '#ede5cf',
      text: '#2c3520'
    },
    cart: []
  })

  // Load from localStorage if available
  const savedContent = localStorage.getItem('landing_content')
  if (savedContent) {
    try {
      const parsed = JSON.parse(savedContent)

      // Asegurar que los nuevos productos por defecto existan en el estado cargado
      if (parsed.products) {
        content.value.products.forEach(defaultProduct => {
          const exists = parsed.products.find(p => p.id === defaultProduct.id)
          if (!exists) {
            parsed.products.push({ ...defaultProduct })
          }
        })

        // Migración básica para añadir 'active' a productos viejos guardados
        parsed.products = parsed.products.map(p => ({
          ...p,
          active: p.active !== undefined ? p.active : true
        }))
      }

      // Asegurar que topProducts existan
      if (!parsed.topProductsTitle) {
        parsed.topProductsTitle = content.value.topProductsTitle
      }
      if (!parsed.topProducts) {
        parsed.topProducts = [...content.value.topProducts]
      } else {
        // Asegurar active flag en topProducts
        parsed.topProducts = parsed.topProducts.map(p => ({
          ...p,
          active: p.active !== undefined ? p.active : true
        }))
      }

      // Force update hero image to ensure it is /hero-texture.jpg
      if (parsed.hero) {
        parsed.hero.image = '/hero-texture.jpg'
      }

      // Asegurar que el carrito existe
      if (!parsed.cart) {
        parsed.cart = []
      }

      content.value = { ...content.value, ...parsed }
    } catch (e) {
      console.error('Error parsing saved content', e)
    }
  }

  // Watch for changes and save to localStorage
  watch(content, (newVal) => {
    localStorage.setItem('landing_content', JSON.stringify(newVal))
  }, { deep: true })

  const updateHero = (newData) => {
    content.value.hero = { ...content.value.hero, ...newData }
  }

  const updateSection = (id, newData) => {
    const index = content.value.sections.findIndex(s => s.id === id)
    if (index !== -1) {
      content.value.sections[index] = { ...content.value.sections[index], ...newData }
    }
  }

  const addSection = () => {
    const newId = `section-${Date.now()}`
    content.value.sections.push({
      id: newId,
      title: 'Nueva Sección',
      text: 'Descripción de la nueva sección.',
      image: '/images/section1.png'
    })
  }

  const removeSection = (id) => {
    content.value.sections = content.value.sections.filter(s => s.id !== id)
  }

  const updateProduct = (id, newData) => {
    const index = content.value.products.findIndex(p => p.id === id)
    if (index !== -1) {
      content.value.products[index] = { ...content.value.products[index], ...newData }
    }
  }

  const addProduct = (productData) => {
    const newId = content.value.products.length > 0
      ? Math.max(...content.value.products.map(p => p.id)) + 1
      : 1

    content.value.products.push({
      id: newId,
      name: productData?.name || 'Nuevo Producto',
      description: productData?.description || 'Breve descripción del producto.',
      longDescription: productData?.longDescription || 'Descripción detallada para el modal.',
      price: productData?.price || 0,
      image: productData?.image || '/images/hero.png',
      active: productData?.active !== undefined ? productData.active : true
    })
  }

  const removeProduct = (id) => {
    content.value.products = content.value.products.filter(p => p.id !== id)
  }

  // Top Products Actions
  const updateTopProduct = (id, newData) => {
    const index = content.value.topProducts.findIndex(p => p.id === id)
    if (index !== -1) {
      content.value.topProducts[index] = { ...content.value.topProducts[index], ...newData }
    }
  }

  const addTopProduct = (productData) => {
    const newId = content.value.topProducts.length > 0
      ? Math.max(...content.value.topProducts.map(p => p.id)) + 1000 // Unique range
      : 1001

    content.value.topProducts.push({
      id: newId,
      name: productData?.name || 'Nuevo Pack',
      description: productData?.description || 'Breve descripción.',
      longDescription: productData?.longDescription || 'Descripción detallada.',
      price: productData?.price || 0,
      image: productData?.image || '/images/hero.png',
      active: productData?.active !== undefined ? productData.active : true
    })
  }

  const removeTopProduct = (id) => {
    content.value.topProducts = content.value.topProducts.filter(p => p.id !== id)
  }

  const updateTheme = (newTheme) => {
    content.value.theme = { ...content.value.theme, ...newTheme }
  }

  // Cart Actions
  const addToCart = (product, quantity) => {
    const existingIndex = content.value.cart.findIndex(item => item.id === product.id)
    if (existingIndex !== -1) {
      content.value.cart[existingIndex].quantity += quantity
    } else {
      content.value.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      })
    }
  }

  const removeFromCart = (productId) => {
    content.value.cart = content.value.cart.filter(item => item.id !== productId)
  }

  const updateCartQuantity = (productId, quantity) => {
    const item = content.value.cart.find(i => i.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  const clearCart = () => {
    content.value.cart = []
  }

  return {
    content,
    updateHero,
    updateSection,
    addSection,
    removeSection,
    updateProduct,
    addProduct,
    removeProduct,
    updateTopProduct,
    addTopProduct,
    removeTopProduct,
    updateTheme,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  }
})
