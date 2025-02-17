import React from 'react';

interface ModalButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel?: string;
}

export const ModalButtons: React.FC<ModalButtonsProps> = ({
    onCancel,
    onSubmit,
    submitLabel = 'Submit',
}) => (
    <div className="flex justify-end gap-2 mt-4">
        <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
            Cancel
        </button>
        <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            {submitLabel}
        </button>
    </div>
);