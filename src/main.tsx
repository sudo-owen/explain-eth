import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import IntroPage from './pages/IntroPage.tsx'
import AppsPage from './pages/AppsPage.tsx'
import TokensPage from './pages/TokensPage.tsx'
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
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </BlockchainProvider>
    </BrowserRouter>
  </StrictMode>,
)
