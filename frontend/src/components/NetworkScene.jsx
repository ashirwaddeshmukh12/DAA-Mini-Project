import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

function CameraRig({ targetUser, resetCameraTrigger, cameraPreset }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (cameraPreset === 'top') {
      camera.position.set(0, 45, 0.1);
      camera.lookAt(0, 0, 0);
    } else if (cameraPreset === 'front') {
      camera.position.set(0, 0, 42);
      camera.lookAt(0, 0, 0);
    } else if (cameraPreset === 'side') {
      camera.position.set(42, 0, 0);
      camera.lookAt(0, 0, 0);
    } else {
      // Default isometric view
      camera.position.set(24, 20, 28);
      camera.lookAt(0, 0, 0);
    }
  }, [cameraPreset, resetCameraTrigger, camera]);

  return null;
}

export default function NetworkScene({
  users = [],
  friendships = [],
  selectedUser = null,
  shortestPath = [],
  activeTraversalNode = null,
  visitedTraversalNodes = [],
  queueOrStackNodes = [],
  activeEdge = null,
  showLabels = true,
  autoRotate = false,
  nodeScale = 1.0,
  cameraPreset = 'default',
  resetCameraTrigger = 0,
  onSelectUser = () => {},
  onClearSelection = () => {},
}) {
  const controlsRef = useRef();

  const selectedFriendsSet = useMemo(() => {
    const set = new Set();
    if (selectedUser) {
      friendships.forEach((f) => {
        if (f.user1_id === selectedUser.id) set.add(f.user2_id);
        if (f.user2_id === selectedUser.id) set.add(f.user1_id);
      });
    }
    return set;
  }, [selectedUser, friendships]);

  const pathNodesSet = useMemo(() => new Set(shortestPath || []), [shortestPath]);
  const visitedSet = useMemo(() => new Set(visitedTraversalNodes || []), [visitedTraversalNodes]);
  const queueOrStackSet = useMemo(() => new Set(queueOrStackNodes || []), [queueOrStackNodes]);

  return (
    <div className="w-full h-full relative select-none bg-gradient-to-b from-[#050814] via-[#070d20] to-[#04060e]">
      <Canvas
        camera={{ position: [24, 20, 28], fov: 45, near: 0.1, far: 1000 }}
        onPointerDown={(e) => {
          // If clicked directly on the canvas background, clear selection
          if (e.target.tagName === 'CANVAS') {
            onClearSelection();
          }
        }}
      >
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 45, 120]} />

        {/* Ambient & Thematic Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[20, 30, 20]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-20, -10, -20]} intensity={0.8} color="#00f0ff" />
        <pointLight position={[20, -15, 20]} intensity={0.8} color="#a855f7" />

        {/* Subtle Futuristic Starfield */}
        <Stars radius={80} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.8} />

        {/* Camera Rig & Preset Controller */}
        <CameraRig
          targetUser={selectedUser}
          resetCameraTrigger={resetCameraTrigger}
          cameraPreset={cameraPreset}
        />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={1.0}
          panSpeed={0.8}
          minDistance={5}
          maxDistance={80}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />

        {/* Friendship Edges */}
        <GraphEdges
          friendships={friendships}
          users={users}
          shortestPath={shortestPath}
          activeEdge={activeEdge}
          selectedUserId={selectedUser?.id}
        />

        {/* User 3D Nodes */}
        {users.map((user) => (
          <GraphNode
            key={user.id}
            user={user}
            isSelected={selectedUser?.id === user.id}
            isFriendOfSelected={selectedFriendsSet.has(user.id)}
            isPathNode={pathNodesSet.has(user.id)}
            isActiveTraversalNode={activeTraversalNode === user.id}
            isVisitedTraversalNode={visitedSet.has(user.id)}
            isInQueueOrStack={queueOrStackSet.has(user.id)}
            showLabels={showLabels}
            nodeScale={nodeScale}
            onSelect={onSelectUser}
          />
        ))}
      </Canvas>
    </div>
  );
}
