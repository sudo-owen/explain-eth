import { Recipient } from '../types/blockchain'

interface RecipientData {
  emoji: string
  description: string
  backgroundColor: string
}

const recipientData: Record<string, RecipientData> = {
  'Alice': {
    emoji: '👩',
    description: 'Your friend Alice',
    backgroundColor: 'bg-sky-600/40 border-slate-200/60'
  },
  'Bob': {
    emoji: '👨',
    description: 'Your friend Bob',
    backgroundColor: 'bg-blue-600/40 border-slate-200/60'
  },
  'Carol': {
    emoji: '👩‍🦰',
    description: 'Your friend Carol',
    backgroundColor: 'bg-indigo-600/40 border-slate-200/60'
  },
  'Eve': {
    emoji: '🕵️‍♀️',
    description: 'A mysterious stranger',
    backgroundColor: 'bg-gray-800 border-gray-700'
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

export const recipients: Recipient[] = ['Alice', 'Bob', 'Carol', 'Eve']
