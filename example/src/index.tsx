import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DMTPProvider } from 'dmtp-sdk-react'

ReactDOM.render(
  <DMTPProvider APIKey='YOUR_API_KEY'>
    <App />
  </DMTPProvider>,
  document.getElementById('root')
)
