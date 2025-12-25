
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type, Content } from '@google/genai';
import { Header } from './components/Header';
import { GoalSelector } from './components/GoalSelector';
import { InputForm } from './components/InputForm';
import { AnalysisCard } from './components/AnalysisCard';
import { NarrativeCard } from './components/NarrativeCard';
import { DataNeededCard } from './components/DataNeededCard';
import { ChatHistory } from './components/ChatHistory';
import { FollowUpInput } from './components/FollowUpInput';
import { YPBB_GUIDE_CONTEXT } from './constants';
import type { NarrativeType, GeneratedOutput, ChatMessage } from './types';
import { DocumentUploadForm } from './components/DocumentUploadForm';
import { InputModeSelector } from './components/InputModeSelector';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: 'Analisis singkat tentang perubahan yang diminta pengguna dan bagaimana perubahan itu diterapkan pada narasi. Ini akan menjadi balasan percakapan.',
    },
    narratives: {
      type: Type.ARRAY,
      description: 'Satu atau lebih variasi narasi yang siap pakai (biasanya 2-3 variasi). Setiap narasi harus memiliki judul dan konten.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Judul yang menarik dan deskriptif untuk narasi. Contoh: "Variasi 1: Lebih Formal", "Variasi 2: Antusias & Ceria".',
          },
          content: {
            type: Type.STRING,
            description: 'Isi narasi lengkap yang dibuat sesuai dengan YPBB_GUIDE_CONTEXT. Harus selalu dimulai dengan sapaan "Sobat Organis" dan mengganti kata ganti orang kedua dengan "Sobat".',
          },
        },
        required: ['title', 'content'],
      },
    },
    dataNeeded: {
      type: Type.ARRAY,
      description: 'Daftar poin-poin informasi yang hilang atau tidak jelas dari input pengguna, yang jika ada akan membuat narasi lebih baik. Jika semua informasi sudah cukup, kembalikan array kosong.',
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['analysis', 'narratives', 'dataNeeded'],
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Gagal mengubah file ke base64."));
      }
    };
    reader.onerror = error => reject(error);
  });
};

function App() {
  const [narrativeType, setNarrativeType] = useState<NarrativeType | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'upload' | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleReset = useCallback(() => {
    setNarrativeType(null);
    setInputMode(null);
    setGeneratedOutput(null);
    setChatHistory([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleInitialSubmit = useCallback(async (userInput: string | { file: File }, type: NarrativeType) => {
    setIsLoading(true);
    setError(null);

    const systemInstruction = `Anda adalah asisten AI yang bertugas membuat narasi untuk grup relawan Yayasan Pengembangan Biosains dan Bioteknologi (YPBB).
Tugas Anda adalah memproses input dari pengguna, menganalisisnya, dan kemudian menghasilkan beberapa variasi narasi yang siap disebarkan.
Anda HARUS SELALU mematuhi panduan komunikasi YPBB yang terlampir.
Pastikan output Anda dalam format JSON yang valid sesuai skema yang diberikan.
Penting: Dalam properti 'content' untuk setiap narasi, formatlah teks dengan jeda baris (newlines) yang sesuai untuk memisahkan paragraf. Ini sangat penting agar narasi mudah dibaca di aplikasi chat.
${YPBB_GUIDE_CONTEXT}`;

    let contents: Content[];

    try {
      if (typeof userInput === 'string') {
        contents = [{ role: 'user', parts: [{ text: userInput }] }];
      } else {
        const file = userInput.file;
        const base64File = await fileToBase64(file);
        
        const filePart = {
          inlineData: {
            mimeType: file.type,
            data: base64File,
          },
        };

        let promptText = '';
        if (type === 'volunteer') {
           promptText = `Dari dokumen terlampir, ekstrak informasi yang relevan (nama kegiatan, tenggat waktu, peran yang dibutuhkan, kriteria, info pendaftaran) dan buat narasi panggilan relawan yang menarik sesuai dengan panduan YPBB. Fokus pada ajakan untuk berkontribusi dan menjadi bagian dari perubahan. Pastikan tenggat waktu pendaftaran disebutkan dengan jelas untuk menciptakan urgensi.`
        } else if (type === 'event') {
           promptText = `Dari dokumen/TOR terlampir, ekstrak informasi kunci seperti nama acara, tanggal, waktu, lokasi/platform, target peserta, dan detail pendaftaran. Kemudian, buat narasi pengumuman acara yang menarik sesuai panduan YPBB. Fokus pada ajakan partisipasi dan jelaskan manfaat atau keunikan acara tersebut.`
        }
  
        const textPart = { text: promptText };
        
        contents = [{ role: 'user', parts: [textPart, filePart] }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      const jsonOutput: GeneratedOutput = JSON.parse(response.text);
      setGeneratedOutput(jsonOutput);
    } catch (e) {
      console.error("Error during initial generation:", e);
      setError('Maaf, terjadi kesalahan saat membuat narasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFollowUpSubmit = useCallback(async (message: string, file?: File) => {
    if (!generatedOutput) return;

    let userDisplayText = message;
    if (file) {
      userDisplayText += `\n[File dilampirkan: ${file.name}]`;
    }

    const newUserMessage: ChatMessage = { role: 'user' as const, parts: [{ text: userDisplayText }] };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsLoading(true);
    setError(null);
    
    // Create a robust revision prompt that includes the current state
    const revisionPrompt = `
      STATUS NARASI SAAT INI (JSON):
      ${JSON.stringify(generatedOutput)}

      PERMINTAAN REVISI BARU: "${message}"

      ${file ? 'PENGGUNA MELAMPIRKAN DOKUMEN TAMBAHAN: Gunakan informasi dalam file ini untuk memperkaya narasi.' : ''}

      INSTRUKSI:
      1. Tinjau permintaan revisi dan dokumen (jika ada).
      2. Perbarui seluruh objek JSON narasi agar mencerminkan perubahan tersebut.
      3. Pastikan gaya bahasa tetap mengikuti panduan YPBB (Sobat Organis, Sobat).
      4. Dalam field 'analysis', jelaskan secara singkat alasan perubahan yang Anda buat berdasarkan permintaan pengguna.
      5. Kembalikan HANYA objek JSON yang valid.
    `;

    const systemInstruction = `Anda adalah asisten AI yang bertugas merevisi narasi untuk grup relawan YPBB. 
      Penting untuk diingat bahwa Anda berada dalam sebuah percakapan berkelanjutan. Gunakan riwayat pesan sebelumnya untuk menjaga konteks dan konsistensi.
      Pastikan output Anda dalam format JSON yang valid sesuai skema yang diberikan.
      Penting: Gunakan '\\n' untuk jeda baris di dalam teks konten agar format paragraf terjaga.
      ${YPBB_GUIDE_CONTEXT}`;

    try {
      // Build parts for the latest message
      const latestUserParts: any[] = [{ text: revisionPrompt }];
      if (file) {
        const base64File = await fileToBase64(file);
        latestUserParts.push({
          inlineData: {
            mimeType: file.type,
            data: base64File,
          },
        });
      }

      // Construct the full context including previous chat history to improve memory
      const contents: Content[] = [
        ...chatHistory.map(msg => ({
          role: msg.role,
          parts: msg.parts.map(p => ({ text: p.text }))
        })),
        { role: 'user', parts: latestUserParts }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      
      const newJsonOutput: GeneratedOutput = JSON.parse(response.text);
      setGeneratedOutput(newJsonOutput);

      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: newJsonOutput.analysis }] };
      setChatHistory([...updatedHistory, modelMessage]);

    } catch (e) {
        console.error("Error during revision:", e);
        const errorMessage = 'Maaf, terjadi kesalahan saat merevisi narasi. Silakan coba lagi.';
        setError(errorMessage);
        const modelErrorMessage: ChatMessage = { role: 'model', parts: [{ text: errorMessage }] };
        setChatHistory([...updatedHistory, modelErrorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [generatedOutput, chatHistory]);

  const cancelNarrativeType = useCallback(() => setNarrativeType(null), []);
  const cancelInputMode = useCallback(() => setInputMode(null), []);

  const renderContent = () => {
    if (isLoading && !generatedOutput && chatHistory.length === 0) {
      return (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ypbb-blue-dark mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Asisten sedang bekerja, mohon tunggu...</p>
        </div>
      );
    }

    if (error && !generatedOutput) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Terjadi Kesalahan</p>
                <p>{error}</p>
                <button onClick={handleReset} className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Coba Lagi
                </button>
            </div>
        )
    }

    if (generatedOutput) {
      return (
        <div className="space-y-6">
          <AnalysisCard analysisText={generatedOutput.analysis} />
          {generatedOutput.narratives.map((narrative, index) => (
            <div key={index}>
              <NarrativeCard narrative={narrative} />
            </div>
          ))}
          {generatedOutput.dataNeeded.length > 0 && (
            <DataNeededCard items={generatedOutput.dataNeeded} />
          )}
          <ChatHistory messages={chatHistory} isLoading={isLoading} />
          <FollowUpInput onSubmit={handleFollowUpSubmit} isLoading={isLoading} />
           <div className="text-center mt-8">
                <button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md">
                    Buat Narasi Baru
                </button>
            </div>
        </div>
      );
    }
    
    if (narrativeType === 'event' || narrativeType === 'volunteer') {
      if (inputMode === 'upload') {
        return (
          <DocumentUploadForm
            onSubmit={(file) => handleInitialSubmit({ file }, narrativeType)}
            onCancel={cancelInputMode}
            isLoading={isLoading}
          />
        );
      }
      if (inputMode === 'manual') {
        return (
          <InputForm
            narrativeType={narrativeType}
            onSubmit={(prompt) => handleInitialSubmit(prompt, narrativeType)}
            onCancel={cancelInputMode}
            isLoading={isLoading}
          />
        );
      }
      return (
        <InputModeSelector
          narrativeType={narrativeType}
          onSelectMode={setInputMode}
          onCancel={cancelNarrativeType}
        />
      );
    }


    if (narrativeType) {
      return (
        <InputForm
          narrativeType={narrativeType}
          onSubmit={(prompt) => handleInitialSubmit(prompt, narrativeType)}
          onCancel={cancelNarrativeType}
          isLoading={isLoading}
        />
      );
    }

    return <GoalSelector onSelect={setNarrativeType} />;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <Header />
        <div className="mt-8 sm:mt-12">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
