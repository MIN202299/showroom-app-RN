/* eslint-disable n/prefer-global/process */
export const STORAGE_KEY = 'showroom-storage'

export const SOCKET_URL = process.env.NODE_ENV === 'development' ? 'http://192.168.2.119:8422' : 'http://195.168.1.65:8422'

export const theme = {
  DEFAULT: '0',
  COMPANY_INTRO: '1',
  DROPLETON: '2',
}
