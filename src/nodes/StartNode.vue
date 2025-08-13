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
    <!-- Fondo del nodo - Forma ovalada para inicio -->
    <v-rect
      :config="{
        width: 180,
        height: 50,
        cornerRadius: 8,
        stroke: '#42b883',
        fill: '#ffffff',
        strokeWidth: 2,
      }"
      ref="nodeRef"
    />  

    <!-- Título -->
    <v-text
      :config="{
        text: params.title,
        fontSize: 14,
        x: 0,
        y: 0,
        fill: '#42b883',
        fontStyle: 'bold',
        width: 180,
        height: 50,  
        verticalAlign: 'middle',
        align: 'center',
      }"
    />

    <!-- Conector de salida -->
    <v-circle
      :config="{
        x: 180,
        y: 25,
        radius: 6,
        fill: '#ffffff',
        stroke: '#9999',
        strokeWidth: 2
      }"
    />
  </v-group>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  params: { 
    type: Object, 
    required: true,
    default: () => ({
      x: 50,
      y: 50,
      title: 'Inicio',
      id: 'start-node'
    })
  }
})

const emit = defineEmits(['update:position', 'node-click'])
const hovered = ref(false)
const nodeRef = ref(null)

const handleNodeDrag = (event) => {
  const group = event.target
  const newPosition = { x: group.x(), y: group.y() }
  emit('update:position', newPosition)
}

const handleNodeClick = () => {
  emit('node-click', { id: props.params.id, type: 'start', title: props.params.title })
}

const handleNodeHover = (isHovered) => {
  hovered.value = isHovered
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
  getDimensions: getDimensions
})
</script>
