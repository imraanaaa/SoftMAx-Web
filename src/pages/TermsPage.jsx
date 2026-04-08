import { termsOfServiceContent } from '../lib/legalContent.js'
import LegalPage from './LegalPage.jsx'

function TermsPage() {
  return <LegalPage content={termsOfServiceContent} />
}

export default TermsPage
