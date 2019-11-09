import { getConfig, getOhbugObject } from './config'
import { WrappedIssue, Tags } from './interface'
import { version } from './version'

function getTags<T>(): Tags {
  const { platform } = getOhbugObject<T>()
  const time = new Date().getTime()
  const tags: Tags = {
    platform,
    version,
    time
  }
  if (navigator) {
    const { language, userAgent } = navigator
    tags.language = language
    tags.userAgent = userAgent
  }
  if (document) {
    const { title } = document
    tags.title = title
  }
  if (location) {
    const { href: url } = location
    tags.url = url
  }
  return tags
}

function createIssue<T>(type: string, detail: T): WrappedIssue<T> {
  const { appid } = getConfig()
  const tags = getTags<T>()
  return {
    appid,
    type,
    tags,
    detail
  }
}

export default createIssue
