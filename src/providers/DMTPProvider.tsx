import React, { useState } from 'react'
import { DmtpSNS } from '../components/DMTPComponent'

interface DMTPContextProps {
  dmtpKeyPairState: [
    {
      publicKey: string
      privateKey: string
    } | null,
    React.Dispatch<
      React.SetStateAction<{
        publicKey: string
        privateKey: string
      } | null>
    >
  ]
  signatureState: [
    {
      signature: string
      message: string
    } | null,
    React.Dispatch<
      React.SetStateAction<{
        signature: string
        message: string
      } | null>
    >
  ]
  APIKey: string
}
export const defaultDMTPContext: DMTPContextProps = {
  dmtpKeyPairState: [null, () => {}],
  signatureState: [null, () => {}],
  APIKey: ''
}
const DMTPContext = React.createContext<DMTPContextProps>(defaultDMTPContext)

export const DMTPProvider = ({
  children,
  APIKey
}: {
  APIKey: string
  children: React.ReactNode
}) => {
  const dmtpKeyPairState = useState<{
    publicKey: string
    privateKey: string
  } | null>(null)

  const signatureState = useState<{
    signature: string
    message: string
  } | null>(null)

  return (
    <DMTPContext.Provider
      value={{
        dmtpKeyPairState,
        APIKey,
        signatureState
      }}
    >
      {children}
      <DmtpSNS text='DMTP SNS : Link Telegram , Discord' />
    </DMTPContext.Provider>
  )
}

export default DMTPContext
