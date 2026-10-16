import React from 'react';
import {
  Camera,
  Play,
  Pause,
  Tag,
  Maximize2,
  ZoomIn,
  Sliders,
  Eye,
  EyeOff,
  Rotate3d
} from 'lucide-react';

export default function BottomControls({
  showLabels = true,
  onToggleLabels = () => {},
  autoRotate = false,
  onToggleAutoRotate = () => {},
  cameraPreset = 'default',
  onSetCameraPreset = () => {},
  nodeScale = 1.0,
  onChangeNodeScale = () => {},
  onResetView = () => {},
}) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-cyber-surface/90 backdrop-blur-md border border-cyber-border/80 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-10 select-none">
      {/* Camera Angle Presets */}
      <div className="flex items-center gap-1 bg-[#070c1e] p-1 rounded-xl border border-cyber-border/50">
        <span className="text-[10px] text-slate-400 font-mono px-2 uppercase flex items-center gap-1">
          <Camera className="w-3 h-3 text-cyan-400" />
          <span>Angle</span>
        </span>
        {[
          { id: 'default', label: 'Iso' },
          { id: 'top', label: 'Top' },
          { id: 'front', label: 'Front' },
          { id: 'side', label: 'Side' },
        ].map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSetCameraPreset(preset.id)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              cameraPreset === preset.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-cyber-border/60"></div>

      {/* Auto Rotate Toggle */}
      <button
        onClick={onToggleAutoRotate}
        title="Toggle Orbit Auto-Rotation"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          autoRotate
            ? 'bg-blue-950/60 text-blue-300 border-blue-500/50 shadow-glow-cyan'
            : 'bg-[#070c1e] text-slate-400 border-cyber-border/50 hover:text-white'
        }`}
      >
        <Rotate3d className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        <span>{autoRotate ? 'Rotating' : 'Orbit'}</span>
      </button>

      {/* Show / Hide Labels Toggle */}
      <button
        onClick={onToggleLabels}
        title="Toggle Node Name Labels in 3D"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          showLabels
            ? 'bg-purple-950/60 text-purple-300 border-purple-500/50'
            : 'bg-[#070c1e] text-slate-400 border-cyber-border/50 hover:text-white'
        }`}
      >
        {showLabels ? <Eye className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>Labels {showLabels ? 'On' : 'Off'}</span>
      </button>

      <div className="h-4 w-px bg-cyber-border/60"></div>

      {/* Node Scale Slider */}
      <div className="flex items-center gap-2">
        <Sliders className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] text-slate-400 font-mono uppercase">Size</span>
        <input
          type="range"
          min="0.6"
          max="1.8"
          step="0.1"
          value={nodeScale}
          onChange={(e) => onChangeNodeScale(parseFloat(e.target.value))}
          className="w-20 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
      </div>
    </div>
  );
}
