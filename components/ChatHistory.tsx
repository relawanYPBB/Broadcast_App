
import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, SparklesIcon, EllipsisHorizontalIcon } from './Icons';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

function ChatHistoryComponent({ messages, isLoading }: ChatHistoryProps): React.ReactElement {
  if (messages.length === 0 && !isLoading) {
    return <></>;
  }

  return (
    <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Revisi & Percakapan
      </h2>
      <div className="space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? '' : ''}`}>
            <div className={`flex-shrink-0 p-2 rounded-full ${
                message.role === 'user' 
                ? 'bg-slate-200 dark:bg-slate-700' 
                : 'bg-ypbb-blue-light/10 dark:bg-ypbb-blue-dark/20'
            }`}>
              {message.role === 'user' ? (
                <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <SparklesIcon className="w-5 h-5 text-ypbb-blue-dark dark:text-ypbb-blue-light" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {message.role === 'user' ? 'Anda' : 'Asisten Narasi'}
              </p>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {message.parts.map((part, i) => (
                    <div key={i} className="whitespace-pre-wrap">{part.text}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 rounded-full bg-ypbb-blue-light/10 dark:bg-ypbb-blue-dark/20">
              <SparklesIcon className="w-5 h-5 text-ypbb-blue-dark dark:text-ypbb-blue-light" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Asisten Narasi
              </p>
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <span>Sedang berpikir</span>
                <EllipsisHorizontalIcon className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const ChatHistory = React.memo(ChatHistoryComponent);
