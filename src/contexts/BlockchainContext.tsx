import React, { createContext, useContext, ReactNode } from 'react'
import { useBlockchain } from '../hooks/useBlockchain'
import { ChainState, Recipient, Transaction, ModalState } from '../types/blockchain'

interface BlockchainContextType {
  ethereumState: ChainState
  rollupState: ChainState
  sendMoney: (chain: 'ethereum' | 'rollup', recipient: Recipient, amount: number) => void
  purchaseNFT: (chain: 'ethereum' | 'rollup', nftId: string, price: number, emoji: string) => void
  sellNFT: (chain: 'ethereum' | 'rollup', nftId: string) => void
  depositEarnings: (chain: 'ethereum' | 'rollup', amount: number) => void
  withdrawEarnings: (chain: 'ethereum' | 'rollup', amount: number) => void
  claimEarnings: (chain: 'ethereum' | 'rollup') => void
  bridgeToRollup: (amount: number) => void
  calculateCurrentEarnings: (chainState: ChainState) => number
  transactionHistory: Transaction[]
  modalState: ModalState
  currentPendingTransaction: Transaction | null
  closeModal: () => void
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

interface BlockchainProviderProps {
  children: ReactNode
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const blockchainData = useBlockchain()

  return (
    <BlockchainContext.Provider value={blockchainData}>
      {children}
    </BlockchainContext.Provider>
  )
}

export const useBlockchainContext = () => {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error('useBlockchainContext must be used within a BlockchainProvider')
  }
  return context
}
