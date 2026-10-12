'use client';

import React from 'react';
import { X, GraduationCap, Award, Users, BookMarked, CheckCircle2 } from 'lucide-react';

interface AbstractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AbstractModal: React.FC<AbstractModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* University Header Banner */}
        <div className="border-b border-slate-800 pb-5 mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-700/50 text-xs font-mono mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>KLH (DEEMED TO BE UNIVERSITY) • BACHUPALLY, HYDERABAD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Fuzzy Search System Using Edit Distance Algorithm
          </h2>
          <p className="text-sm text-cyan-400/90 font-mono mt-1">
            Data Structures and Algorithms - 3 (Course Code: 25CS2103E) • A.Y. 2026–2027
          </p>
        </div>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Project Team (Team #2 • Section 4)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex justify-between items-center bg-slate-900/80 px-2.5 py-1.5 rounded">
                <span className="font-semibold text-white">CharanTej Reddy</span>
                <span className="text-cyan-400">2520030422</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/80 px-2.5 py-1.5 rounded">
                <span>Chandrakanth Reddy</span>
                <span className="text-cyan-400">2520030290</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/80 px-2.5 py-1.5 rounded">
                <span>Teja</span>
                <span className="text-cyan-400">2520030379</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Faculty Mentorship</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <p className="font-semibold text-white text-sm">Mrs. J. Yamini Devi</p>
              <p className="text-slate-400">Assistant Professor, Department of Computer Science</p>
              <p className="text-slate-400">KLH (Deemed to be University), Bachupally Campus</p>
              <p className="text-emerald-400/90 font-mono pt-1 text-[11px]">Hyderabad - 500090, Telangana, India</p>
            </div>
          </div>
        </div>

        {/* Abstract Official Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
            <BookMarked className="w-4 h-4" />
            <span>Abstract</span>
          </div>

          <p>
            The <strong className="text-white">Fuzzy Search System Using Edit Distance Algorithm</strong> is engineered to
            retrieve relevant, high-precision keyword suggestions even when users provide
            misspelled or syntactically erroneous search queries. Traditional exact-string
            pattern matchers fail in the presence of typographical slips, character omissions,
            or phonetic mistakes.
          </p>

          <p>
            The proposed system addresses this challenge by implementing Edit
            Distance metrics—primarily the <strong className="text-cyan-300">Levenshtein Distance algorithm</strong> optimized via
            Dynamic Programming and specialized metric tree indexing structures such as the
            <strong className="text-cyan-300"> Burkhard-Keller Tree (BK-Tree)</strong>. By utilizing metric pruning derived from the
            triangle inequality, the system eliminates the vast majority of non-candidate
            vocabulary nodes, bypassing expensive exhaustive searches.
          </p>

          <p>
            Each candidate word retrieved from the dictionary is evaluated and
            assigned a normalized similarity score based on edit operation penalties
            (insertions, deletions, and substitutions) and string length. The system ranks
            candidate matches dynamically to present the most relevant terms at the top of
            the suggestion list. To ensure production-grade scalability, the architecture
            seamlessly handles large-scale dictionaries and provides comprehensive Unicode
            support for multilingual vocabularies, diacritic variations, and multi-script
            datasets.
          </p>

          <p>
            The system achieves sub-millisecond query response times while
            significantly enhancing user search experience across e-commerce catalogs,
            medical record lookups, command palettes, and auto-correct information
            retrieval systems.
          </p>
        </div>

        {/* Key Competencies Bullet Badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>O(m×n) DP Levenshtein</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Metric BK-Tree Index</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>Triangle Pruning</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>UTF-8 Multilingual</span>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <span>Project Abstract Submission • Academic Year 2026–2027</span>
          <button
            onClick={onClose}
            className="mt-3 sm:mt-0 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
          >
            Close Abstract
          </button>
        </div>
      </div>
    </div>
  );
};
