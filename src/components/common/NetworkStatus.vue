<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);
const showOfflineMessage = ref(false);

let offlineTimeout = null;

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;

  if (!isOnline.value) {
    // 오프라인이 되면 즉시 메시지 표시
    showOfflineMessage.value = true;
  } else {
    // 온라인이 되면 3초 후 메시지 숨김
    if (offlineTimeout) {
      clearTimeout(offlineTimeout);
    }
    offlineTimeout = setTimeout(() => {
      showOfflineMessage.value = false;
    }, 3000);
  }
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  if (offlineTimeout) {
    clearTimeout(offlineTimeout);
  }
});
</script>

<template>
  <!-- 네트워크 상태 알림 -->
  <Transition name="slide-down">
    <div
      v-if="showOfflineMessage"
      class="network-status"
      :class="{ online: isOnline, offline: !isOnline }"
    >
      <div class="status-content">
        <span class="status-icon">{{ isOnline ? '✅' : '📡' }}</span>
        <span class="status-text">
          {{
            isOnline ? '인터넷에 다시 연결되었습니다' : '오프라인 상태입니다'
          }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.network-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  text-align: center;
  z-index: 1001;
  font-weight: 500;
  transition: all 0.3s ease;
}

.network-status.offline {
  background: #dc3545;
  color: white;
}

.network-status.online {
  background: #28a745;
  color: white;
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.status-icon {
  font-size: 1.2rem;
}

.status-text {
  font-size: 0.9rem;
}

/* 트랜지션 애니메이션 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .network-status {
    padding: 0.75rem;
  }

  .status-text {
    font-size: 0.8rem;
  }
}
</style>
