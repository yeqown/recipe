import axios from 'axios'
import querystring from 'querystring'
import {parse} from 'url'

// const API_BASE_URL = "http://10.0.2.2:5050"
const API_BASE_URL = "http://drone.gogofinance.com"

// const API_BASE_URL = "https://api.dev.gogofinance.com/api"

class ApiHttpError {
  constructor (code, message) {
    this.code = code
    this.message = message
  }

  toString () {
    return `${this.code} ${this.message}`
  }
}

class ApiResultError {
  constructor (code, message, data) {
    this.code = code
    this.message = message
    this.data = data
  }

  toString () {
    return `${this.code} ${this.message}`
  }
}

export let client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  paramsSerializer: params => querystring.stringify(params),
  responseType: 'json',
  maxContentLength: Math.pow(1024, 2)
})

client.interceptors.request.use(
  config => {
    let {method, url, params, data, background} = config
    // console.log('request', config)
    // console.log(method, url, params || data)
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(new ApiHttpError(400, error.message))
  },
)

client.interceptors.response.use(
  response => {
    let {status, data, config: {url, background}} = response
    let {path} = parse(url)
    // console.log(status, path, data)
    return response
  },
  error => {
    console.log(error)
    if (error.response) {
      let {status, statusText} = error.response
      if (statusText === undefined) {
        if (status === 200) {
          statusText = '成功'
        } else if (status === 400) {
          statusText = '请求不正确'
        } else if (status === 401) {
          statusText = '没有权限'
        } else if (status === 413) {
          statusText = '发送内容过大'
        } else if (status === 500) {
          statusText = '服务器内部错误'
        } else if (status === 502) {
          statusText = '服务暂时不可用'
        } else if (status === 504) {
          statusText = '服务器处理超时'
        } else {
          statusText = '请求服务出错'
        }
      }
      return Promise.reject(new ApiHttpError(status, statusText))
    } else {
      if (error.message.startsWith('timeout of ')) {
        return Promise.reject(new ApiHttpError(408, '请求超时'))
      } else {
        return Promise.reject(new ApiHttpError(500, error.message))
      }
    }
  },
)

export function getApi (url, params = {}, {headers = {}, timeout = 3000, background = false, onDownloadProgress, ...rest} = {}) {
  return requestApi({
    ...rest,
    url,
    method: 'GET',
    params,
    headers,
    timeout,
    background,
    onDownloadProgress
  })
}

export function postApi (url, data = {}, {headers = {}, json = false, urlencoded = true, timeout = 5000, background = false, onUploadProgress, ...rest} = {}) {
  let postData = serializeBody(data, {json, urlencoded, headers})

  return requestApi({
    ...rest,
    url,
    method: 'POST',
    data: postData,
    headers,
    timeout,
    background,
    onUploadProgress
  })
}

export function putApi (url, data = {}, {headers = {}, json = false, urlencoded = true, timeout = 5000, background = false, onUploadProgress, ...rest} = {}) {
  let putData = serializeBody(data, {json, urlencoded, headers})

  return requestApi({
    ...rest,
    url,
    method: 'PUT',
    data: putData,
    headers,
    timeout,
    background,
    onUploadProgress
  })
}

export function requestApi (config) {
  return client.request(config)
    .then(response => {
      if (config.responseType === 'text') {
        return response.data
      }
      if (response.data.code === 0) {
        return response.data
      } else {
        let {code, message, data} = response.data
        return Promise.reject(new ApiResultError(code, message, data))
      }
    })
}

export function serializeBody (data = {}, options) {
  let { urlencoded = true, json = false, body = {}, headers = {} } = options || {}

  if (urlencoded) {
    body = querystring.stringify(data)
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else if (json) {
    body = data
    headers['Content-Type'] = 'application/json'
  } else {
    let formData = new FormData()
    for (let [k, v] of Object.entries(data)) {
      formData.append(k, v)
    }
    body = formData
  }
  return body
}
