import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'

type SuccessResponse<T> = {
  data: T
  message: string
  success: boolean
}
// const BASE_URL = 'http://127.0.0.1:3001/sdk/'
// const BASE_URL = 'http://35.77.41.240/sdk/'
const BASE_URL = 'https://dev.dmtp.tech/sdk/'

const axios = new Axios({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: [(data: any) => JSON.parse(data)],
  transformRequest: [(data: any) => JSON.stringify(data)]
})

const AxiosPost = <O>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(
    url,
    data,
    config
  )
}

const AxiosGet = <O>(url: string, config?: AxiosRequestConfig) =>
  axios.get<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(url, config)

const ApiServices = {
  submitKeyPair: (
    payload: any,
    apiKey: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('submit-key-pair', payload, {
      headers: {
        payload: `${message}:${signature}:${apiKey}`
      }
    }),
  sendMessage: (
    payload: any,
    apiKey: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('send-message', payload, {
      headers: {
        payload: `${message}:${signature}:${apiKey}`
      }
    }),
  getKeyPair: (apiKey: string, address: string) =>
    AxiosGet('key-pair', {
      headers: {
        apiKey
      },
      params: { address }
    }),
  checkFriend: (apiKey: string, userAddress: string, dappAddress: string) =>
    AxiosGet('check-friends', {
      headers: {
        apiKey
      },
      params: { userAddress, dappAddress }
    }),
  addFriend: (
    payload: any,
    apiKey: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('add-friend', payload, {
      headers: {
        payload: `${message}:${signature}:${apiKey}`
      }
    }),
  updateLoginInfo: (
    payload: any,
    apiKey: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('update-login', payload, {
      headers: {
        payload: `${message}:${signature}:${apiKey}`
      }
    }),
  getSNS: (apiKey: string, signature: string, message: string) =>
    AxiosGet<any>('sns', {
      headers: {
        payload: `${message}:${signature}:${apiKey}`
      }
    }),
  verifyTelegram: (
    apiKey: string,
    signature: string,
    message: string,
    otp: string
  ) =>
    AxiosPost(
      'verify-telegram',
      {
        otp
      },
      {
        headers: {
          payload: `${message}:${signature}:${apiKey}`
        }
      }
    )
}

export default ApiServices
