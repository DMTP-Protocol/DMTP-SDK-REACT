<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/DMTP-Protocol/DMTP-SDK-REACT/assets/64068653/d7980ff3-3ed8-4a90-9f82-c37b5700a580">
    <img alt="dmtp logo" src="https://github.com/DMTP-Protocol/DMTP-SDK-REACT/assets/64068653/d7980ff3-3ed8-4a90-9f82-c37b5700a580" width="auto" height="240">
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
#### React

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider APIKey='YOUR_DMTP_API_KEY' dappAddress='YOUR_DAPP_WALLET_ADDRESS>
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
```

#### Next.js
```bash
npm install bootstrap
```
or
```bash
yarn add bootstrap
```

```tsx
import type { AppProps } from "next/app";
import { DMTPProvider } from "dmtp-sdk-react";

// You must import bootstrap here
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <DMTPProvider
        ?isDev
        APIKey="YOUR_DMTP_API_KEY"
        dappAddress="YOUR_DAPP_WALLET_ADDRESS"
      >
          <Component {...pageProps} />
      </DMTPProvider>
  );
}

export default MyApp;
```

#### DMTPProvider Props

| Props        | Type    | Description                                         | Require | Default |
| ------------ | ------- | --------------------------------------------------- | ------- | ------- |
| APIKey       | string  | Apikey that was generated from dmtp                 | true    |         |
| dappAddress  | string  | A wallet address that will be friend with the users | true    |         |
| isDev        | boolean | Get all log from SDK                                | false   | false   |

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

  const [message, setMessage] = useState('')
  const [toAddress, setToAddress] = React.useState(
    ''
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

Change `YOUR_WEBPAGE_URL`

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
      <DmtpSNS redirect_uri_telegram='YOUR_WEBPAGE_URL' />
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
