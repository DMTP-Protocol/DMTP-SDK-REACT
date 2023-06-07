import { AES, enc } from 'crypto-js'
import keccak256 from 'keccak256'
import { Buffer } from 'buffer'
const { createECDH } = require('crypto-browserify')

class MessageDMTP {
  public static decryptMessage(message_data: string, shared_key: string) {
    const decryptMessage = AES.decrypt(
      message_data,
      keccak256(shared_key).toString('hex')
    ).toString(enc.Utf8)
    return JSON.parse(Buffer.from(decryptMessage, 'hex').toString())
  }

  public static encryptMessage(message_data: Object, shared_key: string) {
    return AES.encrypt(
      Buffer.from(JSON.stringify(message_data)).toString('hex'),
      keccak256(shared_key).toString('hex')
    ).toString()
  }
}

class KeyPairDMTP {
  public static decryptDMTPPrivateKey(
    dmtpPrivateKey: string,
    secretKey: string
  ): string {
    return AES.decrypt(
      dmtpPrivateKey,
      keccak256(secretKey).toString('hex')
    ).toString(enc.Utf8)
  }

  public static generateNewDMTPKeyPair(): {
    DMTP_privateKey: string
    DMTP_publicKey: string
  } {
    const client = createECDH('secp256k1')
    client.generateKeys()
    return {
      DMTP_privateKey: client.getPrivateKey('hex'),
      DMTP_publicKey: client.getPublicKey('hex')
    }
  }

  public static encryptDMTPPrivateKey(signature: string, text: string) {
    return AES.encrypt(text, keccak256(signature).toString('hex')).toString()
  }

  public static getSharedKey(
    senderPrivateKey: string,
    toPublicKey: string
  ): string {
    const fromClient = createECDH('secp256k1')
    fromClient.setPrivateKey(senderPrivateKey, 'hex')
    const sharedKey = fromClient.computeSecret(toPublicKey, 'hex', 'hex')
    return sharedKey
  }
}

export { MessageDMTP, KeyPairDMTP }
