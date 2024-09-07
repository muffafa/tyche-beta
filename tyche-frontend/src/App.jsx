import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";


import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Your WalletConnect Cloud project ID
const projectId = 'c0a936142eefd15c87ba99b12e710d39'

// 2. Set chains
const eth_sepolia = {
  chainId: 11155111,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://1rpc.io/sepolia'
}

// 3. Create a metadata object
const metadata = {
  name: 'Tyche',
  description: 'Tyche Wallet SDK',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [eth_sepolia],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:network/:address" element={<WalletDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
