
import React from 'react';
import type { NarrativeType } from '../types';
import { CalendarIcon, LinkIcon, UsersIcon, PencilSquareIcon } from './Icons';

interface GoalSelectorProps {
  onSelect: (type: NarrativeType) => void;
}

const goals = [
  { type: 'event' as NarrativeType, icon: CalendarIcon, title: 'Pengumuman Acara', description: 'Buat narasi untuk workshop, webinar, atau pertemuan.' },
  { type: 'link' as NarrativeType, icon: LinkIcon, title: 'Berbagi Tautan', description: 'Sebarkan artikel, berita, atau konten menarik lainnya.' },
  { type: 'volunteer' as NarrativeType, icon: UsersIcon, title: 'Panggilan Relawan', description: 'Ajak relawan untuk berpartisipasi dalam suatu kegiatan.' },
  { type: 'general' as NarrativeType, icon: PencilSquareIcon, title: 'Lainnya (Umum)', description: 'Untuk kebutuhan narasi lain yang lebih fleksibel.' },
];

function GoalSelectorComponent({ onSelect }: GoalSelectorProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
        Apa Tujuan Anda Hari Ini?
      </h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
        Pilih salah satu tujuan untuk memulai penyusunan narasi.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.type}
            onClick={() => onSelect(goal.type)}
            className="group text-left p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-ypbb-blue-light/10 dark:bg-ypbb-blue-dark/20 p-3 rounded-lg">
                    <goal.icon className="w-6 h-6 text-ypbb-blue-dark dark:text-ypbb-blue-light" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-ypbb-blue-dark dark:group-hover:text-ypbb-green-light">{goal.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{goal.description}</p>
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const GoalSelector = React.memo(GoalSelectorComponent);
