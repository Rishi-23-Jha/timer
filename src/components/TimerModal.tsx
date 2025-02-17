import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { validateTimerForm, TimerFormData } from '../utils/validation';
import { Timer } from '../types/timer';

interface TimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingTimer?: Timer;
}

export const TimerModal: React.FC<TimerModalProps> = ({
    isOpen,
    onClose,
    existingTimer
}) => {
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    // Validation state
    const [touched, setTouched] = useState({
        title: false,
        hours: false,
        minutes: false,
        seconds: false
    });

    // Store methods
    const { addTimer, editTimer } = useTimerStore();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen && existingTimer) {
            // Populate form for editing
            setTitle(existingTimer.title);
            setDescription(existingTimer.description);

            const totalSeconds = existingTimer.duration;
            setHours(Math.floor(totalSeconds / 3600));
            setMinutes(Math.floor((totalSeconds % 3600) / 60));
            setSeconds(totalSeconds % 60);

            setTouched({
                title: false,
                hours: false,
                minutes: false,
                seconds: false
            });
        } else if (isOpen) {
            // Reset for new timer
            setTitle('');
            setDescription('');
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setTouched({
                title: false,
                hours: false,
                minutes: false,
                seconds: false
            });
        }
    }, [isOpen, existingTimer]);

    // Validation checks
    const isTitleValid = title.trim().length > 0 && title.length <= 50;
    const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare form data for validation
        const formData: TimerFormData = {
            title,
            description,
            hours,
            minutes,
            seconds
        };

        // Validate form
        if (!validateTimerForm(formData)) {
            // Validation failed, mark all fields as touched
            setTouched({
                title: true,
                hours: true,
                minutes: true,
                seconds: true
            });
            return;
        }

        // Calculate total seconds
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Determine if editing or adding
        if (existingTimer) {
            editTimer(existingTimer.id, {
                title: title.trim(),
                description: description.trim(),
                duration: totalSeconds
            });
        } else {
            addTimer({
                title: title.trim(),
                description: description.trim(),
                duration: totalSeconds,
                remainingTime: totalSeconds,
                isRunning: false
            });
        }

        // Close modal
        onClose();
    };

    // Don't render if modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">
                            {existingTimer ? 'Edit Timer' : 'Add New Timer'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                            maxLength={50}
                            placeholder="Enter timer title"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${touched.title && !isTitleValid
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                }`}
                        />
                        {touched.title && !isTitleValid && (
                            <p className="mt-1 text-sm text-red-500">
                                Title is required and must be less than 50 characters
                            </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {title.length}/50 characters
                        </p>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Enter timer description (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Duration Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Hours</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={hours}
                                    onChange={(e) => setHours(Math.min(23, parseInt(e.target.value) || 0))}
                                    onBlur={() => setTouched(prev => ({ ...prev, hours: true }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Math.min(59, parseInt(e.target.value) || 0))}
                                    onBlur={() => setTouched(prev => ({ ...prev, minutes: true }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={seconds}
                                    onChange={(e) => setSeconds(Math.min(59, parseInt(e.target.value) || 0))}
                                    onBlur={() => setTouched(prev => ({ ...prev, seconds: true }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {touched.hours && touched.minutes && touched.seconds && !isTimeValid && (
                            <p className="mt-2 text-sm text-red-500">
                                Please set a duration greater than 0
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isTitleValid && isTimeValid
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-blue-400 cursor-not-allowed'
                                }`}
                            disabled={!isTitleValid || !isTimeValid}
                        >
                            {existingTimer ? 'Save Changes' : 'Add Timer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};