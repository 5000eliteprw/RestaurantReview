import {AxiosRequestConfig} from 'axios'
import getOr from 'lodash/fp/getOr'

import axios from '../utils/axios'
import {useAsyncDispatchContext} from './context'

function getErrorMessage(e: any) {
  if (e.response) {
    const contentType: string = getOr('', 'headers.content-type', e.response)
    return /^text\/plain/.test(contentType) ? e.response.data : e.response.statusText
  } else {
    return e.message
  }
}

export function useAxios() {
  const async = useAsyncDispatchContext()

  function request(method: AxiosRequestConfig['method']) {
    return (url: string, data?: any) => async (callback: (res: any) => string | void) => {
      try {
        async.start()
        const res = await axios.request({
          method,
          url,
          [method === 'GET' ? 'params' : 'data']: data,
        })
        async.stop(callback(res))
        return res
      } catch (e) {
        async.stop(`Error: ${getErrorMessage(e)}`)
      }
    }
  }

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  }
}
