
import React, { useState } from 'react';
import type { NarrativeType } from '../types';

interface InputFormProps {
  narrativeType: NarrativeType;
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea';
  optional?: boolean;
}

interface FormFields {
  [key: string]: string;
}

const formConfig: { [key in NarrativeType]: { title: string; fields: FormFieldConfig[]; promptTemplate: (data: FormFields) => string } } = {
  event: {
    title: 'Pengumuman Acara',
    fields: [
      { name: 'eventName', label: 'Nama Acara', placeholder: 'Contoh: Volunteer Summit 2025' },
      { name: 'dateTime', label: 'Tanggal & Waktu', placeholder: 'Contoh: 16 Februari 2025' },
      { name: 'location', label: 'Lokasi / Platform', placeholder: 'Contoh: Fleksibel / Hybrid' },
      { name: 'registrationLink', label: 'Link Pendaftaran / Kontak', placeholder: 'Link Google Form atau narahubung' },
      { name: 'description', label: 'Deskripsi Singkat', placeholder: 'Jelaskan secara singkat tentang acara ini', type: 'textarea' },
    ],
    promptTemplate: (data: FormFields) => `
      Buat narasi pengumuman acara dengan detail berikut:
      - Nama Acara: ${data.eventName}
      - Waktu: ${data.dateTime}
      - Lokasi: ${data.location}
      - Pendaftaran: ${data.registrationLink}
      - Deskripsi: ${data.description}
      Pastikan ada ajakan untuk mendaftar atau hadir.
    `,
  },
  link: {
    title: 'Berbagi Tautan',
    fields: [
      { name: 'url', label: 'URL / Tautan', placeholder: 'https://contoh.com/artikel-menarik' },
      { name: 'summary', label: 'Ringkasan / Poin Menarik', placeholder: 'Kenapa tautan ini penting? Apa poin utamanya?', type: 'textarea' },
      { name: 'source', label: 'Sumber', placeholder: 'Contoh: National Geographic, The Guardian' },
    ],
    promptTemplate: (data: FormFields) => `
      Buat narasi untuk berbagi tautan dengan detail berikut:
      - URL: ${data.url}
      - Ringkasan/Poin Menarik: ${data.summary}
      - Sumber: ${data.source}
      Tujuannya adalah untuk mendorong relawan membaca atau melihat konten di tautan tersebut.
    `,
  },
  volunteer: {
    title: 'Panggilan Relawan',
    fields: [
      { name: 'activityName', label: 'Nama Kegiatan', placeholder: 'Contoh: Volunteer Summit 2025' },
      { name: 'deadline', label: 'Deadline Pendaftaran', placeholder: 'Contoh: 12 Februari 2025' },
      { name: 'rolesNeeded', label: 'Peran Relawan yang Dibutuhkan', placeholder: 'Contoh: Relawan Logistik, Dokumentasi, Komunikasi' },
      { name: 'criteria', label: 'Kriteria Utama Relawan', placeholder: 'Contoh: Semangat berkontribusi, komunikatif, bisa bekerja dalam tim', type: 'textarea' },
      { name: 'registrationLink', label: 'Link Pendaftaran / Narahubung', placeholder: 'Link Google Form atau kontak person' },
      { name: 'description', label: 'Deskripsi Tambahan (Opsional)', placeholder: 'Jelaskan lebih lanjut tentang acara atau tugasnya', type: 'textarea', optional: true },
    ],
    promptTemplate: (data: FormFields) => `
      Buat narasi panggilan relawan untuk kegiatan berikut:
      - Nama Kegiatan: ${data.activityName}
      - Deadline Pendaftaran: ${data.deadline}
      - Peran yang Dibutuhkan: ${data.rolesNeeded}
      - Kriteria Utama: ${data.criteria}
      - Info Pendaftaran: ${data.registrationLink}
      - Deskripsi Tambahan: ${data.description}
      Fokus pada ajakan untuk berkontribusi dan menjadi bagian dari perubahan. Pastikan deadline pendaftaran disebutkan dengan jelas untuk menciptakan urgensi.
    `,
  },
  general: {
    title: 'Umum',
    fields: [
      { name: 'context', label: 'Konteks / Sumber Informasi', placeholder: 'Salin-tempel teks, poin-poin, atau ide utama di sini', type: 'textarea' },
      { name: 'goal', label: 'Tujuan Narasi', placeholder: 'Contoh: Mengedukasi tentang pentingnya kompos, Mengajak donasi' },
    ],
    promptTemplate: (data: FormFields) => `
      Buat narasi umum berdasarkan informasi berikut:
      - Konteks/Sumber: ${data.context}
      - Tujuan Narasi: ${data.goal}
      Pastikan narasi yang dihasilkan sesuai dengan tujuan yang ditetapkan.
    `,
  },
};

export function InputForm({ narrativeType, onSubmit, onCancel, isLoading }: InputFormProps): React.ReactElement {
  const config = formConfig[narrativeType];
  const initialFields = config.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [fields, setFields] = useState<FormFields>(initialFields);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = config.promptTemplate(fields);
    onSubmit(prompt);
  };
  
  const isFormValid = config.fields.every(field => {
    if (field.optional) {
      return true;
    }
    return fields[field.name]?.trim() !== '';
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{config.title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Lengkapi detail di bawah ini untuk membuat narasi.</p>
        <div className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={fields[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={field.name === 'description' ? 3 : 4}
                  className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-ypbb-blue-light focus:border-ypbb-blue-light"
                  required={!field.optional}
                />
              ) : (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={fields[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-ypbb-blue-light focus:border-ypbb-blue-light"
                  required={!field.optional}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end mt-8 space-x-4">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
                Ganti Tujuan
            </button>
            <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="px-6 py-2 font-semibold text-white bg-ypbb-blue-dark rounded-md hover:bg-ypbb-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ypbb-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Memproses...' : 'Buat Narasi'}
            </button>
        </div>
      </form>
    </div>
  );
}
