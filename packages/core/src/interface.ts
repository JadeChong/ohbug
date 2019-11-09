import { Config } from './config'
import { Enhancer } from './enhancer'
import { Hub } from './hub'

export interface Tags {
  platform: Platform
  version: string
  time: number
  // browser
  language?: string
  userAgent?: string
  title?: string
  url?: string
}

export interface WrappedIssue<T> {
  appid: string
  type: string
  detail: T
  tags: Tags
  state?: any
}

export type Platform = 'browser' | 'node'
export interface OhbugObject {
  platform: Platform
  version: string
  config?: Config
  enhancer?: Enhancer
  hub?: Hub
  _report?: (issues: WrappedIssue<any>[]) => void
}
export interface OhbugGlobal {
  __OHBUG__: OhbugObject
}
