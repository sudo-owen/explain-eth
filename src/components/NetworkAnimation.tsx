import React, { useState, useEffect } from "react";
import { getRecipientEmoji } from "../utils/recipients";

interface Node {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
}

interface AnimatedPath {
  from: string;
  to: string;
  progress: number;
  active: boolean;
}

interface AnimationState {
  sourceNode: string | null;
  destinationNode: string | null;
  pathNodes: string[];
  currentSegment: number;
  phase: "highlight" | "trace" | "fade";
}

const NetworkAnimation: React.FC = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    sourceNode: null,
    destinationNode: null,
    pathNodes: [],
    currentSegment: 0,
    phase: "highlight",
  });
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [animatedPaths, setAnimatedPaths] = useState<AnimatedPath[]>([]);

  // Define network nodes with emojis and positions (centered in 200px height)
  const nodes: Node[] = [
    {
      id: "user",
      emoji: "👤",
      name: "You",
      x: 50,
      y: 70,
      connections: ["alice", "bob"],
    },
    {
      id: "alice",
      emoji: getRecipientEmoji("Alice"),
      name: "Alice",
      x: 150,
      y: 50,
      connections: ["user", "bob", "carol"],
    },
    {
      id: "bob",
      emoji: getRecipientEmoji("Bob"),
      name: "Bob",
      x: 250,
      y: 90,
      connections: ["user", "alice", "carol", "dave"],
    },
    {
      id: "carol",
      emoji: getRecipientEmoji("Carol"),
      name: "Carol",
      x: 180,
      y: 140,
      connections: ["alice", "bob", "eve"],
    },
    {
      id: "dave",
      emoji: "👨‍🦱",
      name: "Dave",
      x: 320,
      y: 60,
      connections: ["bob", "eve"],
    },
    {
      id: "eve",
      emoji: getRecipientEmoji("Eve"),
      name: "Eve",
      x: 280,
      y: 150,
      connections: ["carol", "dave"],
    },
  ];

  // Simple source-destination pairs with their paths
  const communicationPairs = [
    { source: "user", destination: "carol", path: ["user", "alice", "carol"] },
    { source: "user", destination: "dave", path: ["user", "bob", "dave"] },
    { source: "alice", destination: "eve", path: ["alice", "carol", "eve"] },
    {
      source: "user",
      destination: "eve",
      path: ["user", "bob", "carol", "eve"],
    },
    { source: "carol", destination: "user", path: ["carol", "alice", "user"] },
    { source: "dave", destination: "alice", path: ["dave", "bob", "alice"] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentPair = communicationPairs[currentPathIndex];

      // Phase 1: Highlight source and destination (1 second)
      setAnimationState({
        sourceNode: currentPair.source,
        destinationNode: currentPair.destination,
        pathNodes: currentPair.path,
        currentSegment: 0,
        phase: "highlight",
      });
      setAnimatedPaths([]);

      // Phase 2: Trace path (1.5 seconds)
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, phase: "trace" }));

        // Create path segments for animation
        const newPaths: AnimatedPath[] = [];
        for (let i = 0; i < currentPair.path.length - 1; i++) {
          newPaths.push({
            from: currentPair.path[i],
            to: currentPair.path[i + 1],
            progress: 0,
            active: false,
          });
        }
        setAnimatedPaths(newPaths);
      }, 1000);

      // Phase 3: Fade out - calculate timing based on path length
      const pathDuration = 200 + (currentPair.path.length - 1) * (500 + 200); // initial + (segments * (animation + delay))
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, phase: "fade" }));
        setAnimatedPaths([]); // Clear animated paths when fading
      }, 1000 + pathDuration + 100); // trace start + path duration + small buffer

      // Move to next pair
      setCurrentPathIndex((prev) => (prev + 1) % communicationPairs.length);
    }, 4000); // Total cycle: 4 seconds

    return () => clearInterval(interval);
  }, [currentPathIndex]);

  useEffect(() => {
    if (animatedPaths.length === 0 || animationState.phase !== "trace") return;

    let pathIndex = 0;
    const animateNextPath = () => {
      if (pathIndex >= animatedPaths.length) return;

      // Activate current path
      setAnimatedPaths((prev) =>
        prev.map((path, index) =>
          index === pathIndex ? { ...path, active: true } : path
        )
      );

      let progress = 0;
      const animationInterval = setInterval(() => {
        progress += 0.08; // Faster animation: 8% per frame

        setAnimatedPaths((prev) =>
          prev.map((path, index) =>
            index === pathIndex
              ? { ...path, progress: Math.min(progress, 1) }
              : path
          )
        );

        if (progress >= 1) {
          clearInterval(animationInterval);
          pathIndex++;
          setTimeout(animateNextPath, 200); // Shorter delay between segments
        }
      }, 40); // 25 FPS
    };

    setTimeout(animateNextPath, 200); // Shorter initial delay
  }, [animatedPaths.length, animationState.phase]);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const renderConnection = (from: string, to: string) => {
    const fromPos = getNodePosition(from);
    const toPos = getNodePosition(to);

    return (
      <line
        key={`${from}-${to}`}
        x1={fromPos.x}
        y1={fromPos.y}
        x2={toPos.x}
        y2={toPos.y}
        stroke="#374151"
        strokeWidth="2"
        opacity="0.3"
      />
    );
  };

  const renderAnimatedPath = (path: AnimatedPath) => {
    if (!path.active) return null;

    const fromPos = getNodePosition(path.from);
    const toPos = getNodePosition(path.to);

    const currentX = fromPos.x + (toPos.x - fromPos.x) * path.progress;
    const currentY = fromPos.y + (toPos.y - fromPos.y) * path.progress;

    return (
      <g key={`${path.from}-${path.to}-animated`}>
        {/* Animated line */}
        <line
          x1={fromPos.x}
          y1={fromPos.y}
          x2={currentX}
          y2={currentY}
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.9"
        />
        {/* Moving dot */}
        <circle cx={currentX} cy={currentY} r="4" fill="#ffffff" opacity="1.0">
          <animate
            attributeName="r"
            values="4;6;4"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  };

  // Get all unique connections for static lines
  const allConnections = new Set<string>();
  nodes.forEach((node) => {
    node.connections.forEach((connId) => {
      const connectionKey = [node.id, connId].sort().join("-");
      allConnections.add(connectionKey);
    });
  });

  return (
    <div className="my-12 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <svg
          viewBox="0 0 370 200"
          className="w-full h-auto"
          style={{ maxHeight: "350px" }}
        >
          {/* Static connection lines */}
          {Array.from(allConnections).map((connection) => {
            const [from, to] = connection.split("-");
            return renderConnection(from, to);
          })}

          {/* Animated paths */}
          {animatedPaths.map(renderAnimatedPath)}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSource = animationState.sourceNode === node.id;
            const isDestination = animationState.destinationNode === node.id;
            const isHighlighted =
              (isSource || isDestination) &&
              animationState.phase === "highlight";
            const isActiveParticipant =
              (isSource || isDestination) && animationState.phase !== "fade";

            return (
              <g key={node.id}>
                {/* Highlight ring for source/destination */}
                {isHighlighted && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke={isSource ? "#10b981" : "#3b82f6"}
                    strokeWidth="3"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="28;32;28"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.4;0.8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={
                    isHighlighted
                      ? isSource
                        ? "#065f46"
                        : "#1e3a8a"
                      : "#1f2937"
                  }
                  stroke={
                    isActiveParticipant
                      ? isSource
                        ? "#10b981"
                        : "#3b82f6"
                      : "#4b5563"
                  }
                  strokeWidth="2"
                />

                {/* Emoji */}
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fontSize="20"
                  className="select-none"
                >
                  {node.emoji}
                </text>

                {/* Name label */}
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  fontSize="12"
                  fill={
                    isHighlighted
                      ? isSource
                        ? "#10b981"
                        : "#3b82f6"
                      : "#9ca3af"
                  }
                  className="select-none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="text-gray-400 text-sm mt-4 max-w-md">
        A network showing connected participants. Messages can travel between
        any two people through various paths.
      </div>
    </div>
  );
};

export default NetworkAnimation;
