// Exportar todos los tipos de nodos
export { default as StartNode } from './StartNode.vue'
export { default as FormNode } from './FormNode.vue'
export { default as EndNode } from './EndNode.vue'

// Definir los tipos de nodos disponibles
export const NODE_TYPES = {
  START: 'start',
  FORM: 'form',
  END: 'end',
}

// Mapeo de tipos a componentes
export const NODE_COMPONENTS = {
  [NODE_TYPES.START]: 'StartNode',
  [NODE_TYPES.FORM]: 'FormNode',
  [NODE_TYPES.END]: 'EndNode',
}

// Configuración por defecto para cada tipo de nodo
export const NODE_DEFAULTS = {
  [NODE_TYPES.START]: {
    title: 'Inicio',
    width: 180,
    height: 80
  },
  [NODE_TYPES.FORM]: {
    title: 'Formulario',
    subtitle: 'Proceso',
    width: 180,
    height: 80
  },
  [NODE_TYPES.END]: {
    title: 'Fin',
    width: 180,
    height: 80
  },
}
