import React from 'react'

import { useDMTPKeyPair } from 'dmtp-sdk-react'
import 'dmtp-sdk-react/dist/index.css'

const App = () => {
  const { DMTPpublicKey, getDMTPKeyPair } = useDMTPKeyPair()

  return (
    <>
      <div>DMTP SNS</div>
      <div>DMTPpublicKey: {DMTPpublicKey}</div>
      <button onClick={() => getDMTPKeyPair()}>getPrivateKey</button>
    </>
  )
}

export default App
