import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import BalanceComponent from '../components/BalanceComponent'
import ProfileCards from '../components/ProfileCards'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import TrainAnimation from '../components/TrainAnimation'
import BlockAnimation from '../components/BlockAnimation'
import StaticBlockchain from '../components/StaticBlockchain'
import DummyTransactionModal from '../components/DummyTransactionModal'
import Navigation from '../components/Navigation'
import EthShowcase from '../components/EthShowcase'
import NetworkAnimation from '../components/NetworkAnimation'
import IntroAbstractQuadrant from '../components/IntroAbstractQuadrant'
import { FootnoteProvider, FootnoteRef, FootnoteList } from '../components/Footnote'
import Vocab from '../components/Vocab'

const IntroPage: React.FC = () => {
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
    <FootnoteProvider>
      <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Intro Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Intro</h1>
            
            <p>
              Hi, if you have no idea what <Vocab>Ethereum</Vocab>, <Vocab>blockchains</Vocab>, and <Vocab>smart contracts</Vocab> are, this is for you!
            </p>

            <p>
              This is a series of articles that tries to explain the basics of blockchain in a simplified way. I do my best to avoid heavy math or programming jargon, but there <i>will</i> be some new words and ideas. I try to use real-world examples when possible to help bridge the gap.
            </p>
            
            <p>(For all the experts in the room, just enjoy the animations.)</p>
            
            <p className="mb-4">
              Along the way, we'll cover how blockchains:
            </p>

            {/* Blockchain Capabilities List */}
            <div className="text-gray-300 leading-relaxed mb-6">
              {/* Send/Receive Money */}
              <div className="mb-4">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  <div className="flex-1 text">
                    <span className="text-blue-300">Let us send and receive money 24/7</span>
                  </div>
                </div>
                {/* Mobile-only quadrant */}
                <div className="mt-4 md:hidden">
                  <IntroAbstractQuadrant quadrantType="Send/Receive Money" />
                </div>
              </div>

              {/* Split Bills */}
              <div className="mb-4">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  <div className="flex-1 text">
                    <span className="text-green-300">Automatically split bills</span>
                  </div>
                </div>
                {/* Mobile-only quadrant */}
                <div className="mt-4 md:hidden">
                  <IntroAbstractQuadrant quadrantType="Split Bills" />
                </div>
              </div>

              {/* Earn Interest */}
              <div className="mb-4">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  <div className="flex-1 text">
                    <span className="text-yellow-300">Earn interest on our dollars</span>
                  </div>
                </div>
                {/* Mobile-only quadrant */}
                <div className="mt-4 md:hidden">
                  <IntroAbstractQuadrant quadrantType="Earn Interest" />
                </div>
              </div>

              {/* New Apps */}
              <div className="mb-4">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  <div className="flex-1 text">
                    <span className="text-purple-300">Unlock new types of apps</span>
                  </div>
                </div>
                {/* Mobile-only quadrant */}
                <div className="mt-4 md:hidden">
                  <IntroAbstractQuadrant quadrantType="New Apps" />
                </div>
              </div>
            </div>

            <p>
              And more!
            </p>

            {/* Desktop-only Abstract Quadrant Animation */}
            <div className="mb-12 hidden md:block">
              <IntroAbstractQuadrant />
            </div>

          </section>

          {/* Ethereum Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Ethereum</h1>
            
            <p>
              Let's get started.
            </p>
              
            <p>
              What is Ethereum? Ethereum is a <Vocab>blockchain network</Vocab> for <Vocab>sending money</Vocab> and <Vocab>running apps</Vocab>.
            </p>

            <p>
              What does that mean?
            </p>

            <p>
              In general, a <Vocab>network</Vocab> is a group of connected things, like a social network. As long as something is in the network, you can reach it. Just like how on the Facebook network, you can send a message to anyone as long as they have an account.
            </p>
            
            {/* Network Animation */}
            <div className="my-12">
              <NetworkAnimation />
            </div>

            <p>
              (I know we didn't define <Vocab>blockchain</Vocab> yet, don't worry, we'll get to it.)
            </p>

            <p className="mb-8">
              Like a social media network, you'll need an <Vocab>account</Vocab> to get started using Ethereum. An account will let you receive <Vocab>money</Vocab>. You can receive many types of digital assets with your account.
            </p>

            <p className="mb-8">
              Let's give you a test account to get started:
            </p>

            {/* Balance Component - Account Only */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" />
            </div>
            
            <p className="mb-8">
              Every account has a unique ID, called an <Vocab>address</Vocab>. Your simulated address is <code className="bg-gray-800 px-2 py-1 rounded text-sm break-all">0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</code>. Just like how an email address lets you receive emails on the internet, your Ethereum address lets you receive ETH on the Ethereum network.
            </p>

            <p className="mb-8">
              What is ETH? ETH is the native currency of the Ethereum network. Like Bitcoin, it's another digital currency that you can trade or transfer.
            </p>

            {/* ETH Showcase */}
            <div className="my-12">
              <EthShowcase />
            </div>

            <p className="mb-8">
               Here, let's give you 1 (simulated) ETH to get started below.
            </p>

            {/* Balance Component */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" showReceiveAction={true} />
            </div>

            <p className="mb-8">
              Now that you have some ETH, you can send it around to other people.
            </p>

            <p className="mb-8">
              Let's give you some simulated friends to send money to.
            </p>

            <p className="mb-8">
              Meet Alice, Bob, and Carol.
            </p>

            {/* Profile Cards */}
            <div className="my-12">
              <ProfileCards recipients={['Alice', 'Bob', 'Carol']} />
            </div>

            <p className="mb-8">
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

            <p className="mb-8">
              So far you have sent {totalAmountSent.toFixed(4)} ETH. Nice! After sending ETH, we get the pop-up below. What does it mean?
            </p>

            {/* Dummy Transaction Modal */}
            <div className="my-12">
              <DummyTransactionModal />
            </div>

            <p className="mb-8">
              Once it turns green, your send transaction has been <Vocab>confirmed</Vocab>. This lets you know that it was successful, i.e. that it went through.
            </p>

            <p>
              Sending money on Ethereum isn't instant. It's faster than a bank transfer (no need to wait 1-2 business days), but it's also a little slower than Venmo or Zelle.
            </p>

            <p>
              Specifically, on Ethereum, it takes <Vocab>up to 12 seconds</Vocab> to complete a transaction.
            </p>

            <p>
              Does this mean we can only take one action on Ethereum every 12 seconds? If so, that would be inconvenient.
            </p>

            <p>
              What if we have to send money to multiple people? Do we need to send first to Alice, wait 12 seconds, then send to Bob, wait, and so on?
            </p>

            <p>
              Thankfully, not quite.
            </p>

            <p>
              On Ethereum, we can send out multiple transactions to different accounts. Then, in around 12 seconds, they'll all happen one after another in quick succession.
            </p>

            <p>
              How does that work? Here's an example.
            </p>

            <p className="mb-8">
              Imagine that we're at a train station, and we want to deliver some packages to the next stop. If we have multiple packages to deliver, we can still put them all on the same train, and they'll all get delivered together at the next stop.
            </p>

            {/* Train Animation */}
            <div className="my-12">
              <TrainAnimation />
            </div>

            <p>
              Of course, instead of packages we're sending ETH. And instead of waiting for the next train, we're waiting at most 12 seconds for our transactions to go through.
            </p>

            <p>
              But why does it take 12 seconds at all? Why isn't it instant?
            </p>

            <p>
              It's because of something called <Vocab>block time</Vocab>. On Ethereum, it takes about 12 seconds for the network to create a <Vocab>block</Vocab>.
              <FootnoteRef id="speedup">
                  On average, it's probably closer to 6 seconds, so the animations you see are actually running at 2x speed. But don't worry about this too much.
              </FootnoteRef>This "block" is what makes up the word "blockchain."
            </p>

            <p className="mb-8">
              But what <i>is</i> a block?
            </p>

            <p className="mb-8">
              Think of a block like a train in the animation above. The train arrives on schedule, picks up everyone's transactions, then leaves for its destination.
              <FootnoteRef id="tx-city">
                <a href="https://txcity.io/v/eth-btc" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                  Here
                </a> is an actual real-time visualization for the Ethereum network if you are curious.
              </FootnoteRef>
            </p>

            <p className="mb-8">
              Let's say that you have to pay Alice, Bob, <em>and</em> Carol. All of them. Maybe they each took you out to dinner last week.
            </p>

            <p className="mb-8">
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
                componentId="intro-cycling-balance"
              />
            </div>

            <p className="mb-8">
              When we send out all these different transactions, they get collected into a <Vocab>block</Vocab>. So a block is a list of all the transactions that have happened. And a new block gets published around every 12 seconds.
            </p>

            {/* Block Animation */}
            <div className="my-12">
              <BlockAnimation />
            </div>

            <p>
              Once we have more than one block, we have a <Vocab>blockchain</Vocab>. As the name suggests, it's a chain of blocks, or an ordered list of transactions.
            </p>

            {/* Static Blockchain Component */}
            <div className="my-12">
              <StaticBlockchain />
            </div>

            <p>
              But what other types of transactions are there? So far we've only seen sending and receiving ETH.
            </p>

            <p>
              In addition to sending ETH around, we can also interact with <Vocab>apps</Vocab> on the Ethereum network. These interactions are also transactions!
            </p>

            <p>
              What does that mean? What does an app look like?
            </p>

            <p>
              Let's explore the basics of <Vocab>apps</Vocab>...
            </p>

          </section>

        </article>

        {/* Footnotes */}
        <FootnoteList />

        {/* Navigation */}
        <Navigation />

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
        hideRollupTab={true}
      />
      </div>
    </FootnoteProvider>
  )
}

export default IntroPage
