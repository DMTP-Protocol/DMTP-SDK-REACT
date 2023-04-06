import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider
    isDev
    redirect_uri_telegram='https://dapp.xyz'
    APIKey='DMTP_APIKey'
  >
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
