import React, { useState, useEffect } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import BalanceComponent from '../components/BalanceComponent'
import ProfileCards from '../components/ProfileCards'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import CircularCountdown from '../components/CircularCountdown'

// Animated Dummy Transaction Modal Component for illustration
const DummyTransactionModal: React.FC = () => {
  const [phase, setPhase] = useState<'pending' | 'confirmed'>('pending')
  const [startTime, setStartTime] = useState(new Date())

  useEffect(() => {
    const cycle = () => {
      // Start with pending
      setPhase('pending')
      setStartTime(new Date())

      // After 12 seconds, show confirmed
      setTimeout(() => {
        setPhase('confirmed')
      }, 12000)

      // After 3 more seconds, restart the cycle
      setTimeout(() => {
        cycle()
      }, 15000)
    }

    cycle()
  }, [])

  const isPending = phase === 'pending'

  return (
    <div className={`max-w-sm mx-auto my-8 bg-gray-800 rounded-lg shadow-xl p-4 border-2 transition-all duration-300 ${
      isPending ? 'border-yellow-500' : 'border-green-500'
    }`}>
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPending ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
          {isPending ? (
            <CircularCountdown
              duration={12000}
              startTime={startTime}
              size={32}
              strokeWidth={3}
              theme="ethereum"
            />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1">
          <h3 className={`text-sm font-medium transition-all duration-300 ${
            isPending ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {isPending ? 'Transaction Pending' : 'Transaction Successful'}
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            {isPending ? 'Sending 0.01 ETH to Alice 👩‍💼...' : 'Sent 0.01 ETH to Alice 👩‍💼'}
          </p>
        </div>
      </div>


    </div>
  )
}

const HomePage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  
  const {
    ethereumState,
    rollupState,
    transactionHistory,
    modalState,
    currentPendingTransaction,
    closeModal
  } = useBlockchainContext()

  return (
    <div className="min-h-screen bg-gray-900 text-white home-page">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Intro Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Intro</h1>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Hi, if you have no idea what <strong>Ethereum</strong>, <strong>blockchains</strong>, and <strong>rollups</strong> are, this essay is for you!
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              If you already have some idea of what any/all of those words mean, or you just want to play around with some interactive animations, by all means feel free to keep reading.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Many ideas presented here will be simplified, so please keep in mind that the actual concepts <em>will</em> be more detailed. (For all the experts in the room, just enjoy the animations.)
            </p>
          </section>

          {/* Ethereum Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Ethereum</h1>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Let's get started. What is Ethereum? Ethereum is a <strong>blockchain network for sending money and running apps</strong>.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              What does that mean?
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Well, a <strong>network</strong> is a group of connected things, like a social network. As long as someone is in the network, you can reach them. Just like how on the Facebook network, you can send a message to anyone as long as they have an account.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              (I know we didn't define <strong>blockchain</strong> yet, don't worry, we'll get to it.)
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-8">
              Like a social media network, we'll need an <strong>account</strong> to get started. And we'll also need some <strong>money</strong>. On Ethereum, the money that we can send around is called ETH.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
               Here, let's give you 1 ETH to get started below. (Self-evident, but I have to say it: All of this isn't real money of course, it's just for the demo)
            </p>

            {/* Balance Component */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Now that you have ETH, you'll be able to send it around to other people and even try some apps (more on this later)!
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Of course, you also need some friends to send money to. Meet Alice, Bob, and Carol. You can click on them to learn a bit more about each friend and decide who you want to send money to.
            </p>

            {/* Profile Cards */}
            <div className="my-12">
              <ProfileCards recipients={['Alice', 'Bob', 'Carol']} />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Now try sending them some ETH!
            </p>

            {/* Balance Component with Send */}
            <div className="my-12">
              <BalanceComponent 
                showSendAction={true} 
                allowedRecipients={['Alice', 'Bob', 'Carol']}
                className="max-w-md mx-auto" 
              />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Nice! You'll notice that after sending ETH, we get this pop-up:
            </p>

            {/* Dummy Transaction Modal */}
            <div className="my-12">
              <DummyTransactionModal />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Once it turns green, this lets you know that the action you took was successful.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              You may have noticed it takes a bit of time to finish sending someone ETH. It's not as long as a bank transfer, but it's definitely a bit slower than for example a Venmo transfer.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Specifically, on Ethereum, it takes <b>around 12 seconds</b> to complete a transaction.
            </p>

            <p className="text-gray-300 leading-relaxed">
              This delay is called the <strong>block time</strong>. For a blockchain, the block time describes about how long you have to wait from when you take an action until when it's <b>confirmed</b>.
            </p>

          </section>

        </article>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <a
              href="/playground"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Go to Playground →
            </a>
          </div>
        </div>

      </div>

      {/* Transaction Modal */}
      {modalState.isOpen && (
        <TransactionModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          message={modalState.message}
          onClose={closeModal}
          pendingTransaction={currentPendingTransaction}
        />
      )}

      {/* Transaction History Overlay */}
      <TransactionHistoryOverlay
        ethereumTransactions={transactionHistory.filter(tx => tx.chain === 'ethereum')}
        rollupTransactions={transactionHistory.filter(tx => tx.chain === 'rollup')}
        ethereumPendingCount={ethereumState.pendingTransactions}
        rollupPendingCount={rollupState.pendingTransactions}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      />
    </div>
  )
}

export default HomePage
