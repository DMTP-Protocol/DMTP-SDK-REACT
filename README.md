<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./example/public/DMTP.png">
    <img alt="dmtp logo" src="./example/public/DMTP.png" width="auto" height="60">
  </picture>
</p>

<p align="center">
DMTP SDK for React
<p>
<div align="center">
  <a href="https://www.npmjs.com/package/dmtp-sdk-react">
    <img src="https://img.shields.io/npm/v/dmtp-sdk-react?colorA=21262d&colorB=161b22&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/wagmi">
    <img src="https://img.shields.io/npm/dm/dmtp-sdk-react?colorA=21262d&colorB=161b22&style=flat" alt="Downloads per month">
  </a>
</div>

## Install

### NPM

```bash
npm install --save dmtp-sdk-react
```

### Yarn

```bash
yarn add dmtp-sdk-react
```

## Quick Start

### Setup DMTPProvider

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider
    redirect_uri_telegram='http://127.0.0.1:3000'
    APIKey='dmtp_api_key'
  >
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
```

### useConnectDMTP

```tsx
import { useConnectDMTP } from 'dmtp-sdk-react'

const App = () => {
  const { isConnectDMTP, connectDMTP } = useConnectDMTP()
  return (
    <>
      <h1>DMTP SDK</h1>
      <h3>useConnectDMTP</h3>
      <div>isConnectDMTP: {isConnectDMTP}</div>
      <button onClick={() => connectDMTP()}>connect DMTP</button>
    </>
  )
}
```

### useSendMessage

- `connectDMTP()` before `useSendMessage`

```tsx
import { useSendMessage } from 'dmtp-sdk-react'

const Message = () => {
  const sendMessage = useSendMessage()

  const [message, setMessage] = useState('Hi')
  const [toAddress, setToAddress] = React.useState(
    '0x62636ffd17bb80b1a7c177e5f45d774a1ee0d228'
  )

  return (
    <>
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
    </>
  )
}
```

### useSNS

- `connectDMTP()` before `useSNS`

```tsx
import { useSNS } from 'dmtp-sdk-react'

const SNS = () => {
  const { show, hide, verifyTelegram, snsData } = useSNS()
  const { isConnectDMTP } = useConnectDMTP()

  // get telegram code from url
  useEffect(() => {
    if (isConnectDMTP) {
      const query = new URLSearchParams(window.location.search)
      const telegramCode = query.get('code')
      if (telegramCode) {
        verifyTelegram(telegramCode)
      }
    }
  }, [isConnectDMTP])
  return (
    <>
      <h3>useSNS</h3>
      <div>Telegram: {snsData?.telegram}</div>
      <div>Discord: {snsData?.discord}</div>
      <button onClick={show}>Show SNS</button>
      <p />
      <button onClick={hide}>Hide SNS</button>
    </>
  )
}
```

## License

MIT © [DMTP](https://github.com/DMTProtocol/)
