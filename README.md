<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ipfs.dmtp.tech/ipfs/QmZPScJNbCu9SjCZwJRLcno6mprdctuddL2hk5BBDbGrE2">
    <img alt="dmtp logo" src="https://ipfs.dmtp.tech/ipfs/QmZPScJNbCu9SjCZwJRLcno6mprdctuddL2hk5BBDbGrE2" width="auto" height="60">
  </picture>
</p>

<p align="center">
DMTP SDK for React
<p>
<div align="center">
  <a href="https://www.npmjs.com/package/dmtp-sdk-react">
    <img src="https://img.shields.io/npm/v/dmtp-sdk-react?colorA=21262d&colorB=161b22&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/dmtp-sdk-react">
    <img src="https://img.shields.io/npm/dm/dmtp-sdk-react?colorA=21262d&colorB=161b22&style=flat" alt="Downloads per month">
  </a>
</div>

## Requirements

- Node.js 16.x.x
- React 18.x.x

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
  <DMTPProvider APIKey='dmtp_api_key'>
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
```

#### DMTPProvider Props

| Props  | Type    | Description                         | Require | Default |
| ------ | ------- | ----------------------------------- | ------- | ------- |
| APIKey | string  | Apikey that was generated from dmtp | true    |         |
| isDev  | boolean | Get all log from SDK                | false   | false   |

### useConnectDMTP

| Props         | Type                            | Description                    | Require | Default |
| ------------- | ------------------------------- | ------------------------------ | ------- | ------- |
| isConnectDMTP | boolean                         | Check is SDK connected to DMTP |         |         |
| connectDMTP   | function return Promise< void > | Make SDK start connect to DMTP |         |         |

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
  | Props | Type | Description | Require | Default |
  |-------------|------------------------------------------------------|--------------------------|---------|---------|
  | sendMessage | (message:string, to_address:string) => Promise< void > | Sending message with SDK | | |

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
  | Props | Type | Description | Require | Default |
  |----------------|--------------------------------------------------|-----------------------------------------------------------------|---------|---------|
  | show | () => void | Show SNS connection UI | | |
  | hide | () => void | Hide SNS connection UI | | |
  | verifyTelegram | (otp: string) => Promise< void > | Verify with from url params when telegram bot open redirect url | | |
  | snsData | { discord: boolean; telegram: boolean; } \| null | The data of SNS from DMTP | | |

```tsx
import { useSNS, DmtpSNS } from 'dmtp-sdk-react'

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
      <DmtpSNS redirect_uri_telegram='http://127.0.0.1:3000' />
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
