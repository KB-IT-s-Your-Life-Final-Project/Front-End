/**
 * PWA 관련 유틸리티 함수들
 */

// PWA 설치 가능 여부 확인
export const isPWAInstallable = () => {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
};

// PWA가 이미 설치되었는지 확인
export const isPWAInstalled = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

// 현재 네트워크 상태 확인
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection:
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection,
  };
};

// 서비스 워커 등록 상태 확인
export const getServiceWorkerStatus = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      registered: !!registration,
      active: !!registration?.active,
      waiting: !!registration?.waiting,
    };
  }
  return { registered: false, active: false, waiting: false };
};

// PWA 관련 정보 수집
export const getPWAInfo = async () => {
  const networkStatus = getNetworkStatus();
  const serviceWorkerStatus = await getServiceWorkerStatus();

  return {
    installable: isPWAInstallable(),
    installed: isPWAInstalled(),
    network: networkStatus,
    serviceWorker: serviceWorkerStatus,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
};

// 로컬 스토리지에 오프라인 데이터 저장
export const saveOfflineData = (key, data) => {
  try {
    localStorage.setItem(
      `offline_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return true;
  } catch (error) {
    console.error('오프라인 데이터 저장 실패:', error);
    return false;
  }
};

// 로컬 스토리지에서 오프라인 데이터 불러오기
export const loadOfflineData = (key, maxAge = 24 * 60 * 60 * 1000) => {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    if (!stored) return null;

    const { data, timestamp } = JSON.parse(stored);
    const age = Date.now() - timestamp;

    if (age > maxAge) {
      localStorage.removeItem(`offline_${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('오프라인 데이터 로드 실패:', error);
    return null;
  }
};

// 오프라인 데이터 정리
export const clearOfflineData = (prefix = 'offline_') => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('오프라인 데이터 정리 실패:', error);
    return false;
  }
};

// PWA 설치 가이드 메시지 (브라우저별)
export const getInstallGuide = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome')) {
    return 'Chrome 브라우저 메뉴(⋮) > "홈 화면에 추가"를 선택하세요.';
  } else if (userAgent.includes('firefox')) {
    return 'Firefox 브라우저 메뉴 > "홈 화면에 추가"를 선택하세요.';
  } else if (userAgent.includes('safari')) {
    return 'Safari 공유 버튼 > "홈 화면에 추가"를 선택하세요.';
  } else if (userAgent.includes('edge')) {
    return 'Edge 브라우저 메뉴(⋯) > "앱" > "이 사이트를 앱으로 설치"를 선택하세요.';
  }

  return '브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱으로 설치" 옵션을 찾아보세요.';
};
