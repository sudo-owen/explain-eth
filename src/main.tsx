import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import PlaygroundPage from './pages/PlaygroundPage.tsx'
import { BlockchainProvider } from './contexts/BlockchainContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BlockchainProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </BlockchainProvider>
    </BrowserRouter>
  </StrictMode>,
)
