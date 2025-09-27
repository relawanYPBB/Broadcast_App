
import React from 'react';
import { PencilSquareIcon, ArrowUpTrayIcon } from './Icons';
import type { NarrativeType } from '../types';

interface InputModeSelectorProps {
  onSelectMode: (mode: 'manual' | 'upload') => void;
  onCancel: () => void;
  narrativeType: 'event' | 'volunteer';
}

const contentMap = {
    event: {
        title: 'Buat Pengumuman Acara',
        manualDescription: 'Lengkapi kolom informasi acara satu per satu.',
        uploadTitle: 'Unggah TOR/Dokumen',
        uploadDescription: 'Biarkan AI memproses dari file TOR (.pdf, .docx, .txt).',
    },
    volunteer: {
        title: 'Buat Panggilan Relawan',
        manualDescription: 'Lengkapi kolom informasi satu per satu.',
        uploadTitle: 'Unggah Dokumen',
        uploadDescription: 'Biarkan AI memproses dari file (.pdf, .docx, .txt).',
    }
};

function InputModeSelectorComponent({ onSelectMode, onCancel, narrativeType }: InputModeSelectorProps): React.ReactElement {
  const content = contentMap[narrativeType];

  const options = [
    { mode: 'manual' as const, icon: PencilSquareIcon, title: 'Isi Formulir Manual', description: content.manualDescription },
    { mode: 'upload' as const, icon: ArrowUpTrayIcon, title: content.uploadTitle, description: content.uploadDescription },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
        {content.title}
      </h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
        Pilih cara Anda ingin menyediakan informasi.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.mode}
            onClick={() => onSelectMode(option.mode)}
            className="group text-left p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:border-slate-700 transition-all duration-200 h-full"
          >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-ypbb-blue-light/10 dark:bg-ypbb-blue-dark/20 p-3 rounded-lg">
                    <option.icon className="w-6 h-6 text-ypbb-blue-dark dark:text-ypbb-blue-light" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-ypbb-blue-dark dark:group-hover:text-ypbb-green-light">{option.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{option.description}</p>
                </div>
            </div>
          </button>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
        >
          Kembali ke Tujuan Utama
        </button>
      </div>
    </div>
  );
}

export const InputModeSelector = React.memo(InputModeSelectorComponent);
