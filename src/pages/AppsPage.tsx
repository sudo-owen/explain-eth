import React, { useState } from "react";
import { useBlockchainContext } from "../contexts/BlockchainContext";
import TransactionModal from "../components/TransactionModal";
import TransactionHistoryOverlay from "../components/TransactionHistoryOverlay";
import CodeBlock from "../components/CodeBlock";
import SplitAnimation from "../components/SplitAnimation";
import AbstractQuadrant from "../components/AbstractQuadrant";
import Navigation from "../components/Navigation";
import { FootnoteList, FootnoteProvider, FootnoteRef } from "../components/Footnote";

const AppsPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    ethereumState,
    rollupState,
    transactionHistory,
    modalState,
    currentPendingTransaction,
    closeModal,
  } = useBlockchainContext();

  return (
    <FootnoteProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            {/* Apps Section */}
            <section className="mb-16">
              <h1 className="text-4xl font-bold text-white mb-8">Apps</h1>

              <p className="text-gray-300 leading-relaxed mb-6">
                On the Ethereum network, we can receive ETH once we have an
                account. And once someone else has an account, you can send them
                ETH. Hopefully the previous examples have illustrated that.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                An app on Ethereum is a program that can also send or receive
                ETH according to its own rules. In blockchain jargon, this type
                of program is called a <strong>smart contract</strong>.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                What does this program look like? What kinds of rules can we
                set? How can it be useful?
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Remember that example earlier, where we had to pay Alice, Bob,{" "}
                <em>and</em> Carol one at a time? What if we could automate
                that?
              </p>

              <p className="text-gray-300 leading-relaxed mb-8">
                Let's look at a simplified smart contract  <FootnoteRef id="contract">This is just a simplified example that doesn't use real code, of course. To learn more, check out <a href="https://docs.soliditylang.org/en/v0.8.30/introduction-to-smart-contracts.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Solidity</a>, a programming language used to write smart contracts on Ethereum.</FootnoteRef>:
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
                As you might have guessed, it's a payment splitter! Whenever our
                Payment Splitter smart contract receives ETH, it'll
                automatically send the right proportion (1/3) to each person.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Now, we can use this simple program to send money to everyone at
                once, instead of individually sending everyone ETH one at a
                time.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                But how do we run this program?
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                On Ethereum, all smart contracts have their own address. To run
                this program, we just send ETH to its address, just like how we
                sent ETH to Alice or Bob. Once the program receives ETH, it will
                automatically split the funds.
              </p>

              {/* Split Animation */}
              <div className="my-12">
                <SplitAnimation />
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                Because the split amounts are coded up, it's also very easy to
                change them.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Let's say that Alice, Bob, and Carol all baked cookies for a
                bake sale. Alice has baked half of all the cookies, and Bob and
                Carol each baked a quarter. Let's say they take sales in ETH so
                they tell everyone to send them money to a Payment Splitter
                smart contract.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                How can we change the Payment Splitter program to instead send
                50% to Alice, 25% to Bob, and 25% to Carol?
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                All we need to do is change the percentages we had for each
                person in our smart contract.
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
                Quite simply, we just change the percentages in the smart
                contract. So now whenever anyone sends ETH to this new Payment
                Splitter, it will automatically split the funds according to the
                new percentages.
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
                This is just the tip of the iceberg. There are many other types
                of smart contracts we could write just to handle payments.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                With smart contracts, we can:
              </p>

              <ul className="text-gray-300 leading-relaxed mb-6 list-disc list-inside">
                <li>
                  <span className="text-blue-300">Variable Split:</span> Change the split proportions (we already saw this one)
                </li>
                <li>
                  <span className="text-green-300">Dynamic Recipients:</span> Add or remove recipients (e.g. remove 👩‍🦰 Carol, or we could
                  add 🕵️‍♀️ Eve)
                </li>
                <li>
                  <span className="text-yellow-300">Fee Flow:</span> Charge a processing fee (e.g. send 1% to ourselves, then pass
                  the rest along)
                </li>
                <li>
                  <span className="text-purple-300">Betting:</span> Take in money from 2 people, and pay it out to 1 person (e.g.
                  to settle a bet)
                </li>
              </ul>

              {/* Abstract Quadrant Animation */}
              <div className="my-12">
                <AbstractQuadrant />
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                All of this can let us make very flexible and customizable
                programs to handle payments.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Let's go back to the bake sale example for a second. In a
                hypothetical world, we can sell cookies to people for ETH.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                In the real world, most people won't own the ETH token. They
                might not even know how to get it. But almost everyone will have
                US Dollars in some shape or form (cash, credit, debit, etc.)
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                How can the Ethereum network handle US Dollars?
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Thankfully, as I mentioned at the very beginning, we can use all
                sorts of currencies on the Ethereum network. Including digital
                dollars!
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                Let's explore the basics of <strong>tokens</strong>...
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
          ethereumTransactions={transactionHistory.filter(
            (tx) => tx.chain === "ethereum"
          )}
          rollupTransactions={transactionHistory.filter(
            (tx) => tx.chain === "rollup"
          )}
          ethereumPendingCount={ethereumState.pendingTransactions}
          rollupPendingCount={rollupState.pendingTransactions}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
          hideRollupTab={true}
        />
      </div>
    </FootnoteProvider>
  );
};

export default AppsPage;
