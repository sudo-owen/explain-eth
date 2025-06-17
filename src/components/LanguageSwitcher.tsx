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

  const handleLanguageChange = (newLang: string) => {
    const currentLang = lang || 'en'
    const currentPath = location.pathname
    
    // Replace the current language in the URL with the new language
    let newPath = currentPath
    if (currentPath.startsWith(`/${currentLang}`)) {
      newPath = currentPath.replace(`/${currentLang}`, `/${newLang}`)
    } else {
      // If no language prefix, add one
      newPath = `/${newLang}${currentPath}`
    }
    
    navigate(newPath)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={lang || 'en'}
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