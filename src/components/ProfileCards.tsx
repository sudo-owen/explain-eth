import React from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import { Recipient } from '../types/blockchain'
import { formatETH } from '../utils/transactions'
import FlashAnimation from './FlashAnimation'

interface ProfileCardsProps {
  recipients?: Recipient[]
  className?: string
}

const ProfileCards: React.FC<ProfileCardsProps> = ({
  recipients = ['Alice', 'Bob', 'Carol'],
  className = ''
}) => {
  const { ethereumState } = useBlockchainContext()

  const getRecipientEmoji = (recipient: string) => {
    const emojiMap: Record<string, string> = {
      'Alice': '👩',
      'Bob': '👨',
      'Carol': '👩‍🦰',
      'Eve': '🕵️‍♀️'
    }
    return emojiMap[recipient] || '👤'
  }

  const getRecipientDescription = (recipient: string) => {
    const descriptions: Record<string, string> = {
      'Alice': 'Your friend Alice',
      'Bob': 'Your friend Bob',
      'Carol': 'Your friend Carol',
      'Eve': 'A mysterious stranger'
    }
    return descriptions[recipient] || 'A friend'
  }

  const getRecipientBackgroundColor = (recipient: string) => {
    const backgroundColors: Record<string, string> = {
      'Alice': 'bg-sky-600/40 border-slate-200/60',
      'Bob': 'bg-blue-600/40 border-slate-200/60', 
      'Carol': 'bg-indigo-600/40 border-slate-200/60',
      'Eve': 'bg-gray-800 border-gray-700'
    }
    return backgroundColors[recipient] || 'bg-gray-800 border-gray-700'
  }

  return (
    <div className={`${className}`}>
      <div className="flex space-x-4 justify-center">
        {recipients.map((recipient) => {
          const balance = ethereumState.recipientBalances[recipient] || 0
          return (
            <FlashAnimation
              key={recipient}
              trigger={balance}
              flashColor="bg-green-400/40"
              duration={1500}
            >
              <div
                className={`${getRecipientBackgroundColor(recipient)} rounded-lg p-4 text-center hover:brightness-110 transition-all cursor-pointer`}
              >
                <div className="text-4xl mb-2">{getRecipientEmoji(recipient)}</div>
                <div className="text-lg font-semibold text-gray-100 mb-1">{recipient}</div>
                <div className="text-sm text-gray-400 mb-2">{getRecipientDescription(recipient)}</div>
                <div className="text-sm font-medium text-green-400">
                  {formatETH(balance)}
                </div>
              </div>
            </FlashAnimation>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileCards
