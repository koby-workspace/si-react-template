function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Mock API가 사용하는 브라우저 저장소입니다.
 * 화면은 이 구현을 직접 참조하지 않고 feature별 API 모듈만 호출합니다.
 */
export function createLocalStorageStore({ key, version, initialData }) {
  let memoryData = clone(initialData);

  function read() {
    if (typeof window === "undefined") return clone(memoryData);

    try {
      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) return clone(initialData);

      const storedValue = JSON.parse(rawValue);
      if (storedValue.version !== version || !Array.isArray(storedValue.data)) {
        return clone(initialData);
      }

      memoryData = storedValue.data;
      return clone(memoryData);
    } catch {
      return clone(memoryData);
    }
  }

  function write(data) {
    memoryData = clone(data);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          key,
          JSON.stringify({ version, data: memoryData }),
        );
      } catch {
        // 저장 공간 부족이나 브라우저 정책으로 저장할 수 없으면 메모리로 동작합니다.
      }
    }

    return clone(memoryData);
  }

  function reset() {
    return write(initialData);
  }

  return { read, write, reset };
}
