import { getGlobal, warning } from '@ohbug/utils'
import { Init } from '@ohbug/types'
import { defaultConfig } from './config'

/**
 * An init function common to multiple JavaScript platforms for saving config information and capture report plugin, etc.
 *
 * @param config Config information
 * @param platform Each issue will record its original platform
 * @param handleCapture Used to bind monitoring functions
 * @param handleReport Used to pass the report function
 * @param enhancer Used to pass the return value of the applyPlugin function
 */
function init<T>({
  config,
  platform,
  version,
  handleCapture,
  handleReport,
  handleAsync,
  enhancer
}: Init) {
  const global = getGlobal<T>()
  warning(
    Boolean(global),
    `Ohbug: It is detected that the current environment does not support Ohbug.`
  )
  if (!global) return

  if (global.__OHBUG__ === undefined) {
    warning(Boolean(config.apiKey), `Ohbug: Please pass in apiKey!`)
    if (!config.apiKey) return

    const _config = {
      ...defaultConfig,
      ...config
    }

    global.__OHBUG__ = {
      platform,
      version,
      config: _config
    }

    // Insert plugin
    if (enhancer) {
      warning(
        typeof enhancer === 'function',
        '`enhancer` is not a function, please check `Ohbug.init`!'
      )
      if (typeof enhancer !== 'function') return
      global.__OHBUG__.enhancer = enhancer(_config)
    }
    global.__OHBUG__._report = handleReport
    handleAsync()
    handleCapture()
  }
}

export default init
