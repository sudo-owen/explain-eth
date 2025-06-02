import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import BalanceComponent from '../components/BalanceComponent'
import ProfileCards from '../components/ProfileCards'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import BlockAnimation from '../components/BlockAnimation'
import CodeBlock from '../components/CodeBlock'
import TrainAnimation from '../components/TrainAnimation'
import StaticBlockchain from '../components/StaticBlockchain'
import DummyTransactionModal from '../components/DummyTransactionModal'
import SplitAnimation from '../components/SplitAnimation'

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
              Every account has a unique identifier, called an <strong>address</strong>. Your simulated address is <code><span className="break-all">0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</span></code>. Just like how an email address lets you receive emails on the internet, your Ethereum address lets you receive ETH on the Ethereum network.
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
              Of course, instead of packages we're sending ETH. And instead of waiting for the next train, we're waiting 12 seconds for the transactions to be confirmed.
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

            <p className="text-gray-300 leading-relaxed mb-6">
              And once we have more than one block, we have a <b>blockchain</b>. As the name suggests, it's a chain of blocks, or an ordered list of transactions.
            </p>

            {/* Static Blockchain Component */}
            <div className="my-12">
              <StaticBlockchain />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              But what other types of transactions are there?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              In addition to sending ETH around, we can also interact with <b>apps</b> on the Ethereum network. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does that mean? What does an app look like? 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Let's explore deeper.
            </p>


          </section>

          {/* Apps Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Apps</h1>

            <p className="text-gray-300 leading-relaxed mb-6">
              On the Ethereum network, we can receive ETH once we have an account. And once someone else has an account, you can send them ETH. Hopefully the above examples have illustrated that.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              An app on Ethereum is a program that can also send or receive ETH according to its own rules. In blockchain jargon, this type of program is called a <strong>smart contract</strong>.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does this program look like? What kinds of rules can we set? How can it be useful?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Remember that example earlier, where we had to pay Alice, Bob, <em>and</em> Carol one at a time? What if we could automate that?
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Here is an example of a sample smart contract we could write to help with that:
            </p>


            {/* Payment Splitter Code Block */}
            <div className="my-12">
              <CodeBlock
                title="PaymentSplitter.sol"
                code={`PAYMENT SPLITTER PROGRAM\n
WHENEVER THIS PROGRAM RECEIVES ETH:
  SEND 1/3 TO ALICE (0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb)
  SEND 1/3 TO BOB (0x6b175474e89094c44da98b954eedeac495271d0f)
  SEND 1/3 TO CAROL (0xcA11bde05977b3631167028862bE2a173976CA11)
END`}
                className="max-w-2xl mx-auto"
              />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does it do?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              As you might have guessed, it's a payment splitter! Whenever our Payment Splitter smart contract receives ETH, it'll automatically send the right proportion (1/3) to each person.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Now, instead of having to manually send money to every person individually, we can use this simple program.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But how do we "run" this program?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              On Ethereum, all smart contracts have their own address. So to "run" this program, we can send ETH to it, just like how we sent ETH to Alice or Bob. Once the program receives ETH, it will automatically do its thing.
            </p>

            {/* Split Animation */}
            <div className="my-12">
              <SplitAnimation />
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
