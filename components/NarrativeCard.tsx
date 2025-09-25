
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';
import type { Narrative } from '../types';

interface NarrativeCardProps {
  narrative: Narrative;
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace error.
// Fix: Removed the unused `index` prop.
export function NarrativeCard({ narrative }: NarrativeCardProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (narrative.content) {
      navigator.clipboard.writeText(narrative.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {narrative.title}
        </h3>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-2 -mr-2 -mt-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-ypbb-blue-dark transition-colors"
          aria-label="Salin narasi"
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 text-green-500" />
          ) : (
            <CopyIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
        {narrative.content}
      </div>
    </div>
  );
}
