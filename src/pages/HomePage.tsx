import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()

  useEffect(() => {
    // Redirect to intro page with language prefix
    const currentLang = lang || 'en'
    navigate(`/${currentLang}/intro`)
  }, [navigate, lang])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{t('common.loading')}</h1>
        <p>{t('intro.description')}</p>
      </div>
    </div>
  )
}

export default HomePage
