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
    api_key: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('submit-key-pair', payload, {
      headers: {
        payload: `${message}:${signature}:${api_key}`
      }
    }),
  sendMessage: (
    payload: any,
    api_key: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('send-message', payload, {
      headers: {
        payload: `${message}:${signature}:${api_key}`
      }
    }),
  getKeyPair: (api_key: string, address: string) =>
    AxiosGet('key-pair', {
      headers: {
        api_key
      },
      params: { address }
    }),
  checkFriend: (api_key: string, userAddress: string, dappAddress: string) =>
    AxiosGet('check-friends', {
      headers: {
        api_key
      },
      params: { userAddress, dappAddress }
    }),
  addFriend: (
    payload: any,
    api_key: string,
    signature: string,
    message: string
  ) =>
    AxiosPost('add-friend', payload, {
      headers: {
        payload: `${message}:${signature}:${api_key}`
      }
    }),
  getSNS: (api_key: string, signature: string, message: string) =>
    AxiosGet<any>('sns', {
      headers: {
        payload: `${message}:${signature}:${api_key}`
      }
    }),
  verifyTelegram: (
    api_key: string,
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
          payload: `${message}:${signature}:${api_key}`
        }
      }
    )
}

export default ApiServices
