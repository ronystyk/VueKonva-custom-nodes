<template>
  <v-group>
    <!-- Label del campo -->
    <v-text
      :config="{
        text: label,
        fontSize: 12,
        x: x,
        y: y,
        fill: '#666666',
        fontStyle: 'bold'
      }"
    />
    
    <!-- Rectángulo del input -->
    <v-rect
      :config="{
        x: x,
        y: y + 20,
        width: width,
        height: height,
        fill: '#f8f9fa',
        stroke: '#dee2e6',
        strokeWidth: 1,
        cornerRadius: 4
      }"
    />
    
    <!-- Texto del input -->
    <v-text
      :config="{
        text: value || placeholder,
        fontSize: 11,
        x: x + 5,
        y: y + 20 + (height / 2) - 4,
        fill: value ? '#333333' : '#999999',
        width: width - 10
      }"
    />
  </v-group>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  x: {
    type: Number,
    default: 20
  },
  y: {
    type: Number,
    default: 90
  },
  width: {
    type: Number,
    default: 210
  },
  height: {
    type: Number,
    default: 25
  }
})
</script>
