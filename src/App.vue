<template>
    <div style="width: 100vw; height: 100vh">
        <LoadingOverlay 
            :loading="loading" 
            :initTime="initTime" 
        />
        
        <MetricsPanel 
            :initTime="initTime"
            :paneReadyTime="paneReadyTime"
            :totalAppTime="totalAppTime"
            :memoryUsage="memoryUsage"
            :memoryInfo="memoryInfo"
            :cpuInfo="cpuInfo"
            :performanceMetrics="performanceMetrics"
            :cpuUsage="cpuUsage"
            :frameTime="frameTime"
        />

        <VueKonva />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import MetricsPanel from './components/MetricsPanel.vue'
import { usePerformanceMetrics } from './composables/usePerformanceMetrics'
import VueKonva from './components/VueKonva.vue'

// Usar el composable de métricas de rendimiento
const {
    initTime,
    loading,
    paneReadyTime,
    totalAppTime,
    memoryUsage,
    memoryInfo,
    cpuInfo,
    performanceMetrics,
    cpuUsage,
    frameTime,
    onPaneReady
} = usePerformanceMetrics()
</script>

<style>
body {
    margin: 0;
    padding: 0;
}

#app {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
}
</style>
