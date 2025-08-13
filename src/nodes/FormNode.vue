<template>
  <v-group
    :config="{
      x: params.x,
      y: params.y,
      draggable: true
    }"
    @dragmove="handleNodeDrag"
    @click="handleNodeClick"
    @mouseenter="handleNodeHover(true)"
    @mouseleave="handleNodeHover(false)"
  >
    <!-- Fondo del nodo - Rectangular para formularios -->
    <v-rect
      :config="{
        width: 250,
        height: 380,
        fill: '#ffffff',
        cornerRadius: 8,
        stroke: '#42b883',
      }"
      ref="nodeRef"
    />

    <!-- Icono de formulario -->
    <v-text
      :config="{
        text: '📋',
        fontSize: 18,
        x: 10,
        y: 30,
        fill: '#f7b731',
        width: 30,
        align: 'center'
      }"
    />

    <!-- Título -->
    <v-text
      :config="{
        text: params.title,
        fontSize: 16,
        x: 50,
        y: 30,
        fill: '#999',
        fontStyle: 'bold'
      }"
    />

    <!-- Subtítulo -->
    <v-text
      :config="{
        text: params.subtitle,
        fontSize: 14,
        x: 50,
        y: 55,
        fill: '#999999'
      }"
    />

    <!-- Campo de texto - Nombre -->
    <InputField
      label="Nombre:"
      :value="formData.name"
      placeholder="Ingrese su nombre"
      :x="20"
      :y="90"
      :width="210"
      :height="25"
    />

    <!-- Campo de email -->
    <InputField
      label="Email:"
      :value="formData.email"
      placeholder="ejemplo@email.com"
      :x="20"
      :y="150"
      :width="210"
      :height="25"
    />

    <!-- Área de texto - Comentarios -->
    <InputField
      label="Comentarios:"
      :value="formData.comments"
      placeholder="Escriba sus comentarios aquí..."
      :x="20"
      :y="210"
      :width="210"
      :height="60"
    />

    <!-- Botón de envío -->
    <v-rect
      :config="{
        x: 20,
        y: 310,
        width: 210,
        height: 30,
        fill: '#42b883',
        stroke: '#42b883',
        strokeWidth: 1,
        cornerRadius: 6,
        className: 'submit-button'
      }"
    />
    <v-text
      :config="{
        text: 'Enviar',
        fontSize: 12,
        x: 125,
        y: 320,
        fill: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        width: 100
      }"
    />

    <!-- Conector izquierdo -->
    <v-circle
      :config="{
        x: 0,
        y: getDimensions().height / 2,
        radius: 6,
        fill: '#ff0',
        stroke: '#9999',
        strokeWidth: 2
      }"
    />

    <!-- Conector derecho -->
    <v-circle
      :config="{
        x: getDimensions().width,
        y: getDimensions().height / 2,
        radius: 6,
        fill: '#ffffff',
        stroke: '#9999',
        strokeWidth: 2
      }"
    />
  </v-group>
</template>

<script setup>
import { ref, reactive } from 'vue'
import InputField from './form-nodes/InputField.vue'

const props = defineProps({
  params: { 
    type: Object, 
    required: true,
    default: () => ({
      x: 50,
      y: 50,
      title: 'Formulario',
      subtitle: 'Proceso',
      id: 'form-node'
    })
  }
})

const emit = defineEmits(['update:position', 'node-click', 'form-submit'])

const hovered = ref(false)
const nodeRef = ref(null)

// Datos del formulario
const formData = reactive({
  name: '',
  email: '',
  comments: ''
})

const handleNodeDrag = (event) => {
  const group = event.target
  const newPosition = { x: group.x(), y: group.y() }
  emit('update:position', newPosition)
}

const handleNodeClick = () => {
  emit('node-click', { id: props.params.id, type: 'form', title: props.params.title, subtitle: props.params.subtitle })
}

const handleNodeHover = (isHovered) => {
  hovered.value = isHovered
}

// Función para actualizar datos del formulario
const updateFormData = (field, value) => {
  formData[field] = value
}

// Función para enviar el formulario
const submitForm = () => {
  emit('form-submit', { ...formData, nodeId: props.params.id })
}

// Background dimensions
const getDimensions = () => {
  const background = nodeRef.value?.getNode()
  if (!background) return { width: 0, height: 0 }
  const backgroundWidth = background.width()
  const backgroundHeight = background.height()

  return {
    width: backgroundWidth,
    height: backgroundHeight
  }
}

defineExpose({
  getNode: () => nodeRef.value?.getNode(),
  getDimensions: getDimensions,
  updateFormData,
  submitForm,
  formData
})
</script>

<style scoped>
.submit-button {
  cursor: pointer;
}
</style>