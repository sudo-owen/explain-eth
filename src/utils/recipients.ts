import { Recipient } from '../types/blockchain'

interface RecipientData {
  emoji: string
  description: string
  backgroundColor: string
  address: string
}

const recipientData: Record<string, RecipientData> = {
  'Alice': {
    emoji: '👩',
    description: 'Your friend Alice',
    backgroundColor: 'bg-sky-600/40 border-slate-200/60',
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
  },
  'Bob': {
    emoji: '👨',
    description: 'Your friend Bob',
    backgroundColor: 'bg-blue-600/40 border-slate-200/60',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f'
  },
  'Carol': {
    emoji: '👩‍🦰',
    description: 'Your friend Carol',
    backgroundColor: 'bg-indigo-600/40 border-slate-200/60',
    address: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  'Eve': {
    emoji: '🕵️‍♀️',
    description: 'A mysterious stranger',
    backgroundColor: 'bg-yellow-800 border-yellow-700',
    address: '0x0000000000000000000000000000000000000000'
  }
}

export const getRecipientEmoji = (name: string): string => {
  return recipientData[name]?.emoji || '👤'
}

export const getRecipientDescription = (name: string): string => {
  return recipientData[name]?.description || 'A friend'
}

export const getRecipientBackgroundColor = (name: string): string => {
  return recipientData[name]?.backgroundColor || 'bg-gray-800 border-gray-700'
}

export const getRecipientAddress = (name: string): string => {
  return recipientData[name]?.address || '0x0000000000000000000000000000000000000000'
}

export const getRecipientAddressTruncated = (name: string): string => {
  const address = getRecipientAddress(name)
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const recipients: Recipient[] = ['Alice', 'Bob', 'Carol', 'Eve']
