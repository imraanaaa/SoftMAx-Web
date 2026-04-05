import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {
  authPagePath,
  clerkPublishableKey,
  defaultAfterAuthUrl,
  hasClerk,
} from './lib/auth.js'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

createRoot(document.getElementById('root')).render(
  hasClerk ? (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl={authPagePath}
      signUpUrl={`${authPagePath}?mode=sign-up`}
      signInFallbackRedirectUrl={defaultAfterAuthUrl}
      signUpFallbackRedirectUrl={defaultAfterAuthUrl}
    >
      {app}
    </ClerkProvider>
  ) : (
    app
  ),
)
