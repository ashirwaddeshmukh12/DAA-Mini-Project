import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Layers,
  Binary,
  GitFork,
  Sparkles,
  Award
} from 'lucide-react';

export default function HowToUseModal({
  isOpen = false,
  onClose = () => {},
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                How to Use SocialSphere — DAA Teaching Guide & Viva Prep
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Quick 3-step demonstration walkthrough for your college academic presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Step-by-Step Demo Flow */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-900 uppercase font-mono tracking-wide flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Recommended 5-Minute Teacher Presentation Flow</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <strong className="block text-slate-900">Explain the Graph</strong>
                <p className="text-[11px] text-slate-600">
                  Click <strong>Karan</strong> to demonstrate degree centrality (degree = 4). Point out the disconnected group (Vikram, Ananya, Kabir) to explain disconnected components.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <strong className="block text-slate-900">Run Traversal Algorithms</strong>
                <p className="text-[11px] text-slate-600">
                  Switch to <strong>Learn Algorithms</strong> mode. Run <strong>BFS</strong> from Aditi to show the FIFO queue and level-order ripple. Then run <strong>DFS</strong> to show the call stack and backtracking.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <strong className="block text-slate-900">Show Shortest Path & DAA Lab</strong>
                <p className="text-[11px] text-slate-600">
                  Find the shortest path from <strong>Aditi to Neha</strong> (gold path, 4 hops). Then open the <strong>Complexity Lab</strong> to run the empirical benchmark.
                </p>
              </div>
            </div>
          </div>

          {/* Likely Viva Questions */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3">
            <h4 className="font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Common DAA Teacher Viva Questions & Answers</span>
            </h4>

            <div className="space-y-2.5">
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <strong className="text-indigo-900 block mb-0.5">
                  Q1: Why is BFS time complexity O(V + E) instead of O(V²)?
                </strong>
                <span className="text-[11px] text-slate-600">
                  Because we use an <strong>Adjacency List</strong>. Every vertex is enqueued/dequeued once (&Theta;(V)), and we scan each edge from its endpoints, inspecting incident edges a total of 2|E| times. In an adjacency matrix, scanning empty cells would force &Theta;(V&sup2;).
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <strong className="text-indigo-900 block mb-0.5">
                  Q2: Why does BFS guarantee the shortest path in unweighted graphs?
                </strong>
                <span className="text-[11px] text-slate-600">
                  Because edges have uniform weight (w = 1), BFS explores nodes strictly in non-decreasing order of distance from the source. The first time the destination is dequeued, we are mathematically guaranteed that no shorter path exists.
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <strong className="text-indigo-900 block mb-0.5">
                  Q3: What is the Handshaking Lemma shown in this network?
                </strong>
                <span className="text-[11px] text-slate-600">
                  In every undirected graph, the sum of all node degrees is twice the number of edges: &Sigma; deg(v) = 2|E|. In our default network, 11 edges in the main network + 2 in the disconnected group = 13 edges, so total degrees sum to 26.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
}
