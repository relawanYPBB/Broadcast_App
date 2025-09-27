
import React, { useState } from 'react';

interface FollowUpInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

function FollowUpInputComponent({ onSubmit, isLoading }: FollowUpInputProps): React.ReactElement {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Minta revisi atau ajukan pertanyaan (Contoh: Buat variasi 1 lebih antusias)..."
          disabled={isLoading}
          className="w-full pl-4 pr-24 py-3 border border-slate-300 rounded-full dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-ypbb-blue-light focus:border-ypbb-blue-light"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4 m-1.5 font-semibold text-white bg-ypbb-blue-dark rounded-full hover:bg-ypbb-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ypbb-blue-dark disabled:bg-slate-400"
        >
          {isLoading ? '...' : 'Kirim'}
        </button>
      </form>
    </div>
  );
}

export const FollowUpInput = React.memo(FollowUpInputComponent);
