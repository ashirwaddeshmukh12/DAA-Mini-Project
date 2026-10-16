import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const COMMUNITY_COLORS = {
  "AI Research": "#00f0ff",        // Neon Cyan
  "Web & Distributed": "#3b82f6",  // Electric Blue
  "Cybersecurity": "#a855f7",      // Neon Purple
  "Creative Tech": "#ec4899",      // Hot Pink
  "Satellite Outpost": "#f59e0b",  // Gold / Amber
};

export default function GraphNode({
  user,
  isSelected,
  isFriendOfSelected,
  isPathNode,
  isActiveTraversalNode,
  isVisitedTraversalNode,
  isInQueueOrStack,
  showLabels,
  nodeScale = 1.0,
  onSelect,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Subtle floating/breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      if (isActiveTraversalNode || isSelected) {
        const t = state.clock.getElapsedTime();
        const scale = 1.0 + Math.sin(t * 5) * 0.15;
        meshRef.current.scale.set(scale, scale, scale);
      } else if (hovered) {
        meshRef.current.scale.set(1.2, 1.2, 1.2);
      } else {
        meshRef.current.scale.set(1.0, 1.0, 1.0);
      }
    }
  });

  // Determine node color according to state priority
  let color = COMMUNITY_COLORS[user.community] || "#00f0ff";
  let emissiveColor = color;
  let emissiveIntensity = 0.4;
  let radius = 0.75 * nodeScale;

  if (isActiveTraversalNode) {
    color = "#ef4444"; // Pulsing red/orange for currently active node
    emissiveColor = "#ef4444";
    emissiveIntensity = 1.2;
    radius = 1.05 * nodeScale;
  } else if (isPathNode) {
    color = "#fbbf24"; // Gold for shortest path
    emissiveColor = "#f59e0b";
    emissiveIntensity = 1.0;
    radius = 0.95 * nodeScale;
  } else if (isSelected) {
    color = "#ffffff";
    emissiveColor = "#00f0ff";
    emissiveIntensity = 1.0;
    radius = 0.95 * nodeScale;
  } else if (isInQueueOrStack) {
    color = "#38bdf8"; // Sky blue
    emissiveColor = "#0284c7";
    emissiveIntensity = 0.8;
  } else if (isVisitedTraversalNode) {
    color = "#10b981"; // Emerald green for visited nodes
    emissiveColor = "#059669";
    emissiveIntensity = 0.6;
  } else if (isFriendOfSelected) {
    color = "#22d3ee";
    emissiveIntensity = 0.7;
  }

  return (
    <group position={[user.x, user.y, user.z]}>
      {/* 3D Sphere Node */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(user);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Outer Glow Halo for Selected or Active Node */}
      {(isSelected || isActiveTraversalNode || isPathNode) && (
        <mesh>
          <sphereGeometry args={[radius * 1.45, 16, 16]} />
          <meshBasicMaterial
            color={emissiveColor}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      )}

      {/* HTML Billboard Label */}
      {(showLabels || hovered || isSelected || isActiveTraversalNode || isPathNode) && (
        <Html
          position={[0, radius + 0.45, 0]}
          center
          distanceFactor={24}
          className="pointer-events-none select-none transition-all duration-200"
        >
          <div
            className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shadow-lg flex items-center gap-1 border backdrop-blur-md ${
              isActiveTraversalNode
                ? 'bg-red-950/90 text-red-200 border-red-500 shadow-red-500/30'
                : isPathNode
                ? 'bg-amber-950/90 text-amber-200 border-amber-400 shadow-amber-400/30'
                : isSelected
                ? 'bg-cyan-950/95 text-cyan-200 border-cyan-400 shadow-cyan-400/40 ring-1 ring-cyan-400'
                : hovered
                ? 'bg-slate-900/95 text-white border-cyan-500/60 scale-110'
                : 'bg-slate-950/80 text-slate-300 border-slate-700/60'
            }`}
          >
            <span>{user.avatar || '👤'}</span>
            <span className="font-semibold">{user.name}</span>
            {user.degree !== undefined && (
              <span className="text-[10px] opacity-75 px-1 py-0.2 bg-black/40 rounded">
                deg {user.degree}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
