import React, { useState, useEffect } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import BalanceComponent from '../components/BalanceComponent'
import ProfileCards from '../components/ProfileCards'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import CircularCountdown from '../components/CircularCountdown'

// Train Animation Component
const TrainAnimation: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState<'waiting' | 'loading' | 'moving'>('waiting')
  const [cycleCount, setCycleCount] = useState(0)

  useEffect(() => {
    const runCycle = () => {
      // Phase 1: Waiting (2 seconds)
      setAnimationPhase('waiting')

      setTimeout(() => {
        // Phase 2: Loading boxes (2 seconds)
        setAnimationPhase('loading')

        setTimeout(() => {
          // Phase 3: Moving (3 seconds)
          setAnimationPhase('moving')

          setTimeout(() => {
            // Reset and start next cycle
            setCycleCount(prev => prev + 1)
            runCycle()
          }, 3000)
        }, 2000)
      }, 2000)
    }

    runCycle()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-8 bg-gray-800 rounded-lg">
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg">
        {/* Track */}
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-600"></div>

        {/* Boxes */}
        {animationPhase !== 'waiting' && (
          <>
            {[0, 1, 2].map((index) => (
              <div
                key={`${cycleCount}-${index}`}
                className={`absolute w-8 h-8 transition-all duration-2000 ease-in-out ${
                  animationPhase === 'loading'
                    ? 'bottom-12'
                    : 'bottom-8'
                }`}
                style={{
                  left: animationPhase === 'loading'
                    ? `${20 + index * 40}px`
                    : animationPhase === 'moving'
                    ? `${120 + index * 20}px`
                    : `${20 + index * 40}px`,
                  transform: animationPhase === 'moving' ? 'translateX(300px)' : 'translateX(0)',
                  transition: animationPhase === 'moving' ? 'transform 3s ease-in-out' : 'all 2s ease-in-out'
                }}
              >
                <img
                  src="/img/box.svg"
                  alt="Package"
                  className="w-full h-full"
                  style={{ filter: 'brightness(1.2)' }}
                />
              </div>
            ))}
          </>
        )}

        {/* Train */}
        <div
          className={`absolute bottom-4 w-24 h-16 transition-all duration-3000 ease-in-out ${
            animationPhase === 'moving' ? 'transform translate-x-full' : ''
          }`}
          style={{
            left: '100px',
            transform: animationPhase === 'moving' ? 'translateX(300px)' : 'translateX(0)',
            transition: animationPhase === 'moving' ? 'transform 3s ease-in-out' : 'none'
          }}
        >
          <img
            src="/img/train.svg"
            alt="Train"
            className="w-full h-full"
            style={{ filter: 'brightness(1.2)' }}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-4 text-white text-sm font-medium">
          Train Station
        </div>
        <div className="absolute top-2 right-4 text-white text-sm font-medium">
          Next Stop
        </div>

        {/* Status */}
        <div className="absolute mt-1 left-1/2 transform -translate-x-1/2 text-white text-s">
          {animationPhase === 'waiting' && 'Waiting for packages...'}
          {animationPhase === 'loading' && 'Loading packages onto train...'}
          {animationPhase === 'moving' && 'Train departing!'}
        </div>
      </div>
    </div>
  )
}

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

  // Calculate total amount sent from confirmed send transactions
  const totalAmountSent = transactionHistory
    .filter(tx => tx.type === 'send' && tx.status === 'confirmed')
    .reduce((total, tx) => total + tx.amount, 0)

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
              So far you have sent {totalAmountSent.toFixed(4)} ETH. You'll notice that after sending ETH, we get this pop-up:
            </p>

            {/* Dummy Transaction Modal */}
            <div className="my-12">
              <DummyTransactionModal />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Once it turns green, this lets you know that the action you took was successful.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Sending money on Ethereum isn't instant. It's faster than a bank transfer of course, no need to wait 1-2 business days. But it's also a little slower than Venmo or Zelle.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Specifically, on Ethereum, it takes <b>around 12 seconds</b> to complete a transaction.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Does this mean we can only take one action on Ethereum every 12 seconds? If so, that would be inconvenient.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What if we have to send money to multiple people? Do we need to send first to Alice, wait a full 12 seconds, then send to Bob, wait, and so on?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Thankfully, not exactly.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              On Ethereum, we can send out multiple transactions to different accounts, all one after another. Then, in around 12 seconds, they'll all happen one after another in quick succession.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Imagine that we're at a train station and we want to deliver some packages to the next stop. If we have multiple packages to deliver, we can put them all on the same train, and they'll all get delivered together at the next stop.
            </p>

            {/* Train Animation */}
            <div className="my-12">
              <TrainAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Of course, instead of packages we are sending ETH, and instead of waiting for the next train, we are waiting 12 seconds for confirmation.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But why is it 12 seconds at all? Why isn't it instant?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              The Ethereum block time is 12 seconds because this is how long it takes the Ethereum network to make a <strong>block</strong>. This is the same "block" that makes up part of the word blockchain.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              But what <strong>is</strong> a block?
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Here, let's try another demo. Let's say that you have to pay Alice, Bob, <em>and</em> Carol.
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
