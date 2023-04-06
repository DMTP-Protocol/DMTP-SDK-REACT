import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider
    isDev
    redirect_uri_telegram='http://127.0.0.1:3000'
    APIKey='dmtpe07bb247485d796e8eb9a7b8f1fcbe0b9eac3e85'
  >
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
