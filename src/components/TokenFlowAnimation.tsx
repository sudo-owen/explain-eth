import React, { useState, useEffect } from "react";

const TokenFlowAnimation: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [visibleTokens, setVisibleTokens] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const tokens = [
    { name: "ETH", image: "/img/eth.svg", startPosition: "top-left" },
    { name: "USDT", image: "/img/usdt.svg", startPosition: "top-right" },
    { name: "USDC", image: "/img/usdc.svg", startPosition: "bottom" },
  ];

  const getStartPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 left-4";
    }
  };

  const getTargetTransform = (position: string, containerWidth: number = 512, containerHeight: number = 320) => {
    // Calculate positions that overlap with the wallet component
    const centerX = containerWidth / 2 - 24; // 24px = half of token width (48px)
    const centerY = containerHeight / 2 - 24; // 24px = half of token height (48px)

    switch (position) {
      case "top-left":
        // From top-left (16px from top, 16px from left) to overlap with wallet (move closer)
        return `translate(${centerX + 32}px, ${centerY - 6}px)`;
      case "top-right":
        // From top-right (16px from top, 16px from right) to overlap with wallet (move closer)
        return `translate(${centerX - (containerWidth - 0)}px, ${centerY - 6}px)`;
      case "bottom":
        // From bottom center to center (keep same for bottom token)
        return `translate(0px, ${centerY - (containerHeight - 64)}px)`;
      default:
        return `translate(0px, 0px)`;
    }
  };

  // Animation cycle effect
  useEffect(() => {
    const runAnimationCycle = () => {
      // Reset state
      setVisibleTokens([]);
      setIsAnimating(false);
      setAnimationKey((prev) => prev + 1);

      // Show tokens one by one (faster)
      setTimeout(() => setVisibleTokens([0]), 100);
      setTimeout(() => setVisibleTokens([0, 1]), 300);
      setTimeout(() => setVisibleTokens([0, 1, 2]), 500);

      // Start animation after all tokens are visible (faster)
      setTimeout(() => {
        setIsAnimating(true);
      }, 800);

      // Hide tokens when they reach center (faster timing)
      setTimeout(() => {
        setVisibleTokens([]);
      }, 2200); // Hide tokens when they reach the account

      // Reset and start next cycle (reduced delay)
      setTimeout(() => {
        runAnimationCycle();
      }, 2800);
    };

    runAnimationCycle();
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-80 bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Central Account Component */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          {/* Account label */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-gray-300 font-medium">
            Account
          </div>
          {/* Wallet body */}
          <div className="w-20 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-gray-500 shadow-xl">
            {/* Wallet opening */}
            <div className="w-full h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-t-lg"></div>
            {/* Wallet details */}
            <div className="p-2 space-y-1">
              <div className="w-12 h-1 bg-gray-400 rounded"></div>
              <div className="w-8 h-1 bg-gray-500 rounded"></div>
              <div className="w-10 h-1 bg-gray-400 rounded"></div>
            </div>
          </div>
          {/* Address label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
            0xc02a...6cc2
          </div>
        </div>
      </div>

      {/* Animated Tokens */}
      {tokens.map((token, index) => {
        const isVisible = visibleTokens.includes(index);
        return (
          <div
            key={`${token.name}-${animationKey}`}
            className={`absolute w-12 h-12 transition-all duration-[1400ms] ease-in-out z-10 ${getStartPositionClasses(
              token.startPosition
            )}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isAnimating
                ? `${getTargetTransform(token.startPosition)} scale(0.2)`
                : "translate(0px, 0px) scale(1)",
              transitionDelay: isAnimating ? `${index * 200}ms` : "0ms",
            }}
          >
            <img
              src={token.image}
              alt={token.name}
              className="w-full h-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
};

export default TokenFlowAnimation;
