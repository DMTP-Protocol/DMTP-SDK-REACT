import { useCallback, useContext, useEffect, useState } from 'react'
import { KeyPairDMTP, MessageDMTP } from '../core'
import DMTPContext from '../providers/DMTPProvider'
import ApiServices from '../services/api'
import { io } from 'socket.io-client'
import { ethers } from 'ethers'

const getOrCreateDMTPKeyPair = async ({
  setDMTPKeyPair,
  APIKey,
  signMessageAsync,
  signatureState
}: any) => {
  try {
    try {
      const [, setSignatureData] = signatureState

      const { sign, address } = await signMessageAsync()

      const res = await ApiServices.getKeyPair(APIKey, address)
      const result = res.data.data
      if (result) {
        const { private_key, public_key } = result as any
        setDMTPKeyPair({
          privateKey: KeyPairDMTP.decryptDMTPPrivateKey(private_key, `${sign}`),
          publicKey: public_key
        })
      } else {
        const keyPair = KeyPairDMTP.generateNewDMTPKeyPair()
        await ApiServices.submitKeyPair(
          {
            private_key: KeyPairDMTP.encryptDMTPPrivateKey(
              `${sign}`,
              keyPair.DMTP_privateKey
            ),
            public_key: keyPair.DMTP_publicKey
          },
          APIKey,
          `${sign}`,
          address
        )
        setDMTPKeyPair({
          privateKey: keyPair.DMTP_privateKey,
          publicKey: keyPair.DMTP_publicKey
        })
      }
      setSignatureData({
        signature: sign,
        message: address
      })
    } catch (error) {}
  } catch (err) {
    console.error(err)
  }
}

const useSignMessage = () => {
  return {
    signMessageAsync: async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )
      const signer = provider.getSigner()
      const address = await (await signer.getAddress()).toLowerCase()
      const signature = await signer.signMessage(address)
      return {
        sign: signature,
        address
      }
    }
  }
}

const useAccount = () => {
  const [address, setAddress] = useState(null)
  useEffect(() => {
    setAddress((window as any).ethereum.selectedAddress)
    ;(window as any).ethereum.on('accountsChanged', function (accounts: any) {
      if (accounts && accounts.length > 0) setAddress(accounts[0])
    })
  }, [])
  return {
    address
  }
}

const useDMTPKeyPair = (existDMTPPrivateKey?: string) => {
  const context = useContext(DMTPContext)
  if (context === undefined) {
    throw new Error('useDMTPKeyPair must be used within a DMTPProvider')
  }

  const { dmtpKeyPairState, APIKey, signatureState } = context
  const [dmtpKeyPair, setDMTPKeyPair] = dmtpKeyPairState

  const { signMessageAsync } = useSignMessage() as any
  const { address } = useAccount()

  useEffect(() => {
    if (existDMTPPrivateKey) {
      setDMTPKeyPair({
        privateKey: existDMTPPrivateKey,
        publicKey: dmtpKeyPair?.publicKey || ''
      })
    }
  }, [existDMTPPrivateKey])

  return {
    DMTPpublicKey: `${dmtpKeyPair?.publicKey}`,
    getDMTPKeyPair: () =>
      getOrCreateDMTPKeyPair({
        setDMTPKeyPair,
        APIKey,
        wallet_address: `${address}`.toLowerCase(),
        signMessageAsync,
        signatureState
      })
  }
}

const useSNS = () => {
  const context = useContext(DMTPContext)
  if (context === undefined) {
    throw new Error('useDMTPKeyPair must be used within a DMTPProvider')
  }

  const { isShowSNSState, APIKey, signatureState, socketState } = context
  const [, setIsShowSNS] = isShowSNSState
  const [signatureData] = signatureState
  const [socket, setSocket] = socketState

  const [snsData, setSNSData] = useState<{
    discord: string
    telegram: string
  } | null>(null)

  const socketDisconnect = useCallback(() => {
    if (socket) {
      socket.offAny()
      socket.disconnect()
      setSocket(undefined)
    }
  }, [socket])

  const getData = async () => {
    if (!signatureData)
      throw new Error('useDMTPKeyPair must be used before useSNS')
    try {
      const resSNS = await ApiServices.getSNS(
        APIKey,
        signatureData.signature,
        signatureData.message
      )
      setSNSData(resSNS.data.data as any)
      const client = io('http://35.77.41.240', {
        transports: ['websocket'],
        autoConnect: false,
        reconnectionAttempts: 0,
        reconnection: true,
        auth: {
          api_key: APIKey,
          signature: signatureData.signature,
          message: signatureData.message
        },
        path: '/socket.io'
      })
      client.connect()

      client.on('connect', () => {
        console.log('DMTP SDK Connected')
      })
      client.on('connect_error', (err) => {
        console.error(`DMTP SDK connect_error due to ${err.message}`)
      })

      client.on('reconnect', () => {
        console.log('DMTP SDK reconnect')
      })

      client.on('disconnect', (reason) => {
        console.log('DMTP SDK disconnect', reason)
      })
      setSocket(client)
    } catch (error) {
      console.error(`DMTP SDK get sns data: ${error.message}`)
      setSNSData(null)
    }
  }

  const verifyTelegram = async (otp: string) => {
    if (!signatureData)
      throw new Error('useDMTPKeyPair must be used before useSNS')
    try {
      const res = await ApiServices.verifyTelegram(
        APIKey,
        signatureData.signature,
        signatureData.message,
        otp
      )
      if (res.data.data) {
        await getData()
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (socket) socketListen('sns', setSNSData)
    return () => {
      removeAllListeners('sns')
    }
  }, [socket])

  useEffect(() => {
    setSNSData(null)
    if (signatureData) {
      getData()
    }
    window.addEventListener('online', () => {
      if (signatureData) {
        getData()
      }
    })
    window.addEventListener('offline', () => {
      socketDisconnect()
    })
    return () => {
      socketDisconnect()
    }
  }, [APIKey, signatureData])

  const socketListen = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (socket) {
        socket.on(event, listener)
      }
    },
    [socket]
  )

  const removeAllListeners = useCallback(
    (eventName: string) => {
      if (socket) {
        socket.removeAllListeners(eventName)
      }
    },
    [socket]
  )

  return {
    show: () => setIsShowSNS(true),
    hide: () => setIsShowSNS(false),
    snsData,
    verifyTelegram
  }
}

const useSendMessage = (onSuccess?: Function, onError?: Function) => {
  const context = useContext(DMTPContext)
  if (context === undefined) {
    throw new Error('useDMTPKeyPair must be used within a DMTPProvider')
  }

  const { dmtpKeyPairState, APIKey, signatureState } = context
  const [dmtpKeyPair] = dmtpKeyPairState
  const [signatureData] = signatureState
  return async (message: string, to_address: string) => {
    try {
      const res = await ApiServices.getKeyPair(APIKey, to_address)
      const result = res.data.data
      if (result) {
        const { public_key } = result as any
        if (dmtpKeyPair?.privateKey) {
          const sharedKey = KeyPairDMTP.getSharedKey(
            dmtpKeyPair.privateKey,
            public_key
          )
          const messageDataEncrypt = MessageDMTP.encryptMessage(
            {
              content: `<p class="whitespace-pre-line break-all">${message}</p>`,
              images: []
            },
            sharedKey
          )
          if (signatureData) {
            const resSendMessage = await ApiServices.sendMessage(
              {
                message_data: messageDataEncrypt,
                to_address
              },
              APIKey,
              `${signatureData.signature}`,
              `${signatureData.message}`
            )
            if (onSuccess) onSuccess(resSendMessage.data.data)
          } else throw new Error(`useDMTPKeyPair before send message`)
        } else throw new Error(`useDMTPKeyPair before send message`)
      } else {
        throw new Error(`${to_address} is not registered`)
      }
    } catch (error) {
      if (onError) onError(error)
    }
  }
}

export { useDMTPKeyPair, useSNS, useSendMessage }
