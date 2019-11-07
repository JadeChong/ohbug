import { getGlobal, warning, replace } from '@ohbug/utils'
import { types } from '@ohbug/core'
import { networkDispatcher } from '../../dispatcher'

const global = getGlobal<Window>()
const { AJAX_ERROR } = types

/**
 * 用于捕获 AJAX_ERROR
 */
function captureAjaxError() {
  warning(
    'XMLHttpRequest' in global,
    'Ohbug: 绑定 `AJAX` 监控失败，当前环境未发现对象 `XMLHttpRequest`'
  )
  if (!('XMLHttpRequest' in global)) return

  const desc = {
    method: '',
    url: ''
  }

  const xhrProto = XMLHttpRequest.prototype

  replace(
    xhrProto,
    'open',
    origin =>
      function(...args: any[]) {
        desc.method = args[0]
        desc.url = args[1]
        return origin.apply(this, args)
      }
  )

  replace(
    xhrProto,
    'send',
    origin =>
      function(...args: any[]) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState === 4) {
            if (!this.status || this.status >= 400) {
              networkDispatcher(AJAX_ERROR, {
                req: {
                  url: desc.url,
                  method: desc.method,
                  data: args[0] || {}
                },
                res: {
                  status: this.status,
                  statusText: this.statusText,
                  response: this.response
                }
              })
            }
          }
        })
        return origin.apply(this, args)
      }
  )
}

export default captureAjaxError
