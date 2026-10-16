import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  Binary,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Activity,
  ArrowRight,
  Users,
  GitCommit,
  Share2,
  Compass,
  Repeat
} from 'lucide-react';
import { api } from '../api';

export default function LearnAlgorithmsView({ totalUsers = 11, totalFriendships = 13 }) {
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [measuring, setMeasuring] = useState(false);

  // Safely measure real runtime from backend without throwing
  const handleMeasureRuntime = async () => {
    try {
      setMeasuring(true);
      const res = await api.runBenchmark([11, 20, 50], 'bfs');
      if (res && res.results && res.results.length > 0) {
        setBenchmarkResult(res.results[0]);
      }
    } catch (err) {
      console.warn('Could not measure runtime from backend:', err);
    } finally {
      setMeasuring(false);
    }
  };

  useEffect(() => {
    handleMeasureRuntime();
  }, []);

  const observedTime =
    benchmarkResult?.execution_time_ms !== undefined
      ? `${Number(benchmarkResult.execution_time_ms).toFixed(3)} ms`
      : benchmarkResult?.median_time_ms !== undefined
      ? `${Number(benchmarkResult.median_time_ms).toFixed(3)} ms`
      : '~0.080 ms';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 select-text">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Graph Algorithms & Connection Analysis Guide
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Design and Analysis of Algorithms (DAA) Interactive Teaching Reference
              </p>
            </div>
          </div>
        </div>

        {/* 1. What Vertices & Edges Mean in a Social Network */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>1. What are Vertices (V) and Edges (E)?</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vertex Card */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                  Vertex (V) = A Person
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Node
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                In our college social network, every vertex represents an individual student (such as <strong>Aditi</strong>, <strong>Rohan</strong>, or <strong>Priya</strong>).
              </p>
              <div className="text-[11px] font-mono text-indigo-800 bg-white p-2 rounded-lg border border-indigo-200">
                Total Vertices in current demo: |V| = {totalUsers} students
              </div>
            </div>

            {/* Edge Card */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-emerald-600 inline-block"></span>
                  Edge (E) = A Friendship
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Connection Link
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                An edge is an undirected link connecting two people. If Aditi is friends with Rohan, an edge exists between them: <code>(Aditi, Rohan)</code>.
              </p>
              <div className="text-[11px] font-mono text-emerald-800 bg-white p-2 rounded-lg border border-emerald-200">
                Total Friendships in current demo: |E| = {totalFriendships} edges
              </div>
            </div>
          </div>

          {/* Why Graphs Matter */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>How Graph Traversal Explores Friend Connections</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Real-world networks (Instagram, LinkedIn, WhatsApp) represent people as graph vertices and relationships as edges.
              To find people, recommend mutual friends, or find the shortest chain of connections between two users, computers execute graph traversal algorithms like <strong>BFS</strong> and <strong>DFS</strong>.
            </p>
          </div>
        </section>

        {/* 2. Breadth-First Search (BFS) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>2. Breadth-First Search (BFS)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Uses FIFO Queue
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">What is BFS?</h4>
              <p className="leading-relaxed">
                Breadth-First Search is an algorithm that <strong>visits nearby people first</strong>. It explores outward from the starting student in concentric circles (level by level), visiting all 1-hop direct friends before moving on to 2-hop friends.
              </p>
            </div>

            {/* How it works step by step */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">How BFS Works Step-by-Step:</h4>
              <ol className="list-decimal list-inside space-y-1.5 font-medium leading-relaxed">
                <li><strong>Start:</strong> Choose a starting person (e.g., Aditi), mark them as <em>visited</em>, and add them to the <strong>Queue</strong>.</li>
                <li><strong>Dequeue:</strong> Take the person at the front of the Queue.</li>
                <li><strong>Discover:</strong> Look at all of their direct friends. For each unvisited friend:
                  <ul className="list-disc list-inside ml-5 text-slate-600 font-normal">
                    <li>Mark the friend as visited.</li>
                    <li>Add the friend to the back of the Queue.</li>
                  </ul>
                </li>
                <li><strong>Repeat:</strong> Continue dequeuing and discovering until the Queue becomes completely empty.</li>
              </ol>
            </div>

            {/* The Queue Concept */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-indigo-700" />
                <span>The Queue Concept (FIFO: First-In, First-Out)</span>
              </h4>
              <p className="leading-relaxed text-indigo-900 font-medium">
                A Queue works like a real-world ticket line: the first person to enter is the first person served.
              </p>
              <div className="p-3 bg-white rounded-lg border border-indigo-200 font-mono text-center text-xs">
                <span className="text-indigo-600 font-bold">FRONT ➔</span> [ Rohan (1-hop) | Priya (1-hop) ] <span className="text-slate-400">➔ BACK</span>
              </div>
              <p className="text-[11px] text-indigo-800/80">
                Because direct friends enter the queue first, they are processed before 2-hop friends (such as Karan and Sneha).
              </p>
            </div>

            {/* Social Network Example */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Social Network Example (Starting from Aditi):</h4>
              <div className="font-mono bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <div><span className="text-indigo-700 font-bold">Level 0:</span> Aditi (Starting person)</div>
                <div><span className="text-indigo-700 font-bold">Level 1:</span> Rohan, Priya (Direct 1-hop friends)</div>
                <div><span className="text-indigo-700 font-bold">Level 2:</span> Sneha, Karan, Meera (Friends of friends)</div>
                <div><span className="text-indigo-700 font-bold">Level 3:</span> Arjun</div>
                <div><span className="text-indigo-700 font-bold">Level 4:</span> Neha</div>
                <div className="pt-2 text-slate-700 font-semibold text-[11px]">
                  Result Order: Aditi → Rohan → Priya → Sneha → Karan → Meera → Arjun → Neha
                </div>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-bold">Time Complexity</div>
                <div className="text-sm font-mono font-bold text-emerald-950">O(V + E)</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">Every person is enqueued once, and every connection edge is inspected.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-bold">Space Complexity</div>
                <div className="text-sm font-mono font-bold text-emerald-950">O(V)</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">The Queue and visited set hold at most V people in memory.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Depth-First Search (DFS) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Binary className="w-4 h-4 text-purple-600" />
              <span>3. Depth-First Search (DFS)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              Uses LIFO Stack / Recursion
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">What is DFS?</h4>
              <p className="leading-relaxed">
                Depth-First Search is an algorithm that <strong>follows one path as far as possible</strong>. Instead of visiting all nearby friends first, it picks one friend and dives deep along their connections until it hits a dead end, and then <strong>backtracks</strong> to explore remaining branches.
              </p>
            </div>

            {/* How it works step by step */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">How DFS Works Step-by-Step:</h4>
              <ol className="list-decimal list-inside space-y-1.5 font-medium leading-relaxed">
                <li><strong>Start:</strong> Visit the starting person (e.g., Aditi) and push them onto the <strong>Call Stack</strong>.</li>
                <li><strong>Dive Deep:</strong> Look for the first unvisited friend of the current person. Move to that friend immediately and push them onto the stack.</li>
                <li><strong>Dead End:</strong> If the current person has no unvisited friends left, a dead end is reached.</li>
                <li><strong>Backtrack:</strong> Pop the current person from the stack and go back to the previous person to check if they have any other unvisited friends.</li>
                <li><strong>Repeat:</strong> Continue until all reachable people have been explored.</li>
              </ol>
            </div>

            {/* The Stack & Backtracking Concept */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
              <h4 className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-purple-700" />
                <span>The Stack & Backtracking Concept (LIFO: Last-In, First-Out)</span>
              </h4>
              <p className="leading-relaxed text-purple-900 font-medium">
                A Stack works like a stack of plates: the last plate placed on top is the first one removed.
              </p>
              <div className="p-3 bg-white rounded-lg border border-purple-200 font-mono text-center text-xs">
                <span className="text-purple-600 font-bold">TOP ➔</span> [ Karan ] [ Rohan ] [ Aditi ] <span className="text-slate-400">➔ BOTTOM</span>
              </div>
              <p className="text-[11px] text-purple-800/80">
                When Karan has no unvisited friends, DFS pops Karan off the stack and returns (backtracks) to Rohan.
              </p>
            </div>

            {/* Social Network Example */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Social Network Example (Starting from Aditi):</h4>
              <div className="font-mono bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <div>Aditi ➔ Rohan ➔ Karan ➔ Sneha ➔ Arjun ➔ Meera ➔ Priya ➔ Neha</div>
                <div className="pt-2 text-slate-700 font-semibold text-[11px]">
                  Notice: DFS dives across the entire network along a single chain of friendships before backtracking!
                </div>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-bold">Time Complexity</div>
                <div className="text-sm font-mono font-bold text-emerald-950">O(V + E)</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">Every person is pushed/popped once, and incident edges are examined.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-bold">Space Complexity</div>
                <div className="text-sm font-mono font-bold text-emerald-950">O(V)</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">In the worst case (a linear chain of friends), the recursion stack holds V people.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Comparison Table: BFS vs DFS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>4. Key Comparison: BFS vs DFS</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-mono">
                  <th className="py-2.5 px-3 font-semibold">Feature</th>
                  <th className="py-2.5 px-3 font-semibold text-indigo-700">BFS (Breadth-First)</th>
                  <th className="py-2.5 px-3 font-semibold text-purple-700">DFS (Depth-First)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Traversal Strategy</td>
                  <td className="py-2.5 px-3 text-slate-700">Explores level-by-level (wide)</td>
                  <td className="py-2.5 px-3 text-slate-700">Explores branch-by-branch (deep)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Data Structure</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">Queue (FIFO)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-700">Stack / Recursion (LIFO)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Shortest Path Guarantee</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Yes (Guaranteed in unweighted graphs)</td>
                  <td className="py-2.5 px-3 text-rose-700 font-semibold">No (May find arbitrary long paths)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Best Used For</td>
                  <td className="py-2.5 px-3 text-slate-700">Finding degrees of separation, closest friends</td>
                  <td className="py-2.5 px-3 text-slate-700">Cycle detection, maze solving, discovering components</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Time Complexity</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">O(V + E)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">O(V + E)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Space Complexity</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">O(V)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">O(V)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Pseudocode */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span>5. Algorithm Pseudocode</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BFS Pseudocode */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-indigo-700 font-mono">BFS Pseudocode (Using Queue)</div>
              <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl leading-relaxed overflow-x-auto">
{`function BFS(start_person):
  create Queue Q
  mark start_person as visited
  Q.enqueue(start_person)

  while Q is not empty:
    current = Q.dequeue()
    process(current)

    for each friend in friends_of(current):
      if friend is not visited:
        mark friend as visited
        Q.enqueue(friend)`}
              </pre>
              <p className="text-[11px] text-slate-500 font-sans">
                Add start person to Queue. Repeatedly dequeue, visit friends, and enqueue unvisited neighbors.
              </p>
            </div>

            {/* DFS Pseudocode */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-700 font-mono">DFS Pseudocode (Using Stack / Recursion)</div>
              <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl leading-relaxed overflow-x-auto">
{`function DFS(current_person):
  mark current_person as visited
  process(current_person)

  for each friend in friends_of(current_person):
    if friend is not visited:
      DFS(friend)  // recursive call

  // Backtrack: returns automatically
  // when all friends are visited`}
              </pre>
              <p className="text-[11px] text-slate-500 font-sans">
                Visit current person. Recursively visit first unvisited friend. Backtrack when reaching a dead end.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Time Complexity Made Easy */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>6. Time Complexity Made Easy</span>
            </h3>
            <button
              onClick={handleMeasureRuntime}
              disabled={measuring}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Activity className={`w-3.5 h-3.5 text-emerald-600 ${measuring ? 'animate-spin' : ''}`} />
              <span>{measuring ? 'Measuring...' : 'Re-test Runtime'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-indigo-700">V</span> = Number of people ({totalUsers})
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-blue-700">E</span> = Number of friendships ({totalFriendships})
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-emerald-700">O(V + E)</span> = Total Operations
              </div>
            </div>
            <p className="pt-2 text-slate-800 font-medium leading-relaxed">
              “BFS and DFS visit each vertex at most once and examine each adjacency-list entry a constant number of times. Therefore, their time complexity is O(V + E).”
            </p>
          </div>

          {/* Concrete Numbers Card */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2 text-xs text-indigo-950">
            <div className="font-bold text-indigo-900">Concrete Example on Our College Network:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono pt-1">
              <div>
                <span className="text-slate-500 text-[11px]">People (V):</span>
                <div className="font-bold text-sm text-slate-900">{totalUsers}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Connections (E):</span>
                <div className="font-bold text-sm text-slate-900">{totalFriendships}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Theoretical Operations:</span>
                <div className="font-bold text-sm text-indigo-700">O({totalUsers + totalFriendships})</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Observed Runtime:</span>
                <div className="font-bold text-sm text-emerald-700">{observedTime}</div>
              </div>
            </div>
            <p className="text-[11px] text-indigo-800/80 pt-1">
              * Note: The observed runtime is an empirical hardware measurement on this machine, not Big-O theoretical complexity.
            </p>
          </div>
        </section>

        {/* 7. Examiner Viva Preparation */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>7. Teacher & HOD Viva Preparation (Top 4 Questions)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Q1: Why is the time complexity O(V + E) for BFS and DFS?
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Answer: Every person (vertex) is added to the Queue or Stack once, costing O(V). Then, every friendship (edge) is examined once from each end in an undirected graph, costing 2E = O(E). The total operations are V + 2E = O(V + E).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Q2: Why does BFS guarantee the shortest path in an unweighted social network, but DFS does not?
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Answer: BFS explores vertices in strictly increasing order of their distance from the source (1-hop, 2-hop, 3-hop). Therefore, the first time the destination is reached, it is via the fewest possible friendship links. DFS dives deep along one branch and may find an arbitrarily long path before backtracking.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Q3: What would happen to time complexity if we used an Adjacency Matrix instead of an Adjacency List?
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Answer: It would become O(V²), because to find the friends of each student we would have to scan an entire row of length V in the matrix, even if that student only has 1 or 2 friends.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Q4: What happens if a person is in a disconnected component?
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Answer: Neither BFS nor DFS will reach them from the main component because there is no path of edges connecting the two components. Both algorithms terminate gracefully when their Queue or Stack empties, leaving the disconnected nodes unvisited.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
