<template>
  <div class="flow-editor">
    <!-- Canvas -->
    <v-stage 
      :config="{ width: windowWidth, height: windowHeight, draggable: stageDraggable }" 
      ref="stageRef"
      @wheel="handleWheel"
    >
      <!-- Layer for connections -->  
      <v-layer ref="connectionLayerRef">
        <template v-if="showConnections">
          <v-shape
            v-for="connection in connections"
            :key="`${connection.from}-${connection.to}`"
            :config="{
              sceneFunc: (ctx, shape) => drawConnection(ctx, shape, connection),
              stroke: '#9999',
              strokeWidth:2
            }"
          />
        </template>
      </v-layer>

      <!-- Layer for nodes -->
      <v-layer ref="nodeLayerRef">
        <component
          v-for="node in nodes"
          :key="node.id"
          :is="getNodeComponent(node.type)"
          :params="node"
          @update:position="updateNodePosition(node.id, $event)"
          @node-click="handleNodeClick"
          :ref="el => setNodeRef(node.id, el)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { StartNode, FormNode, EndNode, NODE_TYPES } from '../nodes'

// Stage references
const stageRef = ref(null)
const connectionLayerRef = ref(null)
const nodeLayerRef = ref(null)
const nodeRefs = ref({})

// Window dimensions
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// Stage state
const stageDraggable = ref(true)
const showConnections = ref(true)

// Nodes data
const nodes = ref([])
const connections = ref([])
const nodeMap = ref({})

// Node component mapping
const nodeComponents = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.FORM]: FormNode,
  [NODE_TYPES.END]: EndNode,
}

const props = defineProps({
  onPaneReady: {
    type: Function,
    required: true
  }
})

// Function to get component by node type
const getNodeComponent = (type) => {
  return nodeComponents[type] || FormNode // Default to FormNode if type not found
}

// Initialize nodes and connections
const initializeData = () => {
  const nodesQuantity = {
    rows: 20,
    cols: 20,
  }
  
  const nodeData = []
  const connectionData = []
  const gap = 500

  // startNode
  nodeData.push({
    id: 'start-1',
    type: NODE_TYPES.START,
    title: 'Inicio del Proceso',
    x: 100, 
    y: gap 
  })
  for (let row = 1; row <= nodesQuantity.rows; row++) {
    for (let col = 1; col <= nodesQuantity.cols; col++) {
      // formNode
      nodeData.push({
        id: `form-${row}-${col}`,
        type: NODE_TYPES.FORM,
        title: `Form ${row}-${col}`,
        subtitle: 'Proceso',
        x: 100 + col * gap,
        y: 100 + row * gap
      })
      // connections with startNode and endNode
      connectionData.push({
        from: 'start-1',
        to: `form-${row}-${col}`
      })
      connectionData.push({
        from: `form-${row}-${col}`,
        to: 'end-1'
      })
    }
  }
  // endNode
  nodeData.push({
    id: 'end-1',
    type: NODE_TYPES.END,
    title: 'Proceso Completado',
    x: 200 + ((nodesQuantity.cols + 1) * gap),
    y: 100 + (nodesQuantity.rows + 1) * gap
  })

  nodes.value = nodeData
  connections.value = connectionData
  
  // Create node map for quick access
  nodeMap.value = {}
  nodes.value.forEach(node => {
    nodeMap.value[node.id] = node
  })

  props.onPaneReady()
}

// Add new node
const addNode = (type) => {
  const nodeId = `${type}-${Date.now()}`
  const newNode = {
    id: nodeId,
    type: type,
    x: Math.random() * (windowWidth.value - 200) + 100,
    y: Math.random() * (windowHeight.value - 200) + 100
  }

  // Add default properties based on type
  switch (type) {
    case NODE_TYPES.START:
      newNode.title = 'Nuevo Inicio'
      break
    case NODE_TYPES.FORM:
      newNode.title = 'Nuevo Formulario'
      newNode.subtitle = 'Proceso'
      break
    case NODE_TYPES.END:
      newNode.title = 'Nuevo Fin'
      break
  }

  nodes.value.push(newNode)
  nodeMap.value[nodeId] = newNode
}

function zoom(stage, factor) {
  const oldScale = stage.scaleX();
  const newScale = oldScale * factor;
  const mouse = stage.getPointerPosition();
  const pointTo = {
    x: mouse.x / oldScale - stage.x() / oldScale,
    y: mouse.y / oldScale - stage.y() / oldScale
  };
  stage.scale({ x: newScale, y: newScale });
  stage.position({
    x: -(pointTo.x - mouse.x / newScale) * newScale,
    y: -(pointTo.y - mouse.y / newScale) * newScale
  });
  stage.batchDraw();
}

// Handle mouse wheel zoom
const handleWheel = (e) => {
  e.evt.preventDefault()
  const factor = e.evt.deltaY > 0 ? 0.9 : 1.1

  zoom(stageRef.value.getNode(), factor)
}

// Update node position
const updateNodePosition = (nodeId, position) => {
  const node = nodeMap.value[nodeId]
  if (node) {
    node.x = position.x
    node.y = position.y
  }
  
  // Redraw connections when node is dragged
  if (connectionLayerRef.value) {
    connectionLayerRef.value.getNode().batchDraw()
  }
}

// Handle node click
const handleNodeClick = (nodeData) => {
  console.log('Nodo clickeado:', nodeData)
}

// Set node reference
const setNodeRef = (nodeId, el) => {
  if (el) {
    nodeRefs.value[nodeId] = el
  }
}

// Get node dimensions
const getNodeDimentions = (nodeId) => {
  const nodeRef = nodeRefs.value[nodeId]
  if (!nodeRef) return { width: 0, height: 0 }  
  const dimensions = nodeRef.getDimensions()

  return {
    width: dimensions.width,
    height: dimensions.height
  }
}

// Draw connection between nodes
const drawConnection = (ctx, shape, connection) => {
  const fromNode = nodeMap.value[connection.from]
  const toNode = nodeMap.value[connection.to]

  const fromNodeDimensions = getNodeDimentions(connection.from)
  const toNodeDimensions = getNodeDimentions(connection.to)

  if (!fromNode || !toNode) return

  let startX, startY, endX, endY

  startX = fromNode.x + fromNodeDimensions.width
  startY = fromNode.y + fromNodeDimensions.height / 2


  endX = toNode.x
  endY = toNode.y + toNodeDimensions.height / 2

  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.bezierCurveTo(startX + 50, startY, endX - 50, endY, endX, endY)
  ctx.strokeShape(shape)
}

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

// Lifecycle
onMounted(() => {
  initializeData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.flow-editor {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: white;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
}
</style>