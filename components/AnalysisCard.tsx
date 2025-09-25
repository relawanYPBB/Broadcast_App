
import React from 'react';
import { DocumentTextIcon } from './Icons';

interface AnalysisCardProps {
  analysisText: string;
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace error.
export function AnalysisCard({ analysisText }: AnalysisCardProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-ypbb-blue-light/10 dark:bg-ypbb-blue-dark/20 rounded-full">
            <DocumentTextIcon className="w-6 h-6 text-ypbb-blue-dark dark:text-ypbb-blue-light" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Analisis Sumber & Konteks
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {analysisText}
          </p>
        </div>
      </div>
    </div>
  );
}
