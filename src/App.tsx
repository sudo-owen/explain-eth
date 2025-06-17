import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import HomePage from './pages/HomePage'
import IntroPage from './pages/IntroPage'
import AppsPage from './pages/AppsPage'
import TokensPage from './pages/TokensPage'
import Apps2Page from './pages/Apps2Page'
import PlaygroundPage from './pages/PlaygroundPage'
import { BlockchainProvider } from './contexts/BlockchainContext'
import LanguageSwitcher from './components/LanguageSwitcher'

const LanguageRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Language route effect:', { lang, currentLang: i18n.language, isInitialized: i18n.isInitialized })
    
    if (!i18n.isInitialized) return
    
    if (lang && ['en', 'zh'].includes(lang)) {
      if (i18n.language !== lang) {
        console.log('Changing language from', i18n.language, 'to', lang)
        i18n.changeLanguage(lang)
      }
    } else if (lang) {
      // Invalid language, redirect to English
      const newPath = location.pathname.replace(`/${lang}`, '/en')
      navigate(newPath, { replace: true })
    }
  }, [lang, i18n, i18n.isInitialized, location.pathname, navigate])

  return (
    <>
      <LanguageSwitcher />
      {children}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <BlockchainProvider>
        <Routes>
          {/* Root redirect to /en/intro */}
          <Route path="/" element={<Navigate to="/en/intro" replace />} />
          
          {/* Language-prefixed routes */}
          <Route path="/:lang" element={<LanguageRouteWrapper><HomePage /></LanguageRouteWrapper>} />
          <Route path="/:lang/intro" element={<LanguageRouteWrapper><IntroPage /></LanguageRouteWrapper>} />
          <Route path="/:lang/apps" element={<LanguageRouteWrapper><AppsPage /></LanguageRouteWrapper>} />
          <Route path="/:lang/tokens" element={<LanguageRouteWrapper><TokensPage /></LanguageRouteWrapper>} />
          <Route path="/:lang/apps2" element={<LanguageRouteWrapper><Apps2Page /></LanguageRouteWrapper>} />
          <Route path="/:lang/playground" element={<LanguageRouteWrapper><PlaygroundPage /></LanguageRouteWrapper>} />
          
          {/* Legacy routes without language prefix - redirect to English */}
          <Route path="/intro" element={<Navigate to="/en/intro" replace />} />
          <Route path="/apps" element={<Navigate to="/en/apps" replace />} />
          <Route path="/tokens" element={<Navigate to="/en/tokens" replace />} />
          <Route path="/apps2" element={<Navigate to="/en/apps2" replace />} />
          <Route path="/playground" element={<Navigate to="/en/playground" replace />} />
          
          {/* Catch-all route - redirect to /en/intro */}
          <Route path="*" element={<Navigate to="/en/intro" replace />} />
        </Routes>
      </BlockchainProvider>
    </BrowserRouter>
  )
}

export default App
