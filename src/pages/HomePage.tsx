import React, { useState, useEffect } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import BalanceComponent from '../components/BalanceComponent'
import ProfileCards from '../components/ProfileCards'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import CircularCountdown from '../components/CircularCountdown'
import BlockAnimation from '../components/BlockAnimation'

// Train Animation Component
const TrainAnimation: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState<'loading' | 'moving'>('loading')
  const [cycleCount, setCycleCount] = useState(0)
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([])
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const runCycle = () => {
      // Phase 1: Loading boxes (1.5 seconds total, staggered)
      setAnimationPhase('loading')
      setVisibleBoxes([])
      setIsMoving(false)

      // Show boxes one by one with 0.5 second delays
      setTimeout(() => setVisibleBoxes([0]), 200)
      setTimeout(() => setVisibleBoxes([0, 1]), 700)
      setTimeout(() => setVisibleBoxes([0, 1, 2]), 1200)

      setTimeout(() => {
        // Phase 2: Moving (4 seconds)
        setAnimationPhase('moving')
        
        // Use requestAnimationFrame to ensure the DOM is ready before triggering animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsMoving(true)
          })
        })

        setTimeout(() => {
          // Reset and start next cycle
          setCycleCount(prev => prev + 1)
          runCycle()
        }, 4000)
      }, 1500)
    }

    runCycle()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto my-12 pb-2 bg-gray-800 rounded-lg">
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg">
        {/* Track */}
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-600"></div>

        {/* Train Unit - moves as one piece */}
        <div
          className="absolute bottom-4 flex items-end space-x-2"
          style={{
            left: '20px',
            transform: isMoving ? 'translateX(calc(100vw + 100px))' : 'translateX(0px)',
            opacity: 1,
            transition: isMoving
              ? 'transform 4000ms ease-in'
              : 'opacity 500ms ease-in-out'
          }}
        >
          {/* Boxes */}
          {visibleBoxes.map((index) => (
            <div
              key={`${cycleCount}-${index}`}
              className="w-8 h-8 transition-all duration-500 ease-out"
              style={{
                opacity: 1,
                transform: 'translateY(-10px)',
                transitionDelay: `${index * 0.5}s`
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

          {/* Train */}
          <div className="w-24 h-16">
            <img
              src="/img/train.svg"
              alt="Train"
              className="w-full h-full"
              style={{ filter: 'brightness(1.2)' }}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-4 text-white text-sm font-bold">
          Train Station
        </div>
        <div className="absolute top-2 right-4 text-white text-sm font-bold">
          Next Stop
        </div>

      </div>
      
      {/* Status */}
      <div className="flex justify-center mt-4">
        <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
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
          <div className="text-gray-300 text-sm mt-1">
            {isPending ? 'Sending 0.01 ETH to Alice 👩‍💼...' : 'Sent 0.01 ETH to Alice 👩‍💼'}
          </div>
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
            
            <p className="text-gray-300 leading-relaxed">
              Many ideas presented here will be simplified, so please keep in mind that the actual concepts <em>will</em> be more detailed. (For all the experts in the room, just enjoy the animations.)
            </p>
          </section>

          {/* Ethereum Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Ethereum</h1>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Let's get started. What is Ethereum? Ethereum is a <strong>blockchain network</strong> for <b>sending money</b> and <strong>running apps</strong>.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              What does that mean?
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Well, a <strong>network</strong> is a group of connected things, like a social network. As long as something is in the network, you can reach it. Just like how on the Facebook network, you can send a message to anyone as long as they have an account.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              (I know we didn't define <strong>blockchain</strong> yet, don't worry, we'll get to it.)
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-8">
              Like a social media network, we'll need an <strong>account</strong> to get started using Ethereum. An account will let you receive <strong>money</strong>. You can receive many types of digital assets with your account, but we will start with ETH, which is the native currency of the Ethereum network.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Let's give you an account.
            </p>

            {/* Balance Component - Account Only */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Every account has a unique identifier, called an <strong>address</strong>. Your simulated address is <code>0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</code>. Just like how an email address lets you receive emails on the internet, your Ethereum address lets you receive ETH on the Ethereum network.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
               Here, let's give you 1 (simulated) ETH to get started below.
            </p>

            {/* Balance Component */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" showReceiveAction={true} />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Now that you have some ETH, you'll be able to send it around to other people.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              You also need some friends to send money to. Meet Alice, Bob, and Carol.
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
              So far you have sent {totalAmountSent.toFixed(4)} ETH. Nice! After sending ETH, we get the pop-up below. What does it mean?
            </p>

            {/* Dummy Transaction Modal */}
            <div className="my-12">
              <DummyTransactionModal />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Once it turns green, your send transaction has been <b>confirmed</b>. This lets you know that it was successful, i.e. that it went through.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Sending money on Ethereum isn't instant. It's faster than a bank transfer; no need to wait 1-2 business days. But it's also a little slower than Venmo or Zelle.
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
              Thankfully, not quite.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              On Ethereum, we can send out multiple transactions to different accounts. Then, in around 12 seconds, they'll all happen one after another in quick succession.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Imagine that we're at a train station, and we want to deliver some packages to the next stop. If we have multiple packages to deliver, we can still put them all on the same train, and they'll all get delivered together at the next stop.
            </p>

            {/* Train Animation */}
            <div className="my-12">
              <TrainAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Of course, instead of packages we are sending ETH. And instead of waiting for the next train, we're waiting 12 seconds for the transactions to be confirmed.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But why is it 12 seconds at all? Why isn't it instant?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              12 second is about how long Ethereum's block time is. This is how long it takes the Ethereum network to make a <strong>block</strong>. This is the same "block" that makes up part of the word "blockchain".
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              But what <i>is</i> a block?
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              A block serves the same purpose as the train in the above animation. It arrives regularly, loads up on transactions, and then leaves for its destination.            
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Let's say that you have to pay Alice, Bob, <em>and</em> Carol. All of them. Maybe they each took you out to dinner last week.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Try sending each of them ETH. (The send button will automatically load the next recipient.)
            </p>

            {/* Balance Component with Auto-Cycling Recipients */}
            <div className="my-12">
              <BalanceComponent
                showSendAction={true}
                allowedRecipients={['Alice', 'Bob', 'Carol']}
                className="max-w-md mx-auto"
                disableButtonsOnPending={false}
                autoCycleRecipients={true}
                showSentCheckmarks={true}
                componentId="homepage-cycling-balance"
              />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              When we send out all these different transactions, they get collected into a <b>block</b>. So a block is a list of all the transactions that have happened, and a new one gets published every 12 seconds.
            </p>

            {/* Block Animation */}
            <div className="my-12">
              <BlockAnimation />
            </div>

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
