export type ChainType = 'ethereum' | 'rollup'

export type Recipient = 'Bob' | 'Carol' | 'Eve'

export interface NFT {
  id: string
  name: string
  purchasePrice: number
  purchaseDate: Date
  emoji: string
}

export interface ChainState {
  balance: number
  nfts: NFT[]
  savingsDeposit: number
  savingsLastUpdate: Date
  pendingTransactions: number
  recipientBalances: Record<Recipient, number>
  pendingSells: Set<string> // NFT IDs that have pending sell transactions
}

export interface Transaction {
  id: string
  chain: ChainType
  type: 'send' | 'purchase_nft' | 'sell_nft' | 'deposit_earnings' | 'withdraw_earnings' | 'claim_earnings' | 'bridge'
  amount: number
  fee: number // Transaction fee in ETH
  recipient?: Recipient
  nftId?: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: Date
  completionTime?: Date
  errorMessage?: string
}

export interface ModalState {
  isOpen: boolean
  type: 'success' | 'error'
  message: string
}

export interface BlockchainState {
  ethereum: ChainState
  rollup: ChainState
  transactionHistory: Transaction[]
  modalState: ModalState
}
