import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { clerkPublishableKey, hasClerk } from './lib/auth.js'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

createRoot(document.getElementById('root')).render(
  hasClerk ? <ClerkProvider publishableKey={clerkPublishableKey}>{app}</ClerkProvider> : app,
)
