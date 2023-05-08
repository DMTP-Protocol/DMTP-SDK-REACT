/* eslint-disable camelcase */
import React, { useState } from 'react'
import { Socket } from 'socket.io-client'

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
  dappAddress: string
  isDev: boolean
  isShowSNSState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  socketState: [
    Socket | undefined,
    React.Dispatch<React.SetStateAction<Socket | undefined>>
  ]
}
const defaultDMTPContext: DMTPContextProps = {
  dmtpKeyPairState: [null, () => {}],
  signatureState: [null, () => {}],
  APIKey: '',
  dappAddress: '',
  isDev: false,
  isShowSNSState: [false, () => {}],
  socketState: [undefined, () => {}]
}
const DMTPContext = React.createContext<DMTPContextProps>(defaultDMTPContext)

export const DMTPProvider = ({
  children,
  APIKey,
  dappAddress,
  isDev = false
}: {
  APIKey: string
  dappAddress: string
  isDev: boolean
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

  const isShowSNSState = useState<boolean>(false)
  const socketState = useState<Socket | undefined>(undefined)

  return (
    <DMTPContext.Provider
      value={{
        dmtpKeyPairState,
        APIKey,
        dappAddress,
        signatureState,
        isShowSNSState,
        socketState,
        isDev
      }}
    >
      {children}
    </DMTPContext.Provider>
  )
}

export default DMTPContext
