
import React from 'react';
import { WarningIcon } from './Icons';

interface DataNeededCardProps {
  items: string[];
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace error.
export function DataNeededCard({ items }: DataNeededCardProps): React.ReactElement {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl shadow-md overflow-hidden p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
            <div className="p-3 bg-amber-500/10 rounded-full">
                <WarningIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">
            ❑ Butuh Data
          </h2>
          <ul className="list-disc list-inside space-y-2 text-amber-700 dark:text-amber-300">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
