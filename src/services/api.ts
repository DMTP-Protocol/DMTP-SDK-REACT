import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'

type SuccessResponse<T> = {
  data: T
  message: string
  success: boolean
}
const BASE_URL = 'http://35.77.41.240:3001/sdk/'

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
        signature,
        message,
        api_key
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
        signature,
        message,
        api_key
      }
    }),
  getKeyPair: (api_key: string, signature: string, message: string) =>
    AxiosGet('key-pair', {
      headers: {
        signature,
        message,
        api_key
      }
    }),
  getSNS: (api_key: string, signature: string, message: string) =>
    AxiosGet('sns', {
      headers: {
        signature,
        message,
        api_key
      }
    })
}

export default ApiServices
