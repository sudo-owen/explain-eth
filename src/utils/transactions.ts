import { ChainState, NFT } from '../types/blockchain'

export const TRANSACTION_DURATION = 12000 // 12 seconds in milliseconds
export const ROLLUP_TRANSACTION_DURATION = 400 // 400ms for rollup
export const EARNINGS_RATE = 0.01 // 1% per second
export const EARNINGS_INTERVAL = 1000 // 1 second in milliseconds

// Transaction fee range in ETH
export const MIN_TRANSACTION_FEE = 0.001
export const MAX_TRANSACTION_FEE = 0.002
export const MIN_ROLLUP_FEE = 0.0001 // 1/10th of mainnet
export const MAX_ROLLUP_FEE = 0.0002

export const generateTransactionFee = (isRollup: boolean = false): number => {
  let fee;
  if (isRollup) {
    // Generate random fee between 0.0001 and 0.0002 ETH for rollup
    fee = MIN_ROLLUP_FEE + Math.random() * (MAX_ROLLUP_FEE - MIN_ROLLUP_FEE)
  } else {
    // Generate random fee between 0.001 and 0.002 ETH for mainnet
    fee = MIN_TRANSACTION_FEE + Math.random() * (MAX_TRANSACTION_FEE - MIN_TRANSACTION_FEE)
  }
  return Math.round(fee * 10000) / 10000 // Round to 4 decimal places

}

export const formatETH = (amount: number): string => {
  return `${amount.toFixed(4)} ETH`
}

export const generateTransactionId = (): string => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const generateNFTId = (): string => {
  return `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const validateSendMoney = (
  chainState: ChainState,
  amount: number,
  fee: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  const totalCost = amount + fee
  if (totalCost > chainState.balance) {
    return { isValid: false, error: `Insufficient balance. Need ${formatETH(totalCost)} (${formatETH(amount)} + ${formatETH(fee)} fee)` }
  }
  return { isValid: true }
}

export const validatePurchaseNFT = (
  chainState: ChainState,
  price: number,
  fee: number
): { isValid: boolean; error?: string } => {
  if (price <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' }
  }
  const totalCost = price + fee
  if (totalCost > chainState.balance) {
    return { isValid: false, error: `Insufficient balance. Need ${formatETH(totalCost)} (${formatETH(price)} + ${formatETH(fee)} fee)` }
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
  amount: number,
  fee: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  const totalCost = amount + fee
  if (totalCost > chainState.balance) {
    return { isValid: false, error: `Insufficient balance. Need ${formatETH(totalCost)} (${formatETH(amount)} + ${formatETH(fee)} fee)` }
  }
  return { isValid: true }
}

export const validateBridge = (
  chainState: ChainState,
  amount: number,
  fee: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' }
  }
  const totalCost = amount + fee
  if (totalCost > chainState.balance) {
    return { isValid: false, error: `Insufficient balance. Need ${formatETH(totalCost)} (${formatETH(amount)} + ${formatETH(fee)} fee)` }
  }
  return { isValid: true }
}

export const calculateSellPrice = (purchasePrice: number): number => {
  // Random multiplier between 0.5 and 2.0 (50% to 200%)
  const multiplier = 0.5 + Math.random() * 1.5
  return Math.round(purchasePrice * multiplier * 100) / 100
}

export const updateEarningsBalance = (chainState: ChainState): number => {
  if (chainState.savingsDeposit === 0) return 0

  const now = new Date()
  const timeDiff = now.getTime() - chainState.savingsLastUpdate.getTime()
  const secondsPassed = timeDiff / EARNINGS_INTERVAL

  if (secondsPassed >= 1) {
    const interest = chainState.savingsDeposit * EARNINGS_RATE * Math.floor(secondsPassed)
    return interest
  }

  return 0
}

export const calculateCurrentEarnings = (chainState: ChainState): number => {
  if (chainState.savingsDeposit <= 0) return 0

  const now = new Date()
  const timeDiff = now.getTime() - chainState.savingsLastUpdate.getTime()
  const secondsPassed = timeDiff / EARNINGS_INTERVAL

  // Calculate total accrued interest (including partial seconds)
  const interest = chainState.savingsDeposit * EARNINGS_RATE * secondsPassed
  return Math.max(0, interest)
}

// Base NFT data with initial prices in ETH
const BASE_NFTS = [
  { id: 'abstract_waves', name: 'Abstract Waves', basePrice: 0.025, emoji: '🌊' },
  { id: 'cosmic_spiral', name: 'Cosmic Spiral', basePrice: 0.015, emoji: '🌌' },
  { id: 'golden_sunset', name: 'Golden Sunset', basePrice: 0.008, emoji: '🌅' },
  { id: 'neon_city', name: 'Neon City', basePrice: 0.012, emoji: '🏙️' },
  { id: 'mystic_forest', name: 'Mystic Forest', basePrice: 0.018, emoji: '🌲' },
  { id: 'digital_rose', name: 'Digital Rose', basePrice: 0.006, emoji: '🌹' },
  { id: 'crystal_mountain', name: 'Crystal Mountain', basePrice: 0.022, emoji: '⛰️' },
  { id: 'electric_storm', name: 'Electric Storm', basePrice: 0.030, emoji: '⚡' },
]

// Global NFT pricing state
let nftPrices: Record<string, number> = {}
let soldNFTs: Set<string> = new Set()

// Initialize prices
BASE_NFTS.forEach(nft => {
  nftPrices[nft.id] = nft.basePrice
})

export const getAvailableNFTs = (): Array<{ id: string; name: string; price: number; emoji: string }> => {
  return BASE_NFTS
    .filter(nft => !soldNFTs.has(nft.id)) // Only show unsold NFTs
    .map(nft => ({
      id: nft.id,
      name: nft.name,
      price: Math.round(nftPrices[nft.id] * 1000) / 1000, // Round to 3 decimal places for ETH
      emoji: nft.emoji
    }))
}

export const markNFTAsSold = (nftId: string) => {
  soldNFTs.add(nftId)
}

export const getNFTCurrentPrice = (nftId: string): number => {
  return nftPrices[nftId] || 0
}

export const updateNFTPrices = () => {
  BASE_NFTS.forEach(nft => {
    // Random walk: +/- 50% of base price
    const basePrice = nft.basePrice
    const minPrice = basePrice * 0.5
    const maxPrice = basePrice * 1.5

    // Current price with some random movement
    const currentPrice = nftPrices[nft.id]
    const changePercent = (Math.random() - 0.5) * 0.2 // +/- 10% change each update
    let newPrice = currentPrice * (1 + changePercent)

    // Clamp to min/max bounds
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice))
    nftPrices[nft.id] = newPrice
  })
}

export const getNFTEmojiByName = (name: string): string => {
  const nft = BASE_NFTS.find(n => n.name === name)
  return nft?.emoji || '🖼️'
}
