import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import { Recipient } from '../types/blockchain'
import { formatETH, formatETHTruncated } from '../utils/transactions'
import { getRecipientAddress, getRecipientEmoji } from '../utils/recipients'
import FlashAnimation from './FlashAnimation'

interface BalanceComponentProps {
  showSendAction?: boolean
  allowedRecipients?: Recipient[]
  className?: string
  showReceiveAction?: boolean
  disableButtonsOnPending?: boolean
  autoCycleRecipients?: boolean
  showSentCheckmarks?: boolean
  componentId?: string
  useSplitter?: boolean
  splitterAmount?: number
  autoInitializeETH?: boolean
  showRecipientSelection?: boolean
}

const BalanceComponent: React.FC<BalanceComponentProps> = ({
  showSendAction = false,
  allowedRecipients = ['Alice', 'Bob', 'Carol'],
  className = '',
  showReceiveAction = false,
  disableButtonsOnPending = true,
  autoCycleRecipients = false,
  showSentCheckmarks = false,
  componentId,
  useSplitter = false,
  splitterAmount = 0.03,
  autoInitializeETH = false,
  showRecipientSelection = true
}) => {
  const { t } = useTranslation()
  const { ethereumState, sendMoney, sendToSplitter, receiveETH, transactionHistory } = useBlockchainContext()
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient>(allowedRecipients[0] || 'Bob')
  const [lastTransactionCount, setLastTransactionCount] = useState(0)
  const [componentTransactionIds, setComponentTransactionIds] = useState<Set<string>>(new Set())
  const [pendingSendFromComponent, setPendingSendFromComponent] = useState<{recipient: Recipient, amount: number, timestamp: number} | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Auto-initialize with 1 ETH if balance is zero and autoInitializeETH is true
  useEffect(() => {
    if (autoInitializeETH && ethereumState.balance === 0 && !hasInitialized) {
      setHasInitialized(true)
      receiveETH()
    }
  }, [autoInitializeETH, ethereumState.balance, hasInitialized, receiveETH])

  // Track transactions sent from this component
  useEffect(() => {
    if (componentId && pendingSendFromComponent) {
      // Look for a new transaction that matches our pending send
      const matchingTransaction = transactionHistory.find(tx =>
        tx.type === 'send' &&
        tx.chain === 'ethereum' &&
        tx.recipient === pendingSendFromComponent.recipient &&
        tx.amount === pendingSendFromComponent.amount &&
        !componentTransactionIds.has(tx.id) &&
        tx.timestamp.getTime() >= pendingSendFromComponent.timestamp
      )

      if (matchingTransaction) {
        // Found the matching transaction, mark it as ours
        setComponentTransactionIds(prev => new Set([...prev, matchingTransaction.id]))
        setPendingSendFromComponent(null) // Clear the pending send
      }
    }
  }, [transactionHistory, componentId, pendingSendFromComponent, componentTransactionIds])

  // Auto-cycle recipients when transactions are sent
  useEffect(() => {
    if (autoCycleRecipients) {
      const currentTransactionCount = transactionHistory.filter(tx =>
        tx.type === 'send' && tx.chain === 'ethereum'
      ).length

      if (currentTransactionCount > lastTransactionCount) {
        // Find current recipient index and cycle to next
        const currentIndex = allowedRecipients.indexOf(selectedRecipient)
        const nextIndex = (currentIndex + 1) % allowedRecipients.length
        setSelectedRecipient(allowedRecipients[nextIndex])
        setLastTransactionCount(currentTransactionCount)
      }
    }
  }, [transactionHistory, autoCycleRecipients, allowedRecipients, selectedRecipient, lastTransactionCount])

  // Quick send amounts
  const quickSendAmounts = useSplitter ? [splitterAmount] : [0.01]

  // Check if there's a pending send transaction to a specific recipient or splitter
  const isPendingSendToRecipient = (recipient: Recipient) => {
    if (useSplitter) {
      return transactionHistory.some(tx =>
        tx.type === 'send' &&
        tx.recipient === 'Splitter' &&
        tx.status === 'pending' &&
        tx.chain === 'ethereum'
      )
    }
    return transactionHistory.some(tx =>
      tx.type === 'send' &&
      tx.recipient === recipient &&
      tx.status === 'pending' &&
      tx.chain === 'ethereum'
    )
  }

  // Check if we've sent money to a specific recipient from this component (confirmed transactions)
  const hasSentMoneyToRecipient = (recipient: Recipient) => {
    if (!componentId) return false // If no componentId, don't show checkmarks

    return transactionHistory.some(tx =>
      tx.type === 'send' &&
      tx.recipient === recipient &&
      tx.status === 'confirmed' &&
      tx.chain === 'ethereum' &&
      componentTransactionIds.has(tx.id)
    )
  }

  const handleQuickSend = (amount: number) => {
    if (amount > 0 && amount <= ethereumState.balance) {
      if (useSplitter) {
        // Send to splitter contract
        if (componentId) {
          setPendingSendFromComponent({
            recipient: 'Splitter',
            amount: amount,
            timestamp: Date.now()
          })
        }
        sendToSplitter('ethereum', amount)
      } else {
        // Regular send to selected recipient
        if (componentId) {
          setPendingSendFromComponent({
            recipient: selectedRecipient,
            amount: amount,
            timestamp: Date.now()
          })
        }
        sendMoney('ethereum', selectedRecipient, amount)
      }
      // The useEffect above will automatically track this transaction if componentId is set
    }
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>

      <h3 className="text-lg font-semibold text-gray-100 mb-4">{t('balanceComponent.yourAccount')}</h3>

      {/* User Address */}
      <div className="mb-4">
        <div className="text-sm font-mono break-all">
          0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
        </div>
      </div>


      {/* Main Balance */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-green-400 mb-2">
          {formatETH(ethereumState.balance)}
        </div>
        <div className="text-sm text-gray-400">{t('balanceComponent.availableBalance')}</div>
      </div>

      {/* Send Action */}
      {showSendAction && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-200">{t('balanceComponent.sendETH')}</h4>
          
          {/* Recipient Selection or Display */}
          {showRecipientSelection ? (
            <div>
              <label className="block text-sm text-gray-400 mb-2 break-all">
                {t('balanceComponent.to')} {useSplitter ? t('balanceComponent.paymentSplitterContract') : getRecipientAddress(selectedRecipient)}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {allowedRecipients.map((recipient) => {
                  const recipientBalance = ethereumState.recipientBalances[recipient] || 0
                  const hasSentMoney = hasSentMoneyToRecipient(recipient)
                  return (
                    <FlashAnimation
                      key={recipient}
                      trigger={recipientBalance}
                      flashColor="bg-blue-400/40"
                      flashType="border"
                      duration={1200}
                    >
                      <button
                        onClick={() => setSelectedRecipient(recipient)}
                        className={`
                          w-full flex flex-col items-center space-y-1 px-3 py-2 rounded-lg border transition-colors cursor-pointer
                          ${selectedRecipient === recipient
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getRecipientEmoji(recipient)}</span>
                          <span className="text-sm font-medium">{recipient}</span>
                          {showSentCheckmarks && hasSentMoney && <span className="text-green-400">✅</span>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatETHTruncated(recipientBalance)}
                        </span>
                      </button>
                    </FlashAnimation>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-400 mb-2 break-all">
                {t('balanceComponent.recipientsEachReceive')} {formatETHTruncated(splitterAmount / 3)}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {allowedRecipients.map((recipient) => {
                  const recipientBalance = ethereumState.recipientBalances[recipient] || 0
                  const hasSentMoney = hasSentMoneyToRecipient(recipient)
                  return (
                    <FlashAnimation
                      key={recipient}
                      trigger={recipientBalance}
                      flashColor="bg-blue-400/40"
                      flashType="border"
                      duration={1200}
                    >
                      <div className="w-full flex flex-col items-center space-y-1 px-3 py-2 rounded-lg border bg-gray-700 border-gray-600 text-gray-300">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getRecipientEmoji(recipient)}</span>
                          <span className="text-sm font-medium">{recipient}</span>
                          {showSentCheckmarks && hasSentMoney && <span className="text-green-400">✅</span>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatETHTruncated(recipientBalance)}
                        </span>
                      </div>
                    </FlashAnimation>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Send Buttons */}
          <div>
            <div className="w-full">
              {quickSendAmounts.map((amount) => {
                const isLoading = disableButtonsOnPending && isPendingSendToRecipient(selectedRecipient)
                const canAfford = amount <= ethereumState.balance
                const shouldDisable = isLoading || !canAfford

                return (
                  <button
                    key={amount}
                    onClick={() => handleQuickSend(amount)}
                    disabled={shouldDisable}
                    className={`
                      w-full relative px-6 py-3 rounded-lg font-medium transition-all cursor-pointer
                      ${!shouldDisable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse-glow'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {useSplitter
                      ? t('balanceComponent.sendToSplitter', { amount: formatETHTruncated(amount) })
                      : t('balanceComponent.sendToRecipient', { amount: formatETHTruncated(amount), recipient: selectedRecipient })
                    }
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {showReceiveAction && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-md font-medium text-gray-200 mb-4">{t('balanceComponent.getETH')}</h4>
          <button
            onClick={receiveETH}
            className="w-full px-6 py-3 rounded-lg font-medium transition-all cursor-pointer bg-green-600 hover:bg-green-700 text-white animate-pulse-glow"
          >
            {t('balanceComponent.receiveETH')}
          </button>
        </div>
      )}
    </div>
  )
}

export default BalanceComponent
