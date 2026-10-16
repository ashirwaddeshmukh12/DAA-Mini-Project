import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function GraphEdges({
  friendships = [],
  users = [],
  shortestPath = [],
  activeEdge = null,
  selectedUserId = null,
}) {
  const nodeMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      map.set(u.id, new THREE.Vector3(u.x, u.y, u.z));
    });
    return map;
  }, [users]);

  // Build shortest path edge pairs set
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

  // Partition friendships into regular, incident to selected user, and path edges
  const { normalLines, selectedUserLines, pathLines, activeTraversalLines } = useMemo(() => {
    const normal = [];
    const selectedLines = [];
    const path = [];
    const active = [];

    const activeKey = activeEdge
      ? `${Math.min(activeEdge[0], activeEdge[1])}-${Math.max(activeEdge[0], activeEdge[1])}`
      : null;

    friendships.forEach((f) => {
      const p1 = nodeMap.get(f.user1_id);
      const p2 = nodeMap.get(f.user2_id);
      if (!p1 || !p2) return;

      const key = `${Math.min(f.user1_id, f.user2_id)}-${Math.max(f.user1_id, f.user2_id)}`;

      if (activeKey && key === activeKey) {
        active.push(p1, p2);
      } else if (shortestPathEdges.has(key)) {
        path.push(p1, p2);
      } else if (selectedUserId && (f.user1_id === selectedUserId || f.user2_id === selectedUserId)) {
        selectedLines.push(p1, p2);
      } else {
        normal.push(p1, p2);
      }
    });

    return {
      normalLines: normal,
      selectedUserLines: selectedLines,
      pathLines: path,
      activeTraversalLines: active,
    };
  }, [friendships, nodeMap, shortestPathEdges, activeEdge, selectedUserId]);

  const normalGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    if (normalLines.length > 0) {
      geom.setFromPoints(normalLines);
    }
    return geom;
  }, [normalLines]);

  const selectedGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    if (selectedUserLines.length > 0) {
      geom.setFromPoints(selectedUserLines);
    }
    return geom;
  }, [selectedUserLines]);

  const pathGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    if (pathLines.length > 0) {
      geom.setFromPoints(pathLines);
    }
    return geom;
  }, [pathLines]);

  const activeGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    if (activeTraversalLines.length > 0) {
      geom.setFromPoints(activeTraversalLines);
    }
    return geom;
  }, [activeTraversalLines]);

  return (
    <group>
      {/* Normal background friendship edges */}
      {normalLines.length > 0 && (
        <lineSegments geometry={normalGeom}>
          <lineBasicMaterial
            color="#1e3a8a"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Edges connected to currently selected user */}
      {selectedUserLines.length > 0 && (
        <lineSegments geometry={selectedGeom}>
          <lineBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.85}
            linewidth={2}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Shortest Path edges in radiant gold */}
      {pathLines.length > 0 && (
        <lineSegments geometry={pathGeom}>
          <lineBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.95}
            linewidth={3}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Active Traversal Edge in animation */}
      {activeTraversalLines.length > 0 && (
        <lineSegments geometry={activeGeom}>
          <lineBasicMaterial
            color="#ef4444"
            transparent
            opacity={1.0}
            linewidth={4}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}
