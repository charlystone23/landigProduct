import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLandingStore = defineStore('landing', () => {
  const content = ref({
    hero: {
      title: 'Sabiduría Ancestral en cada Esencia',
      subtitle: 'Reconecta con la naturaleza a través del poder curativo de los hongos medicinales y la medicina tradicional.',
      cta: 'Explorar medicina',
      image: '/images/hero.png'
    },
    sections: [
      {
        id: 'ancestral',
        title: 'Cultivo Sagrado',
        text: 'Nuestros hongos son cultivados siguiendo ciclos lunares y métodos ancestrales para preservar su fuerza vital.',
        image: '/images/section1.png'
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
        image: '/images/product1.png'
      },
      {
        id: 2,
        name: 'Tintura de Reishi (Inmortalidad)',
        description: 'Encuentra el equilibrio profundo, reduce el estrés y fortalece tu sistema inmunológico.',
        longDescription: 'El Reishi (Ganoderma lucidum) ha sido valorado durante milenos en la medicina oriental. Es un adaptógeno potente que ayuda al cuerpo a manejar el estrés, mejora la calidad del sueño y equilibra el sistema inmunológico.',
        price: 38,
        image: '/images/product2.png'
      },
      {
        id: 3,
        name: 'Fórmulas Ancestrales',
        description: 'Mezcla sagrada de hierbas y hongos para una conexión espiritual y sanación integral.',
        longDescription: 'Nuestras fórmulas combinan el conocimiento de los antiguos herbolarios con la pureza de los hongos medicinales. Diseñadas para rituales de sanación y meditación profunda.',
        price: 55,
        image: '/images/product3.png'
      }
    ],
    theme: {
      primary: '#84cc16',
      secondary: '#10b981',
      background: '#0c0f0a',
      text: '#f7fee7'
    }
  })

  // Load from localStorage if available
  const savedContent = localStorage.getItem('landing_content')
  if (savedContent) {
    try {
      content.value = JSON.parse(savedContent)
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

  const updateProduct = (id, newData) => {
    const index = content.value.products.findIndex(p => p.id === id)
    if (index !== -1) {
      content.value.products[index] = { ...content.value.products[index], ...newData }
    }
  }

  const addProduct = () => {
    const newId = content.value.products.length > 0
      ? Math.max(...content.value.products.map(p => p.id)) + 1
      : 1

    content.value.products.push({
      id: newId,
      name: 'Nuevo Producto',
      description: 'Breve descripción del producto.',
      longDescription: 'Descripción detallada para el modal.',
      price: 0,
      image: '/images/hero.png'
    })
  }

  const removeProduct = (id) => {
    content.value.products = content.value.products.filter(p => p.id !== id)
  }

  const updateTheme = (newTheme) => {
    content.value.theme = { ...content.value.theme, ...newTheme }
  }

  return {
    content,
    updateHero,
    updateSection,
    updateProduct,
    addProduct,
    removeProduct,
    updateTheme
  }
})
