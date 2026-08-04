import '@testing-library/jest-dom';

// Mock ResizeObserver for @xyflow/react
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
