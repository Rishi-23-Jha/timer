import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;

  // Title validation
  if (!title.trim()) {
    toast.error('Timer title is required', {
      description: 'Please enter a title for your timer.',
      duration: 3000
    });
    return false;
  }

  if (title.length > 50) {
    toast.error('Title Too Long', {
      description: 'Timer title must be less than 50 characters.',
      duration: 3000
    });
    return false;
  }

  // Time validation
  if (hours < 0 || minutes < 0 || seconds < 0) {
    toast.error('Invalid Time', {
      description: 'Time values cannot be negative.',
      duration: 3000
    });
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    toast.error('Invalid Time Format', {
      description: 'Minutes and seconds must be between 0 and 59.',
      duration: 3000
    });
    return false;
  }

  // Total duration validation
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds === 0) {
    toast.error('Duration Required', {
      description: 'Please set a timer duration greater than 0.',
      duration: 3000
    });
    return false;
  }

  if (totalSeconds > 86400) { // 24 hours max
    toast.error('Duration Limit Exceeded', {
      description: 'Timer cannot exceed 24 hours.',
      duration: 3000
    });
    return false;
  }

  return true;
};

// Additional utility for time input validation
export const sanitizeTimeInput = (value: number, max: number): number => {
  return Math.min(Math.max(0, value), max);
};