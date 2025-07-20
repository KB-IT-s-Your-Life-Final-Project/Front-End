<script setup>
import { ref, onMounted } from 'vue';

const showInstallPrompt = ref(false);
const deferredPrompt = ref(null);

onMounted(() => {
  // PWA 설치 프롬프트 감지
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
  });

  // 이미 설치된 경우 프롬프트 숨기기
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false;
    deferredPrompt.value = null;
  });
});

const installApp = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === 'accepted') {
      console.log('사용자가 PWA 설치를 허용했습니다.');
    } else {
      console.log('사용자가 PWA 설치를 거부했습니다.');
    }

    deferredPrompt.value = null;
    showInstallPrompt.value = false;
  }
};

const dismissPrompt = () => {
  showInstallPrompt.value = false;
};
</script>

<template>
  <!-- 설치 안내 배너 -->
  <div v-if="showInstallPrompt" class="install-banner">
    <div class="install-content">
      <div class="install-text">
        <h4>앱으로 설치하기</h4>
        <p>홈 화면에 추가하여 더 빠르게 접근하세요!</p>
      </div>
      <div class="install-actions">
        <button @click="installApp" class="install-btn">설치</button>
        <button @click="dismissPrompt" class="dismiss-btn">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #007bff;
  color: white;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.install-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.install-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.install-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.install-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.install-btn {
  background: white;
  color: #007bff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.install-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.dismiss-btn {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .install-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .install-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
