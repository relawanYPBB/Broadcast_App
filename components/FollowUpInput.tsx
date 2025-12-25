
import React, { useState, useRef } from 'react';
import { PaperClipIcon, XCircleIcon } from './Icons';

interface FollowUpInputProps {
  onSubmit: (message: string, file?: File) => void;
  isLoading: boolean;
}

function FollowUpInputComponent({ onSubmit, isLoading }: FollowUpInputProps): React.ReactElement {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || file) && !isLoading) {
      onSubmit(input, file || undefined);
      setInput('');
      removeFile();
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="relative">
        {/* File Preview */}
        {file && (
          <div className="mb-2 flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg w-fit">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
              {file.name}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-2 focus-within:ring-2 focus-within:ring-ypbb-blue-light focus-within:border-ypbb-blue-light shadow-sm">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={triggerFileUpload}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-ypbb-blue-dark dark:hover:text-ypbb-green-light transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Lampirkan file"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt,.png,.jpg"
          />

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            placeholder="Minta revisi atau ajukan pertanyaan (Tekan Enter untuk baris baru)..."
            disabled={isLoading}
            rows={1}
            className="w-full py-2 max-h-32 bg-transparent border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
            style={{ minHeight: '44px' }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !file)}
            className="mb-1 px-4 py-2 text-sm font-semibold text-white bg-ypbb-blue-dark rounded-lg hover:bg-ypbb-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ypbb-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '...' : 'Kirim'}
          </button>
        </div>
      </form>
    </div>
  );
}

export const FollowUpInput = React.memo(FollowUpInputComponent);
