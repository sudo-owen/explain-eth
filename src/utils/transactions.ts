import { ChainState, Transaction, NFT, Recipient } from '../types/blockchain'

export const TRANSACTION_DURATION = 12000 // 12 seconds in milliseconds
export const SAVINGS_RATE = 0.10 // 10% per minute
export const SAVINGS_INTERVAL = 60000 // 1 minute in milliseconds

export const generateTransactionId = (): string => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const generateNFTId = (): string => {
  return `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const validateSendMoney = (
  chainState: ChainState,
  amount: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  if (amount > chainState.balance) {
    return { isValid: false, error: 'Insufficient balance' }
  }
  return { isValid: true }
}

export const validatePurchaseNFT = (
  chainState: ChainState,
  price: number
): { isValid: boolean; error?: string } => {
  if (price <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' }
  }
  if (price > chainState.balance) {
    return { isValid: false, error: 'Insufficient balance' }
  }
  return { isValid: true }
}

export const validateSellNFT = (
  chainState: ChainState,
  nftId: string
): { isValid: boolean; error?: string; nft?: NFT } => {
  const nft = chainState.nfts.find(n => n.id === nftId)
  if (!nft) {
    return { isValid: false, error: 'NFT not found' }
  }
  return { isValid: true, nft }
}

export const validateDepositSavings = (
  chainState: ChainState,
  amount: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  if (amount > chainState.balance) {
    return { isValid: false, error: 'Insufficient balance' }
  }
  return { isValid: true }
}

export const calculateSellPrice = (purchasePrice: number): number => {
  // Random multiplier between 0.5 and 2.0 (50% to 200%)
  const multiplier = 0.5 + Math.random() * 1.5
  return Math.round(purchasePrice * multiplier * 100) / 100
}

export const updateSavingsBalance = (chainState: ChainState): number => {
  if (chainState.savingsDeposit === 0) return 0
  
  const now = new Date()
  const timeDiff = now.getTime() - chainState.savingsLastUpdate.getTime()
  const minutesPassed = timeDiff / SAVINGS_INTERVAL
  
  if (minutesPassed >= 1) {
    const interest = chainState.savingsDeposit * SAVINGS_RATE * Math.floor(minutesPassed)
    return interest
  }
  
  return 0
}

export const getAvailableNFTs = (): Array<{ id: string; name: string; price: number; emoji: string }> => {
  return [
    { id: 'abstract_waves', name: 'Abstract Waves', price: 25, emoji: '🌊' },
    { id: 'cosmic_spiral', name: 'Cosmic Spiral', price: 15, emoji: '🌌' },
    { id: 'golden_sunset', name: 'Golden Sunset', price: 8, emoji: '🌅' },
    { id: 'neon_city', name: 'Neon City', price: 12, emoji: '🏙️' },
    { id: 'mystic_forest', name: 'Mystic Forest', price: 18, emoji: '🌲' },
    { id: 'digital_rose', name: 'Digital Rose', price: 6, emoji: '🌹' },
    { id: 'crystal_mountain', name: 'Crystal Mountain', price: 22, emoji: '⛰️' },
    { id: 'electric_storm', name: 'Electric Storm', price: 30, emoji: '⚡' },
  ]
}
