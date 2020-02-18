import { PluginCapturerContext } from '@ohbug/core'
import Perfume from 'perfume.js'

function capturer({ collector }: PluginCapturerContext) {
  new Perfume({
    resourceTiming: true,
    dataConsumption: true,
    largestContentfulPaint: true,
    logging: process.env.NODE_ENV === 'development',
    maxMeasureTime: 10000,
    analyticsTracker: options => {
      const { metricName, data, duration } = options
      switch (metricName) {
        case 'navigationTiming':
          if (data && data.timeToFirstByte) {
            collector({ type: metricName, data: data }, 'async')
          }
          break
        case 'networkInformation':
          if (data && data.effectiveType) {
            collector({ type: metricName, data: data }, 'async')
          }
          break
        case 'resourceTiming':
          collector({ type: metricName, data: data }, 'async')
          break
        case 'dataConsumption':
          collector({ type: metricName, data: data }, 'async')
          break
        case 'firstPaint':
          collector({ type: metricName, data: duration }, 'async')
          break
        case 'firstContentfulPaint':
          collector({ type: metricName, data: duration }, 'async')
          break
        case 'firstInputDelay':
          collector({ type: metricName, data: duration }, 'async')
          break
        case 'largestContentfulPaint':
          collector({ type: metricName, data: duration }, 'async')
          break
        default:
          break
      }
    }
  })
}

function plugin() {
  return {
    capturer
  }
}

export default plugin
