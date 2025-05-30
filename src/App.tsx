import ChainColumn from './components/ChainColumn'
import TransactionModal from './components/TransactionModal'
import { useBlockchain } from './hooks/useBlockchain'
import { Recipient } from './types/blockchain'

function App() {
  const {
    ethereumState,
    rollupState,
    sendMoney,
    purchaseNFT,
    sellNFT,
    depositEarnings,
    withdrawEarnings,
    claimEarnings,
    calculateCurrentEarnings,
    transactionHistory,
    modalState,
    closeModal
  } = useBlockchain()

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Ethereum Mainnet */}
        <ChainColumn
          title="Ethereum Mainnet"
          chainState={ethereumState}
          onSendMoney={(recipient: Recipient, amount: number) => sendMoney('ethereum', recipient, amount)}
          onPurchaseNFT={(nftId: string, price: number, emoji: string) => purchaseNFT('ethereum', nftId, price, emoji)}
          onSellNFT={(nftId: string) => sellNFT('ethereum', nftId)}
          onDepositEarnings={(amount: number) => depositEarnings('ethereum', amount)}
          onWithdrawEarnings={(amount: number) => withdrawEarnings('ethereum', amount)}
          onClaimEarnings={() => claimEarnings('ethereum')}
          currentEarnings={calculateCurrentEarnings(ethereumState)}
          transactionHistory={transactionHistory.filter(tx => tx.chain === 'ethereum')}
          theme="ethereum"
          className="lg:w-1/2 border-r border-gray-700"
        />

        {/* Rollup */}
        <ChainColumn
          title="Rollup"
          chainState={rollupState}
          onSendMoney={(recipient: Recipient, amount: number) => sendMoney('rollup', recipient, amount)}
          onPurchaseNFT={(nftId: string, price: number, emoji: string) => purchaseNFT('rollup', nftId, price, emoji)}
          onSellNFT={(nftId: string) => sellNFT('rollup', nftId)}
          onDepositEarnings={(amount: number) => depositEarnings('rollup', amount)}
          onWithdrawEarnings={(amount: number) => withdrawEarnings('rollup', amount)}
          onClaimEarnings={() => claimEarnings('rollup')}
          currentEarnings={calculateCurrentEarnings(rollupState)}
          transactionHistory={transactionHistory.filter(tx => tx.chain === 'rollup')}
          theme="rollup"
          className="lg:w-1/2 bg-gradient-to-br from-purple-950/20 to-indigo-950/20"
        />
      </div>

      {/* Transaction Modal */}
      {modalState.isOpen && (
        <TransactionModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          message={modalState.message}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default App
