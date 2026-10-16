import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  Clock,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

export default function AlgorithmControls({
  isPlaying = false,
  isPaused = false,
  isFinished = false,
  currentStepIndex = 0,
  totalSteps = 0,
  speed = 1.0,
  onStart = () => {},
  onPause = () => {},
  onResume = () => {},
  onStepForward = () => {},
  onReset = () => {},
  onChangeSpeed = () => {},
}) {
  const speeds = [0.5, 1.0, 2.0, 4.0];

  return (
    <div className="bg-[#070c1e] border border-cyber-border rounded-2xl p-3.5 shadow-xl select-none space-y-3">
      {/* Top Playback Control Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause/Resume Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying && !isPaused && (
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/60 transition-all border border-emerald-400/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Traversal</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600/90 text-white hover:bg-amber-500 shadow-lg transition-all border border-amber-400/30"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && !isFinished && (
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/90 text-white hover:bg-emerald-500 shadow-lg transition-all border border-emerald-400/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </button>
          )}

          {/* Step Forward Button */}
          <button
            onClick={onStepForward}
            disabled={isPlaying || isFinished || totalSteps === 0}
            title="Advance exactly one algorithm step"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0b1328] border border-cyber-border text-slate-200 hover:text-white hover:border-cyan-400 disabled:opacity-40 transition-all"
          >
            <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step Forward</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title="Reset algorithm state"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0b1328] border border-cyber-border text-slate-400 hover:text-white hover:border-red-400/40 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Multiplier Segmented Selector */}
        <div className="flex items-center gap-1 bg-[#0b1328] p-1 rounded-xl border border-cyber-border/60">
          <Zap className="w-3 h-3 text-amber-400 ml-1.5" />
          <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-all ${
                speed === s
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Step Progress Bar & Counter */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Execution Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}
            </span>
          </span>
          <span className="text-cyan-400 font-semibold">
            {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-[#0b1328] rounded-full overflow-hidden border border-cyber-border/40">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
