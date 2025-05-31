import { useState, useEffect, useRef } from 'react'
import ChainColumn from '../components/ChainColumn'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import BridgeOverlay from '../components/BridgeOverlay'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import { Recipient } from '../types/blockchain'

function PlaygroundPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [isBridgeOpen, setIsBridgeOpen] = useState(false)
  const previousTransactionCount = useRef(0)

  const {
    ethereumState,
    rollupState,
    sendMoney,
    purchaseNFT,
    sellNFT,
    depositEarnings,
    withdrawEarnings,
    claimEarnings,
    bridgeToRollup,
    calculateCurrentEarnings,
    transactionHistory,
    modalState,
    currentPendingTransaction,
    closeModal
  } = useBlockchainContext()

  // Auto-open overlay when new transaction is submitted
  useEffect(() => {
    if (transactionHistory.length > previousTransactionCount.current) {
      setIsHistoryOpen(true)
    }
    previousTransactionCount.current = transactionHistory.length
  }, [transactionHistory.length])

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Ethereum Mainnet */}
        <ChainColumn
          title="Ethereum Mainnet"
          chainState={ethereumState}
          onSendMoney={(recipient: Recipient, amount: number) => sendMoney('ethereum', recipient, amount)}
          onPurchaseNFT={(nftId: string, price: number, emoji: string) => purchaseNFT('ethereum', nftId, price, emoji)}
          onSellNFT={(nftId: string) => sellNFT('ethereum', nftId)}
          onDepositEarnings={(amount: number) => depositEarnings('ethereum', amount)}
          onWithdrawEarnings={(amount: number) => withdrawEarnings('ethereum', amount)}
          onClaimEarnings={() => claimEarnings('ethereum')}
          currentEarnings={calculateCurrentEarnings(ethereumState)}
          theme="ethereum"
          className="lg:w-1/2 border-r border-gray-700"
          onBridgeToggle={() => setIsBridgeOpen(!isBridgeOpen)}
        />

        {/* Rollup */}
        <ChainColumn
          title="Rollup"
          chainState={rollupState}
          onSendMoney={(recipient: Recipient, amount: number) => sendMoney('rollup', recipient, amount)}
          onPurchaseNFT={(nftId: string, price: number, emoji: string) => purchaseNFT('rollup', nftId, price, emoji)}
          onSellNFT={(nftId: string) => sellNFT('rollup', nftId)}
          onDepositEarnings={(amount: number) => depositEarnings('rollup', amount)}
          onWithdrawEarnings={(amount: number) => withdrawEarnings('rollup', amount)}
          onClaimEarnings={() => claimEarnings('rollup')}
          currentEarnings={calculateCurrentEarnings(rollupState)}
          theme="rollup"
          className="lg:w-1/2 bg-gradient-to-br from-purple-950/20 to-indigo-950/20"
        />
      </div>

      {/* Transaction Modal */}
      {modalState.isOpen && (
        <TransactionModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          message={modalState.message}
          onClose={closeModal}
          pendingTransaction={currentPendingTransaction}
        />
      )}

      {/* Transaction History Overlay */}
      <TransactionHistoryOverlay
        ethereumTransactions={transactionHistory.filter(tx => tx.chain === 'ethereum')}
        rollupTransactions={transactionHistory.filter(tx => tx.chain === 'rollup')}
        ethereumPendingCount={ethereumState.pendingTransactions}
        rollupPendingCount={rollupState.pendingTransactions}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      />

      {/* Bridge Overlay */}
      <BridgeOverlay
        ethereumState={ethereumState}
        rollupState={rollupState}
        onBridge={bridgeToRollup}
        isOpen={isBridgeOpen}
        onToggle={() => setIsBridgeOpen(!isBridgeOpen)}
      />
    </div>
  )
}

export default PlaygroundPage
