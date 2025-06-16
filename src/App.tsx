import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import IntroPage from './pages/IntroPage'
import AppsPage from './pages/AppsPage'
import TokensPage from './pages/TokensPage'
import Apps2Page from './pages/Apps2Page'
import PlaygroundPage from './pages/PlaygroundPage'
import { BlockchainProvider } from './contexts/BlockchainContext'

function App() {
  return (
    <BrowserRouter>
      <BlockchainProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/apps2" element={<Apps2Page />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          {/* Catch-all route - redirect any unmatched routes to /intro */}
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </BlockchainProvider>
    </BrowserRouter>
  )
}

export default App
