import React from 'react';
import { TimerModal } from './TimerModal';
import { useTimerStore } from '../store/useTimerStore';

interface AddTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTimerModal: React.FC<AddTimerModalProps> = ({ isOpen, onClose }) => {
  const { addTimer } = useTimerStore();

  return (
    <TimerModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={addTimer}
    />
  );
};