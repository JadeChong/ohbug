import init from '../src/init'
import applyPlugin from '../src/applyPlugin'

const apiKey = 'test_id'
const config = { apiKey }
const platform = 'browser'
const handleReport = jest.fn()
const handleCapture = jest.fn()
const handleAsync = jest.fn()
function plugin() {
  function capturer() {}
  function collector() {}
  return {
    capturer,
    collector
  }
}
const enhancer = applyPlugin(plugin)

describe('core init', () => {
  beforeAll(() => {
    init({
      config,
      platform,
      version: 'test',
      handleCapture,
      handleReport,
      handleAsync,
      enhancer
    })
  })

  it('the `__OHBUG__` object should be mounted on global', () => {
    expect(window.__OHBUG__).not.toBeUndefined()
  })

  it('the `enhancer` object should be mounted on `global.__OHBUG__`', () => {
    expect(window.__OHBUG__.enhancer).not.toBeUndefined()
  })

  it('the `_report` object should be mounted on `global.__OHBUG__`', () => {
    expect(window.__OHBUG__._report).not.toBeUndefined()
    expect(window.__OHBUG__._report).toEqual(handleReport)
  })

  it('should trigger handleCapture', () => {
    expect(handleCapture).toBeCalledTimes(1)
  })

  it('should trigger handleAsync', () => {
    expect(handleAsync).toBeCalledTimes(1)
  })
})
