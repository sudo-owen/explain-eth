import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const LanguageSwitcher: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '繁體中文' }
  ]

  const currentLang = lang || 'en'
  
  console.log('LanguageSwitcher render:', { lang, currentLang, pathname: location.pathname })

  const handleLanguageChange = (newLang: string) => {
    const pathSegments = location.pathname.split('/')
    
    if (pathSegments.length > 1 && ['en', 'zh'].includes(pathSegments[1])) {
      pathSegments[1] = newLang
    } else {
      pathSegments.splice(1, 0, newLang)
    }
    
    const newPath = pathSegments.join('/')
    navigate(newPath)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-lg"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher