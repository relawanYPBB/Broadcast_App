
import React, { useState, useCallback, useRef } from 'react';
import { ArrowUpTrayIcon, DocumentTextIcon, XCircleIcon } from './Icons';

interface DocumentUploadFormProps {
    onSubmit: (file: File) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const SUPPORTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/png', 'image/jpeg'];
const SUPPORTED_EXTENSIONS = ".pdf, .docx, .txt, .png, .jpg";

function DocumentUploadFormComponent({ onSubmit, onCancel, isLoading }: DocumentUploadFormProps): React.ReactElement {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((selectedFile: File | undefined) => {
        if (selectedFile) {
            if (SUPPORTED_TYPES.includes(selectedFile.type)) {
                setFile(selectedFile);
                setError(null);
            } else {
                setFile(null);
                setError(`Format file tidak didukung. Harap gunakan: ${SUPPORTED_EXTENSIONS}`);
            }
        }
    }, []);
    
    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFileSelect(event.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    };

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            handleFileSelect(event.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file && !isLoading) {
            onSubmit(file);
        }
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Unggah Dokumen</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Biarkan AI memproses detail dari file Anda.</p>
            
            {!file && (
              <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ypbb-blue-light transition-colors ${isDragOver ? 'border-ypbb-blue-dark bg-ypbb-blue-light/10' : 'border-gray-300 dark:border-slate-600'}`}
              >
                  <input ref={fileInputRef} type="file" id="file-upload" className="sr-only" onChange={onFileChange} accept={SUPPORTED_EXTENSIONS} />
                  <label htmlFor="file-upload" className="cursor-pointer">
                      <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-slate-800 dark:text-slate-200">
                          Tarik & Lepas file di sini
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">atau klik untuk memilih</span>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, TXT, PNG, JPG</p>
                  </label>
              </div>
            )}

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {file && (
                <div className="mt-4 flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                        <XCircleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <span className="sr-only">Hapus file</span>
                    </button>
                </div>
            )}
            
            <div className="flex items-center justify-end mt-8 space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                >
                    Ganti Cara
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !file}
                    className="px-6 py-2 font-semibold text-white bg-ypbb-blue-dark rounded-md hover:bg-ypbb-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ypbb-blue-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Memproses...' : 'Buat Narasi'}
                </button>
            </div>
          </form>
        </div>
    );
}

export const DocumentUploadForm = React.memo(DocumentUploadFormComponent);
