'use client';

import React, { useRef } from 'react';
import { Database, Upload, FileCheck, Info, Globe2, Stethoscope, Code2, BookOpen } from 'lucide-react';
import { PRESET_DICTIONARIES, DictionaryPreset } from '@/lib/dictionaries';

interface DictionarySelectorProps {
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onCustomDictionaryLoaded: (name: string, words: string[]) => void;
  totalWords: number;
  isMultilingual: boolean;
}

export const DictionarySelector: React.FC<DictionarySelectorProps> = ({
  currentPresetId,
  onSelectPreset,
  onCustomDictionaryLoaded,
  totalWords,
  isMultilingual,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        let words: string[] = [];
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            words = parsed.map(w => String(w).trim()).filter(Boolean);
          }
        } else {
          // Plain text file: split by newline or whitespace
          words = content
            .split(/[\r\n,]+/)
            .map(w => w.trim())
            .filter(w => w.length > 0);
        }

        if (words.length > 0) {
          onCustomDictionaryLoaded(file.name.replace(/\.[^/.]+$/, ""), words);
        } else {
          alert("No valid words found in the uploaded file.");
        }
      } catch (err) {
        alert("Error parsing uploaded file. Please provide a plain text (.txt) with one word per line or a JSON array (.json).");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'tech-cs':
        return <Code2 className="w-4 h-4 text-cyan-400" />;
      case 'common-english':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'medical':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
      case 'multilingual':
        return <Globe2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Database className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Active Dictionary & Vocabulary</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select a specialized preset or upload your custom wordlist
          </p>
        </div>

        {/* Custom Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-300 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .txt / .json</span>
          </button>
        </div>
      </div>

      {/* Preset Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {PRESET_DICTIONARIES.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5 font-medium text-xs text-slate-200">
                  {getPresetIcon(preset.id)}
                  <span className="truncate">{preset.name}</span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {preset.words.length.toLocaleString()} words
              </span>
            </button>
          );
        })}
      </div>

      {/* Metadata Badges Bar */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Indexed Vocabulary:</span>
            <strong className="text-white font-mono">{totalWords.toLocaleString()}</strong>
          </span>

          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isMultilingual ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
            <span>Unicode Engine:</span>
            <strong className="text-slate-200 font-mono">{isMultilingual ? 'UTF-8 Multilingual' : 'Standard Latin'}</strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Metric Structure: <strong>Burkhard-Keller Metric Tree</strong> (Metric space (S, d))
        </div>
      </div>
    </div>
  );
};
