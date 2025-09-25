import React from 'react';
import { InfoIcon } from './Icons';

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace error.
export function Header(): React.ReactElement {
  return (
    <header className="text-center">
      <div className="inline-block bg-ypbb-blue-dark p-3 rounded-full mb-4 shadow-lg">
        <InfoIcon className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ypbb-blue-dark dark:text-ypbb-green-light">
        Asisten Narasi YPBB
      </h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
        Penyusun Narasi Cerdas untuk Grup Relawan
      </p>
    </header>
  );
}
