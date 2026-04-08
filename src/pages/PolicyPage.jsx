import { privacyPolicyContent } from '../lib/legalContent.js'
import LegalPage from './LegalPage.jsx'

function PolicyPage() {
  return <LegalPage content={privacyPolicyContent} />
}

export default PolicyPage
