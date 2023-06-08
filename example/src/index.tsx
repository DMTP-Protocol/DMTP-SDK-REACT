import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <DMTPProvider isDev APIKey='YOUR_API_KEY' dappAddress='YOUR_DAPP_ADDRESS'>
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
