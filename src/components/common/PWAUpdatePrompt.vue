<script setup>
import { ref, onMounted } from 'vue';

const showUpdatePrompt = ref(false);
let updateSW = null;

onMounted(() => {
  // PWA 업데이트 감지
  if ('serviceWorker' in navigator) {
    import('virtual:pwa-register').then(({ registerSW }) => {
      updateSW = registerSW({
        onNeedRefresh() {
          showUpdatePrompt.value = true;
        },
        onOfflineReady() {
          console.log('앱이 오프라인에서 사용할 준비가 되었습니다.');
        },
      });
    });
  }
});

const updateApp = () => {
  if (updateSW) {
    updateSW(true);
  }
};

const closePrompt = () => {
  showUpdatePrompt.value = false;
};
</script>

<template>
  <!-- 업데이트 알림 팝업 -->
  <div v-if="showUpdatePrompt" class="update-prompt">
    <div class="update-content">
      <h3>새 버전이 있습니다!</h3>
      <p>앱을 업데이트하시겠습니까?</p>
      <div class="update-buttons">
        <button @click="updateApp" class="update-btn">업데이트</button>
        <button @click="closePrompt" class="cancel-btn">나중에</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.update-prompt {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.update-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.update-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.update-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.update-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.update-btn {
  background: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-btn:hover {
  background: #0056b3;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #545b62;
}
</style>
