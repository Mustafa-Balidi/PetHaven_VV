import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import i18n from './i18n/index.js'
import './index.css'
import './Styling/a11y.css'
import './Styling/Theme.css'

function syncDocumentLanguage(language) {
  const normalizedLanguage = language?.startsWith('ar') ? 'ar' : 'en'
  document.documentElement.dir = normalizedLanguage === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = normalizedLanguage
}

syncDocumentLanguage(i18n.resolvedLanguage || i18n.language)
i18n.on('languageChanged', syncDocumentLanguage)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
