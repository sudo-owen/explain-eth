import { Recipient } from '../types/blockchain'

export const getRecipientEmoji = (name: string): string => {
  switch (name) {
    case 'Bob': return '👨‍💼'
    case 'Carol': return '👩‍🎨'
    case 'Eve': return '👩‍💻'
    default: return '👤'
  }
}

export const recipients: Recipient[] = ['Bob', 'Carol', 'Eve']
