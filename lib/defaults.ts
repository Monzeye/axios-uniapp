import { AxiosRequestConfig } from './types'

const defaults: Partial<AxiosRequestConfig> = {
  headers: {
    // 'Content-Type': "application/x-www-form-urlencoded"
    'Content-Type': 'application/json'
  },
  validateStatus: function validateStatus(status: number) {
    return status >= 200 && status < 300
  }
}
export default defaults
