import { useContext, useEffect, useState } from 'react'
import { KeyPairDMTP, MessageDMTP } from '../core'
import DMTPContext from '../providers/DMTPProvider'
import ApiServices from '../services/api'
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

  const { isShowSNSState } = context
  const [, setIsShowSNS] = isShowSNSState
  return {
    show: () => setIsShowSNS(true),
    hide: () => setIsShowSNS(false),
    snsData: {
      discord: {
        id: '123456789'
      },
      telegram: {
        id: '123456789'
      }
    }
  }
}

const useSendMessage = (onSuccess?: Function, onError?: Function) => {
  const context = useContext(DMTPContext)
  if (context === undefined) {
    throw new Error('useDMTPKeyPair must be used within a DMTPProvider')
  }

  const { dmtpKeyPairState, APIKey,signatureState } = context
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
              message
            },
            sharedKey
          )
          if (signatureData) {
            const resSendMessage = await ApiServices.sendMessage(
              {
                message: messageDataEncrypt,
                to_address
              },
              APIKey,
              `${signatureData.signature}`,
              `${signatureData.message}`
            )
          if (onSuccess) onSuccess(resSendMessage.data.data)
          }else throw new Error(`useDMTPKeyPair before send message`)
         
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
