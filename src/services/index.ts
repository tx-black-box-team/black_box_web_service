import Axios from 'axios'

interface HttpBase {
  http: any,
  get (str: string, data: object, resolve: any): void,
  delete (str: string, data: object, resolve: any): void,
  put (str: string, data: object, resolve: any): void,
  post (str: string, data: object, resolve: any): void
}

class AxiosUtil {
  private static axios: any = null
  private static reqCount: number = 0
  private static loadingInstance: any = null
  public static getInstance (): any {
    if (!this.axios) {
      this.axios = Axios
      this.axios.timeout = 45000
      this.axios.interceptors.request.use((config: any) => {
        this.reqCount++
        return config
      }, (error: any) => {
        this.reqCount--
        return Promise.reject(error)
      })
      this.axios.interceptors.response.use((response: any) => {
        this.reqCount--

        return response
      }, (error: any) => {
        if (error.response) {
          this.reqCount--
        }
        return Promise.reject(error)
      })
    }
    return this.axios
  }
}

export default class BaseService implements HttpBase {
  public http: any = null
  public ROOT_URL !: string
  constructor (path: string) {
    this.http = AxiosUtil.getInstance()
    this.ROOT_URL = path
  }

  public get (str: string, data: object, resolve: any): void {
    this.http.get(`${this.ROOT_URL}${str}`, {
      params: data || {}
    }).then((res: any) => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  public delete (str: string, data: object, resolve: any, isJson: boolean = false): void {
    const PARAMS: any = {}
    if (!isJson) {
      PARAMS.params = data || {}
    } else {
      PARAMS.data = data || {}
    }

    this.http.delete(`${this.ROOT_URL}${str}`, PARAMS).then((res: any) => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  public put (str: string, data: object, resolve: any): void {
    this.http.put(`${this.ROOT_URL}${str}`, data).then((res: any) => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  public post (str: string, data: object, resolve: any, headers: any = {}): void {
    this.http.post(`${this.ROOT_URL}${str}`, data, headers).then((res: any) => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

}
