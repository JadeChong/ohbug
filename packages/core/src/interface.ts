import { Config } from './config'
import { Enhancer } from './enhancer'
import { Hub } from './hub'

export interface Tags {
  platform: Platform
  version: string
  // browser
  language?: string
  userAgent?: string
  title?: string
  url?: string
}

export interface Breadcrumb {
  type: string
  category: string
  timestamp: number
  message?: string
  data?: { [key: string]: any }
}

export interface Event<D> {
  appid: string
  time: number | string
  type: string
  detail: D
  tags: Tags
  breadcrumbs?: Breadcrumb[]
  state?: any
}

export type Platform = 'browser' | 'node'
export interface OhbugObject {
  platform: Platform
  version: string
  config?: Config
  enhancer?: Enhancer
  hub?: Hub
  _report?: (event: Event<any>) => void
}
export interface OhbugGlobal {
  __OHBUG__: OhbugObject
}

export interface BaseDetail {
  message?: string
}
