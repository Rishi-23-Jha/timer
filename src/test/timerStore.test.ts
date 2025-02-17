import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import timerReducer, {
    addTimer,
    deleteTimer,
    toggleTimer,
    updateTimers,
    restartTimer,
    editTimer
} from '../store/useTimerStore';

describe('Timer Store', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        localStorage.clear();
        store = configureStore({
            reducer: timerReducer,
        });
    });

    it('should add a timer', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 300,
            isRunning: false
        };

        store.dispatch(addTimer(timerData));
        const state = store.getState();

        expect(state.timers).toHaveLength(1);
        expect(state.timers[0].title).toBe('Test Timer');
        expect(state.timers[0].id).toBeDefined();
    });

    it('should delete a timer', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 300,
            isRunning: false
        };

        store.dispatch(addTimer(timerData));
        const timerId = store.getState().timers[0].id;

        store.dispatch(deleteTimer(timerId));
        const state = store.getState();

        expect(state.timers).toHaveLength(0);
    });

    it('should toggle timer running state', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 300,
            isRunning: false
        };

        store.dispatch(addTimer(timerData));
        const timerId = store.getState().timers[0].id;

        store.dispatch(toggleTimer(timerId));
        let state = store.getState();
        expect(state.timers[0].isRunning).toBe(true);

        store.dispatch(toggleTimer(timerId));
        state = store.getState();
        expect(state.timers[0].isRunning).toBe(false);
    });

    it('should update timers and reduce remaining time', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 300,
            isRunning: true
        };

        store.dispatch(addTimer(timerData));
        store.dispatch(updateTimers());

        const state = store.getState();
        expect(state.timers[0].remainingTime).toBe(299);
    });

    it('should restart timer', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 100,
            isRunning: false
        };

        store.dispatch(addTimer(timerData));
        const timerId = store.getState().timers[0].id;

        store.dispatch(restartTimer(timerId));
        const state = store.getState();

        expect(state.timers[0].remainingTime).toBe(300);
        expect(state.timers[0].isRunning).toBe(false);
    });

    it('should edit timer', () => {
        const timerData = {
            title: 'Test Timer',
            description: 'Test Description',
            duration: 300,
            remainingTime: 300,
            isRunning: false
        };

        store.dispatch(addTimer(timerData));
        const timerId = store.getState().timers[0].id;

        store.dispatch(editTimer({
            id: timerId,
            updates: {
                title: 'Updated Timer',
                duration: 600
            }
        }));

        const state = store.getState();
        expect(state.timers[0].title).toBe('Updated Timer');
        expect(state.timers[0].duration).toBe(600);
        expect(state.timers[0].remainingTime).toBe(600);
    });
});