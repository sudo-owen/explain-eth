import { Recipient } from '../types/blockchain'

export const getRecipientEmoji = (name: string): string => {
  switch (name) {
    case 'Alice': return '👩'
    case 'Bob': return '👨‍💼'
    case 'Carol': return '👩‍🎨'
    case 'Eve': return '👩‍💻'
    default: return '👤'
  }
}

export const recipients: Recipient[] = ['Alice', 'Bob', 'Carol', 'Eve']
