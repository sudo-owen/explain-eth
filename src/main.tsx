import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import IntroPage from './pages/IntroPage.tsx'
import AppsPage from './pages/AppsPage.tsx'
import TokensPage from './pages/TokensPage.tsx'
import Apps2Page from './pages/Apps2Page.tsx'
import PlaygroundPage from './pages/PlaygroundPage.tsx'
import { BlockchainProvider } from './contexts/BlockchainContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
