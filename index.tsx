import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Tailwind 스타일 적용 시 필요

const rootElement = document.getElementById('root') as HTMLElement

if (!rootElement) {
  throw new Error("Root element not found")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
