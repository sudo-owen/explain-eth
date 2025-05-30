import React, { useState, useEffect } from 'react'
import { Recipient } from '../types/blockchain'
import { getRecipientEmoji } from '../utils/recipients'

interface CharacterDialogueProps {
  character: Recipient
  balance: number
  isVisible: boolean
  onComplete: () => void
  className?: string
}

// Dialogue data based on personality and wealth levels
const dialogueData: Record<Recipient, {
  personality: string
  dialogues: {
    broke: string[]
    poor: string[]
    comfortable: string[]
    wealthy: string[]
  }
}> = {
  Alice: {
    personality: 'funny',
    dialogues: {
      broke: [
        "I'm so broke, can't even afford to pay attention! 😅",
        "My wallet's empty, my dating life's just as tempty! 💸",
        "I have ninety-nine problems and funds are the fun one! 🤷‍♀️",
        "Being broke is no joke, but my humor's no hoax! 😂"
      ],
      poor: [
        "Finally! Some change to exchange for coffee! ☕",
        "Look at me, living fancy with pocket money! 💅",
        "I'm basically the Warren Buffett of pocket stuff-it! 📈",
        "This coin's burning, my pocket's yearning! 🔥"
      ],
      comfortable: [
        "Now we're talking, no more financial walking! 🍜",
        "With great wealth comes great stealth... in buying memes! 🎭",
        "I'm feeling so rich, might tip without a glitch! 💰",
        "Time to update my profile: 'Crypto Lifestyle'! ✨"
      ],
      wealthy: [
        "I'm so rich, I switch coins for bookmarks! 📚",
        "They see me rollin', they're trollin' my balance! 🎵",
        "I don't always check wealth, but when I do, it's true! 😎",
        "Rich enough to buy Twitter... but that ship has sailed! 🐦"
      ]
    }
  },
  Bob: {
    personality: 'serious',
    dialogues: {
      broke: [
        "This concerning state requires attention with intention.",
        "I must reassess with finesse my risk protocols.",
        "The current balance demands guidance for diversified streams.",
        "Financial literacy is priority with clarity indeed."
      ],
      poor: [
        "A modest start, a work of art for portfolio building.",
        "This foundation with dedication shall support wealth creation.",
        "Small amounts with careful counts compound through time.",
        "I shall allocate with care and fate, following reason's season."
      ],
      comfortable: [
        "Acceptable balance with valance providing flexibility.",
        "Strategic investments with commitments maintaining liquidity.",
        "The portfolio shows growth that glows with diversification.",
        "I can consider with wonder instruments of sophistication."
      ],
      wealthy: [
        "Excellent reflection of sound planning with commanding execution.",
        "Accumulation with calculation demonstrates disciplined construction.",
        "I shall focus with locus on preservation and optimization.",
        "This positions with precision for independence and deliverance."
      ]
    }
  },
  Carol: {
    personality: 'miserly',
    dialogues: {
      broke: [
        "Every penny's plenty! I track each fraction with action! 💰",
        "This is unacceptable! I must hoard with accord! 😤",
        "I'm calculating with fascination the cost of each breath! 📊",
        "Zero balance means zero spending - discipline with precision! 🔒"
      ],
      poor: [
        "Finally! But not a single jingle shall I waste! 💎",
        "This coin joins my mattress stash with a dash! 🛏️",
        "I'll guard this treasure with pleasure like a dragon! 🐉",
        "Every fee's a spree of theft from my wealth! 😠"
      ],
      comfortable: [
        "Good mood, but I could have MORE in store! 📈",
        "Rich enough to afford... nothing more, that's for sure! 🚫",
        "This balance is nice with spice, but compound interest is dearest! 💹",
        "I'm saving with craving, my wealth's behaving! 🏦"
      ],
      wealthy: [
        "Excellent! Now I can be tight with delight! 💸",
        "Rich enough to buy with a sigh, too cheap to keep! 🛒",
        "My wealth grows with flows while others spend and bend! 📊",
        "So wealthy and stealthy, I charge myself rent for each thought! 🏠"
      ]
    }
  },
  Eve: {
    personality: 'mysterious',
    dialogues: {
      broke: [
        "Interesting... surveillance with vigilance reveals priorities.",
        "Zero balance with valence. Perfect anonymity in harmony.",
        "The absence of wealth with stealth is sometimes the greatest treasure.",
        "Empty wallets with mallets tell stories that intrigue and fatigue..."
      ],
      poor: [
        "Small amounts with counts... easier to move with groove undetected.",
        "Modest holdings with moldings. The wise disguise discretion's protection.",
        "This balance with valance serves my purposes... for now, somehow.",
        "Sometimes smallest with tallest moves hide secrets of connection."
      ],
      comfortable: [
        "Sufficient funds with runs for my... operations, no questions or suggestions.",
        "This amount with count provides perfect cover for my sessions.",
        "Comfortable enough to blend and bend, avoiding attention's prevention.",
        "The ideal balance with valance for one who shadows with echoes."
      ],
      wealthy: [
        "Wealth brings visibility with ability. Visibility brings... complications.",
        "Rich enough to fund with stunned operations, discrete in relations.",
        "This fortune with portion opens doors... and closes with poses.",
        "With great wealth and stealth comes responsibility... and revelations."
      ]
    }
  }
}

const getWealthLevel = (balance: number): keyof typeof dialogueData.Alice.dialogues => {
  if (balance === 0) return 'broke'
  if (balance < 0.1) return 'poor'
  if (balance < 0.5) return 'comfortable'
  return 'wealthy'
}

const getRandomDialogue = (character: Recipient, balance: number): string => {
  const wealthLevel = getWealthLevel(balance)
  const characterData = dialogueData[character]
  
  if (!characterData) return "Hello there!"
  
  const dialogues = characterData.dialogues[wealthLevel]
  return dialogues[Math.floor(Math.random() * dialogues.length)]
}

const CharacterDialogue: React.FC<CharacterDialogueProps> = ({
  character,
  balance,
  isVisible,
  onComplete,
  className = ''
}) => {
  const [dialogue, setDialogue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setDialogue(getRandomDialogue(character, balance))
      setIsAnimating(true)

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          onComplete()
        }, 300) // Wait for fade out animation
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [character, balance, isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className={`absolute z-50 ${className}`}>
      {/* Speech Bubble */}
      <div
        className={`
          relative bg-gray-800 text-gray-100 rounded-lg shadow-xl p-4 max-w-sm w-80 border border-gray-600
          transition-all duration-300 ease-in-out transform
          ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}
        `}
      >
        {/* Speech Bubble Tail */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>

        {/* Character Emoji */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-lg">{getRecipientEmoji(character)}</div>
          <div className="text-sm font-semibold text-gray-200">{character}</div>
        </div>

        {/* Dialogue Text */}
        <p className="text-sm text-gray-100 leading-relaxed">{dialogue}</p>
      </div>
    </div>
  )
}

export default CharacterDialogue
