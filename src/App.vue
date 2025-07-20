<script setup>
import { RouterView } from 'vue-router';
import DefaultLayout from './layout/DefaultLayout.vue';
import NetworkStatus from './components/common/NetworkStatus.vue';
import PWAInstallPrompt from './components/common/PWAInstallPrompt.vue';
import PWAUpdatePrompt from './components/common/PWAUpdatePrompt.vue';
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>

  <!-- PWA 관련 컴포넌트들 -->
  <NetworkStatus />
  <PWAInstallPrompt />
  <PWAUpdatePrompt />
</template>

<style scoped></style>
