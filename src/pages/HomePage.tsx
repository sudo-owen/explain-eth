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
              Hi, if you have no idea what <strong>Ethereum</strong>, <strong>blockchains</strong>, and <strong>smart contracts</strong> are, this essay is for you!
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Many ideas presented here will be simplified, so please keep in mind that the actual concepts <em>will</em> be more detailed. (For all the experts in the room, just enjoy the animations.)
            </p>
          </section>

          {/* Ethereum Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">What's Ethereum</h1>
            
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
              Like a social media network, you'll need an <strong>account</strong> to get started using Ethereum. An account will let you receive <strong>money</strong>. You can receive many types of digital assets with your account. week'll start with ETH, which is the native currency of the Ethereum network.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Let's give you a test account to get started:
            </p>

            {/* Balance Component - Account Only */}
            <div className="my-12">
              <BalanceComponent className="max-w-md mx-auto" />
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              Every account has a unique ID, called an <strong>address</strong>. Your simulated address is <code><span className="break-all">0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</span></code>. Just like how an email address lets you receive emails on the internet, your Ethereum address lets you receive ETH on the Ethereum network.
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
              Sending money on Ethereum isn't instant. It's faster than a bank transfer (no need to wait 1-2 business days), but it's also a little slower than Venmo or Zelle.
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
              Of course, instead of packages we're sending ETH. And instead of waiting for the next train, we're waiting about 12 seconds for our transactions to go thorugh.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But why does it 12 seconds at all? Why isn't it instant?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              It's because of something called <b>block time</b>. On Ethereum, it takes about 12 seconds for the network to create a <b>block</b>. This “block” is what makes up the word “blockchain.”
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              But what <i>is</i> a block?
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Think of a block like a train in the animation above. The train arrives on schedule, picks up everyone’s transactions, then leaves for its destination.       
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
              Let's explore the basics of <b>apps</b>...
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
              Let's look at a simplified smart contract:
            </p>


            {/* Payment Splitter Code Block */}
            <div className="my-12">
              <CodeBlock
                title="PaymentSplitter.sol"
                code={`PAYMENT SPLITTER PROGRAM\n
WHENEVER THIS PROGRAM RECEIVES ETH:
  SEND 33% TO 👩 ALICE (0xb47...),
  AND SEND 33% TO 👨 BOB (0x6b1...),
  AND SEND 33% TO 👩‍🦰 CAROL (0xcA1...)
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
              Now, we can use this simple program to send money to everyone at once, instead of individually sending everyone ETH one at a time.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But how do we run this program?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              On Ethereum, all smart contracts have their own address. To run this program, we just send ETH to its address, just like how we sent ETH to Alice or Bob. Once the program receives ETH, it will automatically split the funds.
            </p>

            {/* Split Animation */}
            <div className="my-12">
              <SplitAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Because the split amounts are coded up, it's also very easy to change them.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Let's say that Alice, Bob, and Carol all baked cookies for a bake sale. Alice has baked half of all the cookies, and Bob and Carol each baked a quarter. Let's say they take sales in ETH so they tell everyone to send them money to a Payment Splitter smart contract.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              How can we change the Payment Splitter program to instead send 50% to Alice, 25% to Bob, and 25% to Carol?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              All we need to do is change the percentages we had for each person in our smart contract.
            </p>

            {/* Payment Splitter Code Block with Animation */}
            <div className="my-12">
              <CodeBlock
                title="PaymentSplitter2.sol"
                animatePercentages={true}
                className="max-w-2xl mx-auto"
              />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Quite simply, we just change the percentages in the smart contract. So now whenever anyone sends ETH to this new Payment Splitter, it will automatically split the funds according to the new percentages.
            </p>

            {/* Split Animation with 50/25/25 split */}
            <div className="my-12">
              <SplitAnimation
                alicePercent={50}
                bobPercent={25}
                carolPercent={25}
                totalAmount={0.3}
              />
            </div>
          </section>

          {/* Additional Smart Contract Capabilities */}
          <section className="mb-16">
            <p className="text-gray-300 leading-relaxed mb-6">
              This is just the tip of the iceberg. There are many other types of smart contracts we could write just to handle payments.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              With smart contracts, we can:
            </p>

            <ul className="text-gray-300 leading-relaxed mb-6 list-disc list-inside">
              <li>Change the split proportions (we already saw this one)</li>
              <li>Add or remove recipients (e.g. remove 👩‍🦰 Carol, or we could add 🕵️‍♀️ Eve)</li>
              <li>Charge a processing fee (e.g. send 1% to ourselves, then pass the rest along)</li>
              <li>Take in money from 2 people, and pay it out to 1 person (e.g. to settle a bet)</li>
            </ul>

            <p className="text-gray-300 leading-relaxed mb-6">
              All of this can let us make very flexible and customizable programs to handle payments.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Let's go back to the bake sale example for a second. In a hypothetical world, we can sell cookies to people for ETH.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              In the real world, most people won't own the ETH token. They might not even know how to get it. But almost everyone will have US Dollars in some shape or form (cash, credit, debit, etc.)
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              How can the Ethereum network handle US Dollars?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Thankfully, as I mentioned at the very beginning, we can use all sorts of currencies on the Ethereum network. Including digital dollars!
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Let's explore the basics of <strong>tokens</strong>...
            </p>
          </section>

          {/* Tokens Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Tokens</h1>

            <p className="text-gray-300 leading-relaxed mb-6">
              token placeholder shit
            </p>
          </section>

        </article>

        {/* Navigation */}
        {/* <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <a
              href="/playground"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Go to Playground →
            </a>
          </div>
        </div> */}

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
