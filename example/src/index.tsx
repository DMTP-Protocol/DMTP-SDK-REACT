import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider
    redirect_uri_telegram='http://0.0.0.0:3000'
    APIKey='dmtp5aa8ea842bfa805046442827a8d624164143ea74'
  >
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
