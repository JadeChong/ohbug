import { getGlobal } from '@ohbug/utils'
import { scriptDispatcher } from '../../dispatcher'

const global = getGlobal<Window>()

function listener(e: PromiseRejectionEvent) {
  scriptDispatcher(e)
}

/**
 * capture UNHANDLEDREJECTION_ERROR
 */
function captureUnhandledrejectionError() {
  global.addEventListener('unhandledrejection', listener, true)
}

export function removeCaptureUnhandledrejectionError() {
  global.removeEventListener('unhandledrejection', listener, true)
}

export default captureUnhandledrejectionError
