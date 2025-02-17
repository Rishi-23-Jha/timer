import { describe, it, expect, vi } from 'vitest';
import { validateTimerForm } from '../utils/validation';

// Mock toast for testing
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn()
    }
}));

describe('validateTimerForm', () => {
    it('should return false for empty title', () => {
        const result = validateTimerForm({
            title: '',
            description: '',
            hours: 0,
            minutes: 0,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return false for title longer than 50 characters', () => {
        const longTitle = 'a'.repeat(51);
        const result = validateTimerForm({
            title: longTitle,
            description: '',
            hours: 0,
            minutes: 0,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return false for negative time values', () => {
        const result = validateTimerForm({
            title: 'Test Timer',
            description: '',
            hours: -1,
            minutes: 0,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return false for minutes > 59', () => {
        const result = validateTimerForm({
            title: 'Test Timer',
            description: '',
            hours: 0,
            minutes: 60,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return false for seconds > 59', () => {
        const result = validateTimerForm({
            title: 'Test Timer',
            description: '',
            hours: 0,
            minutes: 0,
            seconds: 60
        });

        expect(result).toBe(false);
    });

    it('should return false for zero duration', () => {
        const result = validateTimerForm({
            title: 'Test Timer',
            description: '',
            hours: 0,
            minutes: 0,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return false for duration > 24 hours', () => {
        const result = validateTimerForm({
            title: 'Test Timer',
            description: '',
            hours: 25,
            minutes: 0,
            seconds: 0
        });

        expect(result).toBe(false);
    });

    it('should return true for valid timer form', () => {
        const result = validateTimerForm({
            title: 'Valid Timer',
            description: 'Test description',
            hours: 1,
            minutes: 30,
            seconds: 45
        });

        expect(result).toBe(true);
    });
});