import React from 'react'

import { useDMTPKeyPair, useSendMessage, useSNS } from 'dmtp-sdk-react'
import 'dmtp-sdk-react/dist/index.css'

const App = () => {
  const { DMTPpublicKey, getDMTPKeyPair } = useDMTPKeyPair()
  const sendMessage = useSendMessage()
  const { show, hide } = useSNS()

  return (
    <div
      style={{
        padding: '20px'
      }}
    >
      <h1>DMTP SDK</h1>
      <p />
      <h3>useDMTPKeyPair</h3>
      <div>DMTPpublicKey: {DMTPpublicKey}</div>
      <button onClick={() => getDMTPKeyPair()}>getDMTPKeyPair</button>
      <p />
      <h3>useSendMessage</h3>
      <input placeholder='Enter your message' />
      <input placeholder='To address' />
      <button onClick={() => sendMessage('test', '0x0000000')}>
        Send Message
      </button>
      <p />
      <h3>useSNS</h3>
      <button onClick={show}>Show SNS</button>
      <p />
      <button onClick={hide}>Hide SNS</button>
      <p />
      <p />
    </div>
  )
}

export default App
