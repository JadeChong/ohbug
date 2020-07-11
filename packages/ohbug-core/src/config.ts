import { isString, isFunction, isObject } from '@ohbug/utils'
import type { OhbugSchema, OhbugEvent } from '@ohbug/types'

export const schema: OhbugSchema = {
  // base
  apiKey: {
    defaultValue: undefined,
    message: 'is required',
    validate: (value) => Boolean(value) && isString(value),
  },
  appVersion: {
    defaultValue: undefined,
    message: 'should be a string',
    validate: (value) => value === undefined || isString(value),
  },
  appType: {
    defaultValue: undefined,
    message: 'should be a string',
    validate: (value) => value === undefined || isString(value),
  },
  // hooks
  created: {
    defaultValue: (event: OhbugEvent<any>) => event,
    message: 'should be a function',
    validate: (value) => value === undefined || isFunction(value),
  },
  notified: {
    defaultValue: () => {},
    message: 'should be a function',
    validate: (value) => value === undefined || isFunction(value),
  },
  // utils
  logger: {
    defaultValue: undefined,
    message: 'should be null or an object with methods { log, info, warn, error }',
    validate: (value) =>
      value === undefined ||
      (value &&
        ['log', 'info', 'warn', 'error'].reduce(
          (accumulator, method) => accumulator && typeof value[method] === 'function',
          true
        )),
  },
  // data
  user: {
    defaultValue: undefined,
    message: 'should be an object and have up to 6 attributes',
    validate: (value) => value === undefined || (isObject(value) && Object.keys(value).length <= 6),
  },
  metaData: {
    defaultValue: undefined,
    message: 'should be an object',
    validate: (value) => value === undefined || isObject(value),
  },
}
