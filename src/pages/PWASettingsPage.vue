<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePWAStore } from '@/stores/pwa';
import { getInstallGuide } from '@/utils/pwa';

const pwaStore = usePWAStore();
const pwaInfo = ref(null);
const loading = ref(true);

const installGuide = computed(() => getInstallGuide());

onMounted(async () => {
  try {
    pwaInfo.value = await pwaStore.fetchPWAInfo();
  } catch (error) {
    console.error('PWA 정보 로드 실패:', error);
  } finally {
    loading.value = false;
  }
});

const handleInstall = async () => {
  const success = await pwaStore.installPWA();
  if (success) {
    alert('앱이 성공적으로 설치되었습니다!');
  }
};

const clearOfflineData = () => {
  pwaStore.clearOfflineQueue();
  alert('오프라인 데이터가 정리되었습니다.');
};

const refreshServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
      alert('서비스 워커가 업데이트되었습니다.');
    }
  }
};
</script>

<template>
  <div class="pwa-settings">
    <h1>PWA 설정</h1>

    <div v-if="loading" class="loading">정보를 불러오는 중...</div>

    <div v-else class="settings-container">
      <!-- PWA 상태 정보 -->
      <section class="status-section">
        <h2>PWA 상태</h2>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">설치 가능:</span>
            <span
              class="value"
              :class="{
                success: pwaStore.isInstallable,
                error: !pwaStore.isInstallable,
              }"
            >
              {{ pwaStore.isInstallable ? '예' : '아니오' }}
            </span>
          </div>

          <div class="status-item">
            <span class="label">설치됨:</span>
            <span
              class="value"
              :class="{
                success: pwaStore.isInstalled,
                error: !pwaStore.isInstalled,
              }"
            >
              {{ pwaStore.isInstalled ? '예' : '아니오' }}
            </span>
          </div>

          <div class="status-item">
            <span class="label">온라인 상태:</span>
            <span
              class="value"
              :class="{ success: pwaStore.isOnline, error: !pwaStore.isOnline }"
            >
              {{ pwaStore.isOnline ? '온라인' : '오프라인' }}
            </span>
          </div>

          <div class="status-item">
            <span class="label">네트워크 유형:</span>
            <span class="value">{{ pwaStore.networkType }}</span>
          </div>

          <div class="status-item">
            <span class="label">서비스 워커:</span>
            <span
              class="value"
              :class="{
                success: pwaInfo?.serviceWorker?.registered,
                error: !pwaInfo?.serviceWorker?.registered,
              }"
            >
              {{ pwaInfo?.serviceWorker?.registered ? '등록됨' : '등록 안됨' }}
            </span>
          </div>

          <div class="status-item">
            <span class="label">오프라인 큐:</span>
            <span class="value">{{ pwaStore.offlineQueue.length }}개 항목</span>
          </div>
        </div>
      </section>

      <!-- PWA 액션들 -->
      <section class="actions-section">
        <h2>PWA 관리</h2>
        <div class="actions-grid">
          <button
            v-if="pwaStore.canInstall"
            @click="handleInstall"
            class="action-btn install-btn"
          >
            📱 앱 설치하기
          </button>

          <button @click="refreshServiceWorker" class="action-btn update-btn">
            🔄 서비스 워커 업데이트
          </button>

          <button
            @click="clearOfflineData"
            class="action-btn clear-btn"
            :disabled="pwaStore.offlineQueue.length === 0"
          >
            🗑️ 오프라인 데이터 정리
          </button>
        </div>
      </section>

      <!-- 설치 가이드 -->
      <section class="guide-section" v-if="!pwaStore.isInstalled">
        <h2>설치 가이드</h2>
        <div class="guide-content">
          <p>{{ installGuide }}</p>
        </div>
      </section>

      <!-- 기술 정보 -->
      <section class="technical-section">
        <h2>기술 정보</h2>
        <div class="tech-info">
          <div class="tech-item">
            <strong>플랫폼:</strong> {{ pwaInfo?.platform }}
          </div>
          <div class="tech-item">
            <strong>User Agent:</strong>
            <small>{{ pwaInfo?.userAgent }}</small>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pwa-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 600;
}

.value.success {
  color: #28a745;
}

.value.error {
  color: #dc3545;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.install-btn {
  background: #007bff;
  color: white;
}

.install-btn:hover {
  background: #0056b3;
}

.update-btn {
  background: #28a745;
  color: white;
}

.update-btn:hover {
  background: #1e7e34;
}

.clear-btn {
  background: #dc3545;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background: #c82333;
}

.clear-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.guide-content {
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tech-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.tech-item:last-child {
  border-bottom: none;
}

.tech-item small {
  display: block;
  color: #666;
  margin-top: 0.25rem;
  word-break: break-all;
}

@media (max-width: 768px) {
  .pwa-settings {
    padding: 1rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
