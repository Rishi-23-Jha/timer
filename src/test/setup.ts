import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs
Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: vi.fn(() => 'test-uuid')
    }
});

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Suppress console errors during testing
vi.spyOn(console, 'error').mockImplementation(() => { });