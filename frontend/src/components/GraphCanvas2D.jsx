import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Link2,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function GraphCanvas2D({
  users = [],
  friendships = [],
  selectedUser = null,
  directFriendIds = new Set(),
  shortestPath = [],
  activeTraversalNode = null,
  visitedTraversalNodes = [],
  queueOrStackNodes = [],
  activeEdge = null,
  onSelectUser = () => {},
  onResetSelection = () => {},
  isolateSelected = false,
  onDeleteFriendship = () => {},
  connectMode = false,
  connectSource = null,
  onNodeClickInConnectMode = () => {},
}) {
  const containerRef = useRef(null);

  // Maintain local coordinates so nodes remain 100% stable during interaction
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Pan & Zoom state
  const [viewTransform, setViewTransform] = useState({ x: 20, y: 10, scale: 0.95 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Initialize or update node positions from backend users
  useEffect(() => {
    setNodePositions((prev) => {
      const next = { ...prev };
      users.forEach((u) => {
        if (!next[u.id]) {
          next[u.id] = {
            x: u.x || 300,
            y: u.y || 250,
          };
        }
      });
      return next;
    });
  }, [users]);

  // Compute isolated visibility when a student is selected in isolate mode
  const isIsolating = Boolean(isolateSelected && selectedUser);

  const visibleUserIds = useMemo(() => {
    if (!isIsolating) return null;
    const set = new Set();
    set.add(selectedUser.id);
    directFriendIds.forEach((id) => set.add(id));
    return set;
  }, [isIsolating, selectedUser, directFriendIds]);

  const displayUsers = useMemo(() => {
    if (!visibleUserIds) return users;
    return users.filter((u) => visibleUserIds.has(u.id));
  }, [users, visibleUserIds]);

  const displayFriendships = useMemo(() => {
    if (!isIsolating) return friendships;
    return friendships.filter(
      (f) =>
        (f.user1_id === selectedUser.id && directFriendIds.has(f.user2_id)) ||
        (f.user2_id === selectedUser.id && directFriendIds.has(f.user1_id))
    );
  }, [friendships, isIsolating, selectedUser, directFriendIds]);

  // Shortest path edge set for O(1) lookup
  const shortestPathEdges = useMemo(() => {
    const set = new Set();
    if (shortestPath && shortestPath.length > 1) {
      for (let i = 0; i < shortestPath.length - 1; i++) {
        const u1 = shortestPath[i];
        const u2 = shortestPath[i + 1];
        set.add(`${Math.min(u1, u2)}-${Math.max(u1, u2)}`);
      }
    }
    return set;
  }, [shortestPath]);

  const pathNodesSet = useMemo(() => new Set(shortestPath || []), [shortestPath]);
  const visitedSet = useMemo(() => new Set(visitedTraversalNodes || []), [visitedTraversalNodes]);
  const queueOrStackSet = useMemo(() => new Set(queueOrStackNodes || []), [queueOrStackNodes]);

  // Active edge key
  const activeEdgeKey = activeEdge
    ? `${Math.min(activeEdge[0], activeEdge[1])}-${Math.max(activeEdge[0], activeEdge[1])}`
    : null;

  // Handle Dragging
  const handleMouseDownNode = (e, userId) => {
    e.stopPropagation();
    if (connectMode) {
      onNodeClickInConnectMode(userId);
      return;
    }
    setDraggingNodeId(userId);
    const pos = nodePositions[userId] || { x: 0, y: 0 };
    setDragOffset({
      x: e.clientX / viewTransform.scale - pos.x,
      y: e.clientY / viewTransform.scale - pos.y,
    });
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      const newX = Math.round(e.clientX / viewTransform.scale - dragOffset.x);
      const newY = Math.round(e.clientY / viewTransform.scale - dragOffset.y);
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: newX, y: newY },
      }));
    } else if (isPanning) {
      setViewTransform((prev) => ({
        ...prev,
        x: prev.x + (e.clientX - panStart.x),
        y: prev.y + (e.clientY - panStart.y),
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleStartPan = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'canvas-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Zoom controls
  const handleZoom = (delta) => {
    setViewTransform((prev) => ({
      ...prev,
      scale: Math.min(2.0, Math.max(0.5, prev.scale + delta)),
    }));
  };

  const handleResetView = () => {
    setViewTransform({ x: 20, y: 10, scale: 0.95 });
  };

  // Users lookup map
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  // Disconnected Group Bounding Box
  const disconnectedUsers = useMemo(
    () => users.filter((u) => u.community === 'Disconnected Group'),
    [users]
  );

  const showDisconnectedBox =
    !isIsolating &&
    disconnectedUsers.length > 0 &&
    (!visibleUserIds || disconnectedUsers.some((u) => visibleUserIds.has(u.id)));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleStartPan}
      className="relative w-full h-full bg-slate-50/70 overflow-hidden cursor-grab active:cursor-grabbing select-none border-b border-slate-200"
    >
      {/* Background Subtle Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main Graph SVG Canvas */}
      <svg
        id="canvas-bg"
        className="w-full h-full"
        style={{
          transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Gold Glow filter for shortest path */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.8" />
          </filter>

          {/* Pulse Glow filter for active traversal node */}
          <filter id="pulse-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f43f5e" floodOpacity="0.9" />
          </filter>

          {/* Selected Node Glow */}
          <filter id="indigo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#4f46e5" floodOpacity="0.7" />
          </filter>

          {/* Direct Friend Glow */}
          <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#059669" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Boundary Card for Disconnected Component (only when showing all) */}
        {showDisconnectedBox && (
          <g className="transition-all">
            <rect
              x={770}
              y={70}
              width={140}
              height={370}
              rx={16}
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="6 6"
              className="opacity-70"
            />
            <text
              x={840}
              y={95}
              textAnchor="middle"
              className="text-[11px] font-semibold fill-slate-500 tracking-wider font-mono uppercase"
            >
              Disconnected
            </text>
            <text
              x={840}
              y={110}
              textAnchor="middle"
              className="text-[9px] fill-slate-400 font-sans"
            >
              (Unreachable Group)
            </text>
          </g>
        )}

        {/* 1. EDGES LAYER */}
        <g className="edges-layer">
          {displayFriendships.map((f) => {
            const p1 = nodePositions[f.user1_id];
            const p2 = nodePositions[f.user2_id];
            if (!p1 || !p2) return null;

            const u1 = userMap.get(f.user1_id);
            const u2 = userMap.get(f.user2_id);
            const key = `${Math.min(f.user1_id, f.user2_id)}-${Math.max(f.user1_id, f.user2_id)}`;

            const isShortestPathEdge = shortestPathEdges.has(key);
            const isActiveTraversalEdge = activeEdgeKey === key;
            const isIncidentToSelected =
              selectedUser && (f.user1_id === selectedUser.id || f.user2_id === selectedUser.id);
            const isHovered = hoveredEdge === key;

            let strokeColor = '#94a3b8'; // clear slate-400
            let strokeWidth = 2.5;
            let strokeDash = 'none';
            let filter = 'none';
            let strokeOpacity = 1;

            if (isActiveTraversalEdge) {
              strokeColor = '#f43f5e'; // vibrant coral
              strokeWidth = 4;
              strokeDash = '6 4';
              filter = 'url(#pulse-glow)';
            } else if (isShortestPathEdge) {
              strokeColor = '#f59e0b'; // radiant gold
              strokeWidth = 4.5;
              filter = 'url(#gold-glow)';
            } else if (isIncidentToSelected) {
              strokeColor = '#4f46e5'; // rich indigo
              strokeWidth = 3.5;
            } else if (isHovered) {
              strokeColor = '#0284c7'; // sky blue
              strokeWidth = 3;
            } else if (shortestPathEdges.size > 0) {
              strokeOpacity = 0.2;
            }

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={f.id || key}>
                {/* Thick invisible line for easy hovering */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="transparent"
                  strokeWidth={16}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredEdge(key)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />

                {/* Visible friendship edge */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  strokeOpacity={strokeOpacity}
                  filter={filter}
                  className="transition-colors duration-200 pointer-events-none"
                />

                {/* Interactive Tooltip Badge on Edge Hover */}
                {isHovered && u1 && u2 && (
                  <g className="cursor-pointer pointer-events-none">
                    <rect
                      x={midX - 75}
                      y={midY - 14}
                      width={150}
                      height={28}
                      rx={6}
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth={1}
                      className="shadow-lg"
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[11px] font-semibold font-sans pointer-events-none"
                    >
                      {u1.name} ↔ {u2.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 2. NODES LAYER */}
        <g className="nodes-layer">
          {displayUsers.map((user) => {
            const pos = nodePositions[user.id] || { x: 300, y: 250 };
            const isSelected = selectedUser?.id === user.id;
            const isDirectFriend = directFriendIds.has(user.id);
            const isPathNode = pathNodesSet.has(user.id);
            const isActiveTraversal = activeTraversalNode === user.id;
            const isVisited = visitedSet.has(user.id);
            const isInQueueStack = queueOrStackSet.has(user.id);
            const isHovered = hoveredNode === user.id;

            // Visual State Styles
            let nodeFill = '#ffffff';
            let strokeColor = '#94a3b8';
            let strokeWidth = 2.5;
            let filter = 'none';
            let badgeBg = '#f1f5f9';

            if (isActiveTraversal) {
              nodeFill = '#ffe4e6'; // soft rose
              strokeColor = '#f43f5e'; // vibrant coral
              strokeWidth = 4;
              filter = 'url(#pulse-glow)';
              badgeBg = '#fecdd3';
            } else if (isPathNode) {
              nodeFill = '#fef3c7'; // soft amber
              strokeColor = '#f59e0b'; // gold
              strokeWidth = 3.5;
              filter = 'url(#gold-glow)';
              badgeBg = '#fde68a';
            } else if (isSelected) {
              nodeFill = '#e0e7ff'; // soft indigo
              strokeColor = '#4f46e5'; // brand indigo
              strokeWidth = 4;
              filter = 'url(#indigo-glow)';
              badgeBg = '#c7d2fe';
            } else if (isDirectFriend) {
              nodeFill = '#ecfdf5'; // soft emerald
              strokeColor = '#059669'; // brand emerald
              strokeWidth = 3.5;
              filter = 'url(#emerald-glow)';
              badgeBg = '#a7f3d0';
            } else if (isInQueueStack) {
              nodeFill = '#e0f2fe'; // sky blue
              strokeColor = '#0284c7';
              strokeWidth = 3;
              badgeBg = '#bae6fd';
            } else if (isVisited) {
              nodeFill = '#dcfce7'; // soft emerald
              strokeColor = '#10b981';
              strokeWidth = 2.5;
              badgeBg = '#bbf7d0';
            }

            const isDimmed = !isIsolating && pathNodesSet.size > 0 && !isPathNode;

            return (
              <g
                key={user.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                opacity={isDimmed ? 0.3 : 1}
                className="cursor-pointer transition-opacity duration-200"
                onMouseDown={(e) => handleMouseDownNode(e, user.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (connectMode) {
                    onNodeClickInConnectMode(user.id);
                  } else {
                    onSelectUser(user);
                  }
                }}
                onMouseEnter={() => setHoveredNode(user.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Ripple for Active Traversal Node */}
                {isActiveTraversal && (
                  <circle
                    r={34}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    className="animate-traversal-pulse pointer-events-none"
                  />
                )}

                {/* Selected Node Ring */}
                {isSelected && (
                  <circle
                    r={34}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    strokeDasharray="5 3"
                    className="pointer-events-none animate-spin"
                    style={{ animationDuration: '10s' }}
                  />
                )}

                {/* Node Main Circle */}
                <circle
                  r={25}
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={filter}
                  className="transition-all duration-200"
                />

                {/* Avatar Icon / Initial */}
                <text
                  textAnchor="middle"
                  dy="6"
                  className="text-base select-none pointer-events-none"
                >
                  {user.avatar || '👤'}
                </text>

                {/* Degree Badge in Top-Right of Node */}
                {user.degree !== undefined && (
                  <g transform="translate(15, -15)">
                    <circle r={9.5} fill={badgeBg} stroke={strokeColor} strokeWidth={1.5} />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      className="text-[9px] font-bold font-mono fill-slate-800 pointer-events-none"
                    >
                      {user.degree}
                    </text>
                  </g>
                )}

                {/* Student Name Label (Always Visible & Crystal Clear) */}
                <g transform="translate(0, 36)">
                  <rect
                    x={-48}
                    y={-11}
                    width={96}
                    height={20}
                    rx={6}
                    fill="#ffffff"
                    stroke={isSelected ? '#4f46e5' : isDirectFriend ? '#059669' : '#cbd5e1'}
                    strokeWidth={isSelected || isDirectFriend ? 2 : 1}
                    className="shadow-xs"
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    className={`text-xs font-bold font-sans ${
                      isSelected
                        ? 'fill-indigo-700'
                        : isDirectFriend
                        ? 'fill-emerald-800'
                        : isActiveTraversal
                        ? 'fill-rose-700'
                        : 'fill-slate-800'
                    } pointer-events-none`}
                  >
                    {user.name}
                  </text>
                </g>

                {/* Sub-label under name when isolated */}
                {isIsolating && (
                  <g transform="translate(0, 52)">
                    <text
                      textAnchor="middle"
                      className={`text-[9px] font-semibold font-mono ${
                        isSelected ? 'fill-indigo-600' : 'fill-emerald-700'
                      }`}
                    >
                      {isSelected ? '★ Selected' : '● Direct Friend'}
                    </text>
                  </g>
                )}

                {/* Hover Tooltip (Role / Department & Handle) */}
                {isHovered && (
                  <g transform="translate(0, -38)" className="pointer-events-none">
                    <rect
                      x={-80}
                      y={-22}
                      width={160}
                      height={24}
                      rx={6}
                      fill="#0f172a"
                      className="shadow-lg"
                    />
                    <text
                      textAnchor="middle"
                      dy="-6"
                      fill="#ffffff"
                      className="text-[10px] font-semibold font-sans"
                    >
                      {user.handle} • {user.role || user.community}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Prominent Focused View Banner when a vertex is isolated */}
      {isIsolating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-indigo-200 shadow-md flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-slate-600 font-medium">Focused View:</span>
            <strong className="text-indigo-950 font-bold text-sm">{selectedUser.name}</strong>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[11px] font-semibold">
              {directFriendIds.size} {directFriendIds.size === 1 ? 'connection' : 'connections'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          <button
            onClick={onResetSelection}
            title="Restore all students and connections"
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All Connections</span>
          </button>
        </div>
      )}

      {/* Connect-Mode Helper Banner */}
      {connectMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <Link2 className="w-4 h-4" />
          <span>
            {connectSource
              ? `Select second student to connect with ${userMap.get(connectSource)?.name || connectSource}...`
              : 'Click any student node to start creating a friendship edge...'}
          </span>
        </div>
      )}

      {/* Floating Canvas Action Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
        <button
          onClick={() => handleZoom(0.1)}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-200"></div>
        <button
          onClick={handleResetView}
          title="Center and Reset Zoom"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Center</span>
        </button>
      </div>

      {/* Tiny Legend (Floating Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs flex items-center gap-4 text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border-2 border-slate-400"></span>
          <span className="text-[11px] font-medium">Circle = Person</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-slate-400 rounded"></span>
          <span className="text-[11px] font-medium">Line = Friendship</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-600"></span>
          <span className="text-[11px] font-semibold text-indigo-900">Highlighted node = Current person</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-amber-500 rounded"></span>
          <span className="text-[11px] font-semibold text-amber-700">Highlighted path = Shortest path</span>
        </div>
      </div>
    </div>
  );
}
