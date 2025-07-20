import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  isPWAInstallable,
  isPWAInstalled,
  getNetworkStatus,
  getPWAInfo,
  saveOfflineData,
  loadOfflineData,
} from '@/utils/pwa';

export const usePWAStore = defineStore('pwa', () => {
  // 상태
  const isOnline = ref(navigator.onLine);
  const isInstalled = ref(isPWAInstalled());
  const isInstallable = ref(isPWAInstallable());
  const deferredPrompt = ref(null);
  const updateAvailable = ref(false);
  const offlineQueue = ref([]);

  // 컴퓨티드
  const canInstall = computed(
    () => isInstallable.value && !isInstalled.value && deferredPrompt.value
  );
  const networkType = computed(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    return connection ? connection.effectiveType : 'unknown';
  });

  // 액션들
  const setOnlineStatus = (status) => {
    isOnline.value = status;
  };

  const setDeferredPrompt = (prompt) => {
    deferredPrompt.value = prompt;
    isInstallable.value = !!prompt;
  };

  const setUpdateAvailable = (available) => {
    updateAvailable.value = available;
  };

  const setInstalled = (installed) => {
    isInstalled.value = installed;
  };

  // PWA 설치 실행
  const installPWA = async () => {
    if (!deferredPrompt.value) return false;

    try {
      deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;

      if (outcome === 'accepted') {
        setInstalled(true);
        deferredPrompt.value = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('PWA 설치 오류:', error);
      return false;
    }
  };

  // 오프라인 큐에 요청 추가
  const addToOfflineQueue = (request) => {
    offlineQueue.value.push({
      ...request,
      timestamp: Date.now(),
      id: Date.now() + Math.random(),
    });

    // 로컬 스토리지에 저장
    saveOfflineData('request_queue', offlineQueue.value);
  };

  // 오프라인 큐에서 요청 제거
  const removeFromOfflineQueue = (id) => {
    offlineQueue.value = offlineQueue.value.filter((item) => item.id !== id);
    saveOfflineData('request_queue', offlineQueue.value);
  };

  // 오프라인 큐 비우기
  const clearOfflineQueue = () => {
    offlineQueue.value = [];
    saveOfflineData('request_queue', []);
  };

  // 온라인 상태가 되면 큐의 요청들 처리
  const processOfflineQueue = async () => {
    if (!isOnline.value || offlineQueue.value.length === 0) return;

    const queue = [...offlineQueue.value];

    for (const request of queue) {
      try {
        // 여기서 실제 API 요청을 다시 시도
        // 예: await api.request(request)
        console.log('오프라인 요청 재시도:', request);

        // 성공하면 큐에서 제거
        removeFromOfflineQueue(request.id);
      } catch (error) {
        console.error('오프라인 요청 재시도 실패:', error);
        // 실패한 요청은 큐에 남겨둠
      }
    }
  };

  // PWA 정보 가져오기
  const fetchPWAInfo = async () => {
    try {
      return await getPWAInfo();
    } catch (error) {
      console.error('PWA 정보 가져오기 실패:', error);
      return null;
    }
  };

  // 초기화 - 로컬 스토리지에서 오프라인 큐 복원
  const initialize = () => {
    const savedQueue = loadOfflineData('request_queue');
    if (savedQueue && Array.isArray(savedQueue)) {
      offlineQueue.value = savedQueue;
    }

    // 네트워크 상태 변화 감지
    window.addEventListener('online', () => {
      setOnlineStatus(true);
      processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      setOnlineStatus(false);
    });

    // PWA 설치 프롬프트 감지
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // PWA 설치 완료 감지
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });
  };

  // 스토어 반환
  return {
    // 상태
    isOnline,
    isInstalled,
    isInstallable,
    deferredPrompt,
    updateAvailable,
    offlineQueue,

    // 컴퓨티드
    canInstall,
    networkType,

    // 액션
    setOnlineStatus,
    setDeferredPrompt,
    setUpdateAvailable,
    setInstalled,
    installPWA,
    addToOfflineQueue,
    removeFromOfflineQueue,
    clearOfflineQueue,
    processOfflineQueue,
    fetchPWAInfo,
    initialize,
  };
});
