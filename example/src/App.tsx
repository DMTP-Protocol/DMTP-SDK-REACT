import React from 'react'

import { useDMTPKeyPair, useSendMessage, useSNS } from 'dmtp-sdk-react'
import 'dmtp-sdk-react/dist/index.css'

const App = () => {
  const { DMTPpublicKey, getDMTPKeyPair } = useDMTPKeyPair()
  const sendMessage = useSendMessage()
  const { show, hide } = useSNS()

  const [message, setMessage] = React.useState('Hi')
  const [toAddress, setToAddress] = React.useState(
    '0x62636ffd17bb80b1a7c177e5f45d774a1ee0d228'
  )

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
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Enter your message'
      />
      <input
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder='To address'
      />
      <button onClick={() => sendMessage(message, toAddress)}>
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
