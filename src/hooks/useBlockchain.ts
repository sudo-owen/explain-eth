import { useState, useEffect, useCallback } from 'react'
import {
  ChainType,
  ChainState,
  Transaction,
  ModalState,
  Recipient,
  NFT
} from '../types/blockchain'
import {
  generateTransactionId,
  generateNFTId,
  validateSendMoney,
  validatePurchaseNFT,
  validateSellNFT,
  validateDepositSavings,
  calculateSellPrice,
  updateSavingsBalance,
  TRANSACTION_DURATION
} from '../utils/transactions'

const initialEthereumState: ChainState = {
  balance: 100,
  nfts: [],
  savingsDeposit: 0,
  savingsLastUpdate: new Date(),
  pendingTransactions: 0,
  recipientBalances: {
    Bob: 0,
    Carol: 0,
    Eve: 0
  }
}

const initialRollupState: ChainState = {
  balance: 0,
  nfts: [],
  savingsDeposit: 0,
  savingsLastUpdate: new Date(),
  pendingTransactions: 0,
  recipientBalances: {
    Bob: 0,
    Carol: 0,
    Eve: 0
  }
}

export const useBlockchain = () => {
  const [ethereumState, setEthereumState] = useState<ChainState>(initialEthereumState)
  const [rollupState, setRollupState] = useState<ChainState>(initialRollupState)
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([])
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    message: ''
  })

  // Update savings every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setEthereumState(prev => {
        const interest = updateSavingsBalance(prev)
        if (interest > 0) {
          return {
            ...prev,
            balance: prev.balance + interest,
            savingsLastUpdate: new Date()
          }
        }
        return prev
      })

      setRollupState(prev => {
        const interest = updateSavingsBalance(prev)
        if (interest > 0) {
          return {
            ...prev,
            balance: prev.balance + interest,
            savingsLastUpdate: new Date()
          }
        }
        return prev
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const showModal = useCallback((type: 'success' | 'error', message: string) => {
    setModalState({ isOpen: true, type, message })
    setTimeout(() => {
      setModalState(prev => ({ ...prev, isOpen: false }))
    }, 3000) // Auto-close after 3 seconds
  }, [])

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const updateChainState = useCallback((chain: ChainType, updater: (prev: ChainState) => ChainState) => {
    if (chain === 'ethereum') {
      setEthereumState(updater)
    } else {
      setRollupState(updater)
    }
  }, [])

  const processTransaction = useCallback((transaction: Transaction, stateUpdater?: (prev: ChainState) => ChainState) => {
    // Add transaction to history as pending
    setTransactionHistory(prev => [...prev, transaction])

    // Increment pending transactions count
    updateChainState(transaction.chain, prev => ({
      ...prev,
      pendingTransactions: prev.pendingTransactions + 1
    }))

    // Process transaction after delay
    setTimeout(() => {
      setTransactionHistory(prev =>
        prev.map(tx =>
          tx.id === transaction.id
            ? { ...tx, status: 'confirmed' as const, completionTime: new Date() }
            : tx
        )
      )

      // Apply the state changes when transaction is confirmed
      if (stateUpdater) {
        updateChainState(transaction.chain, stateUpdater)
      }

      // Decrement pending transactions count
      updateChainState(transaction.chain, prev => ({
        ...prev,
        pendingTransactions: prev.pendingTransactions - 1
      }))

      showModal('success', `Transaction confirmed: ${transaction.type.replace('_', ' ')}`)
    }, TRANSACTION_DURATION)
  }, [updateChainState, showModal])

  const sendMoney = useCallback((chain: ChainType, recipient: Recipient, amount: number) => {
    const chainState = chain === 'ethereum' ? ethereumState : rollupState
    const validation = validateSendMoney(chainState, amount)

    if (!validation.isValid) {
      showModal('error', validation.error!)
      return
    }

    const transaction: Transaction = {
      id: generateTransactionId(),
      chain,
      type: 'send',
      amount,
      recipient,
      status: 'pending',
      timestamp: new Date()
    }

    // Define the state update to apply when transaction is confirmed
    const stateUpdater = (prev: ChainState) => ({
      ...prev,
      balance: prev.balance - amount,
      recipientBalances: {
        ...prev.recipientBalances,
        [recipient]: prev.recipientBalances[recipient] + amount
      }
    })

    processTransaction(transaction, stateUpdater)
  }, [ethereumState, rollupState, showModal, processTransaction])

  const purchaseNFT = useCallback((chain: ChainType, nftId: string, price: number, emoji: string) => {
    const chainState = chain === 'ethereum' ? ethereumState : rollupState
    const validation = validatePurchaseNFT(chainState, price)

    if (!validation.isValid) {
      showModal('error', validation.error!)
      return
    }

    const newNFT: NFT = {
      id: generateNFTId(),
      name: nftId,
      purchasePrice: price,
      purchaseDate: new Date(),
      emoji
    }

    const transaction: Transaction = {
      id: generateTransactionId(),
      chain,
      type: 'purchase_nft',
      amount: price,
      nftId: newNFT.id,
      status: 'pending',
      timestamp: new Date()
    }

    // Define the state update to apply when transaction is confirmed
    const stateUpdater = (prev: ChainState) => ({
      ...prev,
      balance: prev.balance - price,
      nfts: [...prev.nfts, newNFT]
    })

    processTransaction(transaction, stateUpdater)
  }, [ethereumState, rollupState, showModal, processTransaction])

  const sellNFT = useCallback((chain: ChainType, nftId: string) => {
    const chainState = chain === 'ethereum' ? ethereumState : rollupState
    const validation = validateSellNFT(chainState, nftId)

    if (!validation.isValid) {
      showModal('error', validation.error!)
      return
    }

    const sellPrice = calculateSellPrice(validation.nft!.purchasePrice)

    const transaction: Transaction = {
      id: generateTransactionId(),
      chain,
      type: 'sell_nft',
      amount: sellPrice,
      nftId,
      status: 'pending',
      timestamp: new Date()
    }

    // Define the state update to apply when transaction is confirmed
    const stateUpdater = (prev: ChainState) => ({
      ...prev,
      balance: prev.balance + sellPrice,
      nfts: prev.nfts.filter(nft => nft.id !== nftId)
    })

    processTransaction(transaction, stateUpdater)
  }, [ethereumState, rollupState, showModal, processTransaction])

  const depositSavings = useCallback((chain: ChainType, amount: number) => {
    const chainState = chain === 'ethereum' ? ethereumState : rollupState
    const validation = validateDepositSavings(chainState, amount)

    if (!validation.isValid) {
      showModal('error', validation.error!)
      return
    }

    const transaction: Transaction = {
      id: generateTransactionId(),
      chain,
      type: 'deposit_savings',
      amount,
      status: 'pending',
      timestamp: new Date()
    }

    // Define the state update to apply when transaction is confirmed
    const stateUpdater = (prev: ChainState) => ({
      ...prev,
      balance: prev.balance - amount,
      savingsDeposit: prev.savingsDeposit + amount,
      savingsLastUpdate: new Date()
    })

    processTransaction(transaction, stateUpdater)
  }, [ethereumState, rollupState, showModal, processTransaction])

  return {
    ethereumState,
    rollupState,
    transactionHistory,
    modalState,
    sendMoney,
    purchaseNFT,
    sellNFT,
    depositSavings,
    closeModal
  }
}
