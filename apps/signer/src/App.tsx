import { Toaster } from '@esign/ui'
import { SignerFlow } from './SignerFlow'
import { useTheme } from './lib/use-theme'

export default function App() {
  useTheme()
  return (
    <>
      <SignerFlow />
      <Toaster />
    </>
  )
}
