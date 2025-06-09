import React, { useState, useEffect } from "react";
import { getRecipientAddress, getRecipientEmoji } from "../utils/recipients";

interface FloatingBadge {
  id: string;
  amount: number;
  isVisible: boolean;
  side: "left" | "right";
}

interface AnimationState {
  phase:
    | "reset"
    | "mint-dollar-to-bank"
    | "mint-usdc-from-bank"
    | "mint-balance-update"
    | "burn-usdc-to-bank"
    | "burn-dollar-from-bank"
    | "burn-balance-update"
    | "pause";
  mintTokenPosition: { x: string; y: string; opacity: number; scale: number };
  burnTokenPosition: { x: string; y: string; opacity: number; scale: number };
  bankCharged: { left: boolean; right: boolean; aliceGlow?: boolean };
}

const MintBurnAnimation: React.FC = () => {
  const [animationCycle, setAnimationCycle] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: "reset",
    mintTokenPosition: { x: "0px", y: "0px", opacity: 0, scale: 1 },
    burnTokenPosition: { x: "0px", y: "0px", opacity: 0, scale: 1 },
    bankCharged: { left: false, right: false },
  });
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const [aliceBalanceLeft, setAliceBalanceLeft] = useState(50); // Minting side
  const [aliceBalanceRight, setAliceBalanceRight] = useState(60); // Burning side
  const [highlightedBalance, setHighlightedBalance] = useState<{
    side: "left" | "right";
    type: "increase" | "decrease";
  } | null>(null);

  // Animation cycle effect
  useEffect(() => {
    const runAnimationCycle = () => {
      // Reset state
      setAnimationState({
        phase: "reset",
        mintTokenPosition: { x: "0px", y: "0px", opacity: 0, scale: 1 },
        burnTokenPosition: { x: "0px", y: "0px", opacity: 0, scale: 1 },
        bankCharged: { left: false, right: false },
      });
      setFloatingBadges([]);
      setHighlightedBalance(null);
      setAliceBalanceLeft(50); // Reset minting side balance
      setAliceBalanceRight(60); // Reset burning side balance

      // Phase 1: Mint - Dollar appears and moves to bank (1s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "mint-dollar-to-bank",
          mintTokenPosition: {
            x: "20px", // Start from left edge
            y: "0px",
            opacity: 1,
            scale: 1,
          },
        }));

        // Then animate to center (bank)
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            mintTokenPosition: {
              x: "calc(50% - 12px)", // Move to center (bank)
              y: "0px",
              opacity: 1,
              scale: 1,
            },
          }));
        }, 50);
      }, 300);

      // Phase 2: Bank charges up, dollar vanishes, USDC appears from bank (1s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "mint-usdc-from-bank",
          bankCharged: { ...prev.bankCharged, left: true },
          mintTokenPosition: {
            x: "calc(50% - 12px)", // Start from center (bank)
            y: "0px",
            opacity: 1,
            scale: 1,
          },
        }));

        // Then animate to right edge
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            mintTokenPosition: {
              x: "calc(100% - 44px)", // Move to right edge
              y: "0px",
              opacity: 1,
              scale: 1,
            },
          }));
        }, 50);
      }, 1300);

      // Phase 3: Alice glows and balance updates (0.8s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "mint-balance-update",
          bankCharged: { ...prev.bankCharged, left: false, aliceGlow: true },
        }));
        setHighlightedBalance({ side: "left", type: "increase" });
        setFloatingBadges([
          { id: "mint-badge", amount: 10, isVisible: true, side: "left" },
        ]);

        // Update balance after badge appears
        setTimeout(() => {
          setAliceBalanceLeft(60);
          setFloatingBadges([]);
          setHighlightedBalance(null);
          setAnimationState((prev) => ({
            ...prev,
            bankCharged: { ...prev.bankCharged, aliceGlow: false },
          }));
        }, 400);
      }, 2300);

      // Phase 4: Burn - USDC moves to bank (1s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "burn-usdc-to-bank",
          burnTokenPosition: {
            x: "20px", // Start from Alice
            y: "0px",
            opacity: 1,
            scale: 1,
          },
        }));

        // Then animate to bank (right)
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            burnTokenPosition: {
              x: "calc(100% - 64px)", // Move to bank
              y: "0px",
              opacity: 1,
              scale: 1,
            },
          }));
        }, 50);
      }, 3100);

      // Phase 5: Bank charges up, USDC vanishes, Dollar appears from bank (1s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "burn-dollar-from-bank",
          bankCharged: { ...prev.bankCharged, right: true },
          burnTokenPosition: { x: "calc(100% - 64px)", y: "0px", opacity: 1, scale: 1 }, // Start from bank
        }));

        // Then animate to Alice
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            burnTokenPosition: { x: "20px", y: "0px", opacity: 1, scale: 1 }, // Move to Alice
          }));
        }, 50);
      }, 4100);

      // Phase 6: Alice glows and balance updates (0.8s)
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          phase: "burn-balance-update",
          bankCharged: { ...prev.bankCharged, right: false, aliceGlow: true },
        }));
        setHighlightedBalance({ side: "right", type: "decrease" });
        setFloatingBadges([
          { id: "burn-badge", amount: -10, isVisible: true, side: "right" },
        ]);

        // Update balance after badge appears
        setTimeout(() => {
          setAliceBalanceRight(50);
          setFloatingBadges([]);
          setHighlightedBalance(null);
          setAnimationState((prev) => ({
            ...prev,
            bankCharged: { ...prev.bankCharged, aliceGlow: false },
          }));
        }, 400);
      }, 5100);

      // Phase 7: Immediate restart (no pause)
      setTimeout(() => {
        setAnimationCycle((prev) => prev + 1);
      }, 5900);
    };

    runAnimationCycle();
  }, [animationCycle]);

  const formatUSDCBalance = (balance: number) => {
    return {
      value: balance.toFixed(2),
      ticker: "USDC",
    };
  };

  const renderBalance = (
    balanceData: { value: string; ticker: string },
    side: "left" | "right"
  ) => {
    const isHighlighted = highlightedBalance?.side === side;
    const balanceHighlightColor = isHighlighted
      ? highlightedBalance?.type === "increase"
        ? "text-green-400"
        : "text-red-400"
      : "text-gray-300";

    return (
      <span className="text-sm">
        <span
          className={`font-bold transition-colors duration-300 ${balanceHighlightColor}`}
        >
          {balanceData.value}
        </span>
        <span className="ml-1 font-medium text-green-400">
          {balanceData.ticker}
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Minting */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-400">Minting</h3>
            <p className="text-sm text-gray-400">Creating new tokens</p>
          </div>

          {/* Minting Animation */}
          <div className="relative w-full h-60 rounded-xl border border-gray-700/50 overflow-visible">
            {/* Split Background - Physical to Digital */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-900/25"></div>
              <div className="absolute right-0 top-0 w-1/2 h-full bg-sky-900/25"></div>
            </div>
            {/* Bank */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                <div
                  className={`w-20 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 transition-all duration-500 ${
                    animationState.bankCharged.left
                      ? "border-blue-400 shadow-lg shadow-blue-400/50"
                      : "border-gray-500"
                  }`}
                >
                  <div className="w-full h-3 bg-gradient-to-r from-gray-500 to-gray-700 rounded-t-lg"></div>
                  <div className="flex justify-center items-center h-full px-2">
                    <div className="text-xl">🏦</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-300 font-medium text-xs">
                  Bank
                </div>
              </div>
            </div>

            {/* Physical/Digital Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 z-5">
              <div className="text-xs font-sans text-blue-500">Physical</div>
              <div className="text-xs font-mono text-green-500">Digital</div>
            </div>

            {/* Dollar Token (going into bank) */}
            {animationState.phase === "mint-dollar-to-bank" && (
              <div
                className="absolute w-6 h-6 transition-all duration-1000 ease-in-out z-10"
                style={{
                  left: animationState.mintTokenPosition.x,
                  top: `calc(50% - 12px + ${animationState.mintTokenPosition.y})`,
                  opacity: animationState.mintTokenPosition.opacity,
                  transform: `scale(${animationState.mintTokenPosition.scale})`,
                }}
              >
                <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                  <img
                    src="/img/dollar.svg"
                    alt="Dollar"
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </div>
            )}

            {/* USDC Token (coming from bank) */}
            {animationState.phase === "mint-usdc-from-bank" && (
              <div
                className="absolute w-6 h-6 transition-all duration-1000 ease-in-out z-10"
                style={{
                  left: animationState.mintTokenPosition.x,
                  top: `calc(50% - 12px + ${animationState.mintTokenPosition.y})`,
                  opacity: 1,
                  transform: `scale(${animationState.mintTokenPosition.scale})`,
                }}
              >
                <img
                  src="/img/usdc.svg"
                  alt="USDC"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Minting Spreadsheet */}
          <div
            className={`bg-gray-800 border border-gray-700 rounded-lg relative ${
              floatingBadges.filter((badge) => badge.side === "left").length > 0
                ? "overflow-visible"
                : "overflow-hidden"
            }`}
          >
            <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
              <h4 className="text-md font-semibold text-gray-100 text-center">
                Alice's USDC Balance
              </h4>
            </div>
            <div
              className="overflow-x-auto"
              style={
                floatingBadges.filter((badge) => badge.side === "left").length >
                0
                  ? { overflowX: "visible" }
                  : {}
              }
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-750">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-gray-600">
                      Address
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <img
                          src="/img/usdc.svg"
                          alt="USDC"
                          className="w-4 h-4"
                        />
                        <span>Balance</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-800 hover:bg-gray-700 transition-all duration-300">
                    <td className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {getRecipientEmoji("Alice")}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            Alice
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {getRecipientAddress("Alice").slice(0, 6)}...
                            {getRecipientAddress("Alice").slice(-4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                      {renderBalance(
                        formatUSDCBalance(aliceBalanceLeft),
                        "left"
                      )}
                      {floatingBadges
                        .filter((badge) => badge.side === "left")
                        .map((badge) => (
                          <div
                            key={badge.id}
                            className={`absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold z-10 pointer-events-none
                            ${
                              badge.amount > 0
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                            transition-all duration-300 ease-out
                            ${
                              badge.isVisible
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                            }`}
                            style={{ transform: "translate(25%, -25%)" }}
                          >
                            {badge.amount > 0 ? "+" : ""}
                            {badge.amount}
                          </div>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Burning */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-400">Burning</h3>
            <p className="text-sm text-gray-400">Redeeming tokens</p>
          </div>

          {/* Burning Animation */}
          <div className="relative w-full h-60 rounded-xl border border-gray-700/50 overflow-visible">
            {/* Split Background - Physical to Digital */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-900/25"></div>
              <div className="absolute right-0 top-0 w-1/2 h-full bg-sky-900/25"></div>
            </div>
            {/* Bank */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
              <div className="relative">
                <div
                  className={`w-20 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 transition-all duration-500 ${
                    animationState.bankCharged.right
                      ? "border-blue-400 shadow-lg shadow-blue-400/50"
                      : "border-gray-500"
                  }`}
                >
                  <div className="w-full h-3 bg-gradient-to-r from-gray-500 to-gray-700 rounded-t-lg"></div>
                  <div className="flex justify-center items-center h-full px-2">
                    <div className="text-xl">🏦</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-300 font-medium text-xs">
                  Bank
                </div>
              </div>
            </div>

            {/* Physical/Digital Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 z-5">
              <div className="text-xs font-sans text-blue-500">Physical</div>
              <div className="text-xs font-mono text-green-500">Digital</div>
            </div>

            {/* Alice (sending USDC) */}
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-30 px-3 py-2 bg-gray-700 rounded-lg border transition-all duration-500 ${
              animationState.bankCharged.aliceGlow
                ? 'border-blue-400 shadow-lg shadow-blue-400/50'
                : 'border-gray-600/50'
            }`}>
              <div className="flex flex-col items-center space-y-1">
                <div className="text-xl">{getRecipientEmoji("Alice")}</div>
                <div className="text-xs text-gray-300 font-medium">Alice</div>
              </div>
            </div>

            {/* USDC Token (going into bank) */}
            {animationState.phase === "burn-usdc-to-bank" && (
              <div
                className="absolute w-6 h-6 transition-all duration-1000 ease-in-out z-10"
                style={{
                  left: animationState.burnTokenPosition.x,
                  top: `calc(50% - 12px + ${animationState.burnTokenPosition.y})`,
                  opacity: animationState.burnTokenPosition.opacity,
                  transform: `scale(${animationState.burnTokenPosition.scale})`,
                }}
              >
                <img
                  src="/img/usdc.svg"
                  alt="USDC"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Dollar Token (coming from bank) */}
            {animationState.phase === "burn-dollar-from-bank" && (
              <div
                className="absolute w-6 h-6 transition-all duration-1000 ease-in-out z-10"
                style={{
                  left: animationState.burnTokenPosition.x,
                  top: `calc(50% - 12px + ${animationState.burnTokenPosition.y})`,
                  opacity: 1,
                  transform: `scale(${animationState.burnTokenPosition.scale})`,
                }}
              >
                <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                  <img
                    src="/img/dollar.svg"
                    alt="Dollar"
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Burning Spreadsheet */}
          <div
            className={`bg-gray-800 border border-gray-700 rounded-lg relative ${
              floatingBadges.filter((badge) => badge.side === "right").length >
              0
                ? "overflow-visible"
                : "overflow-hidden"
            }`}
          >
            <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
              <h4 className="text-md font-semibold text-gray-100 text-center">
                Alice's USDC Balance
              </h4>
            </div>
            <div
              className="overflow-x-auto"
              style={
                floatingBadges.filter((badge) => badge.side === "right")
                  .length > 0
                  ? { overflowX: "visible" }
                  : {}
              }
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-750">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-gray-600">
                      Address
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <img
                          src="/img/usdc.svg"
                          alt="USDC"
                          className="w-4 h-4"
                        />
                        <span>Balance</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-800 hover:bg-gray-700 transition-all duration-300">
                    <td className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {getRecipientEmoji("Alice")}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            Alice
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {getRecipientAddress("Alice").slice(0, 6)}...
                            {getRecipientAddress("Alice").slice(-4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                      {renderBalance(
                        formatUSDCBalance(aliceBalanceRight),
                        "right"
                      )}
                      {floatingBadges
                        .filter((badge) => badge.side === "right")
                        .map((badge) => (
                          <div
                            key={badge.id}
                            className={`absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold z-10 pointer-events-none
                            ${
                              badge.amount > 0
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                            transition-all duration-300 ease-out
                            ${
                              badge.isVisible
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                            }`}
                            style={{ transform: "translate(25%, -25%)" }}
                          >
                            {badge.amount > 0 ? "+" : ""}
                            {badge.amount}
                          </div>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}

      <div className="flex justify-center mt-6 mb-6">
        <div className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded max-w-2xl">
          Minting creates new tokens when dollars are deposited. Burning
          removes tokens when dollars are withdrawn.
        </div>
      </div>
    </div>
  );
};

export default MintBurnAnimation;
