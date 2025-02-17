import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

// Load timers from localStorage with error handling
const loadTimers = (): Timer[] => {
  try {
    const savedTimers = localStorage.getItem('timers');
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers);
      // Ensure all required fields are present
      return parsedTimers.map((timer: Timer) => ({
        ...timer,
        isRunning: timer.isRunning ?? false,
        remainingTime: timer.remainingTime ?? timer.duration
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading timers from localStorage:', error);
    return [];
  }
};

// Save timers to localStorage with error handling
const saveTimers = (timers: Timer[]) => {
  try {
    localStorage.setItem('timers', JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers to localStorage:', error);
  }
};

const initialState = {
  timers: loadTimers(),
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action: PayloadAction<Omit<Timer, 'id' | 'createdAt'>>) => {
      const newTimer: Timer = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      saveTimers(state.timers);
    },
    deleteTimer: (state, action: PayloadAction<string>) => {
      state.timers = state.timers.filter((timer) => timer.id !== action.payload);
      saveTimers(state.timers);
    },
    toggleTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
      saveTimers(state.timers);
    },
    updateTimers: (state) => {
      let hasChanges = false;

      state.timers = state.timers.map((timer) => {
        if (timer.isRunning && timer.remainingTime > 0) {
          hasChanges = true;
          return {
            ...timer,
            remainingTime: timer.remainingTime - 1,
            isRunning: timer.remainingTime > 1
          };
        }
        return timer;
      });

      if (hasChanges) {
        saveTimers(state.timers);
      }
    },
    restartTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
      saveTimers(state.timers);
    },
    editTimer: (state, action: PayloadAction<{
      id: string,
      updates: Partial<Omit<Timer, 'id' | 'createdAt'>>
    }>) => {
      const { id, updates } = action.payload;
      const timerIndex = state.timers.findIndex((timer) => timer.id === id);

      if (timerIndex !== -1) {
        state.timers[timerIndex] = {
          ...state.timers[timerIndex],
          ...updates,
          remainingTime: updates.duration ?? state.timers[timerIndex].duration,
          isRunning: false
        };
        saveTimers(state.timers);
      }
    },
    // New method for batch operations
    pauseAllTimers: (state) => {
      state.timers = state.timers.map(timer => ({
        ...timer,
        isRunning: false
      }));
      saveTimers(state.timers);
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimers,
  restartTimer,
  editTimer,
  pauseAllTimers
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimers: () => dispatch(updateTimers()),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
    pauseAllTimers: () => dispatch(pauseAllTimers()),

    // Utility methods
    getActiveTimersCount: () => timers.filter(timer => timer.isRunning).length,
    getTotalRemainingTime: () => timers.reduce((total, timer) => total + timer.remainingTime, 0)
  };
};