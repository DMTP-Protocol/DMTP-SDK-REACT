import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider isDev APIKey='dmtp_key'>
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
