# `@ohbug/browser`

[English](./README.md) | 简体中文

## 安装

```
yarn add @ohbug/browser
```

## 使用

```javascript
import { init } from '@ohbug/browser'

init({ apiKey: 'demo_apiKey' })
```

## Config

```typescript
interface Config {
  apiKey: string
  appVersion?: string
  appType?: string
  beforeReport?: (event: Event<any>) => Event<any>
  reported?: (event: Event<any>) => void
}
```

### apiKey

这里作为客户端的唯一标识。

### appVersion

您应该提供 app 的版本号/标识符，以便于定位问题出现的时机。

### appType

如果您的 app 的代码库包含不同的入口，但向同一个服务上报，则可能需要添加 `appType` 表示问题来源的入口类型。

### beforeReport

用于上报前对收集到的信息做一定处理。

### reported

用于上报后的特定操作。

## 插件

### 例子

基于 [perfume.js](https://github.com/Zizzamia/perfume.js) 封装的插件使用。

```
yarn add @ohbug/plugin-perfume
```

```javascript
import { applyPlugin } from '@ohbug/core'
import ohbugPluginPerfume from '@ohbug/plugin-perfume'
import { init } from '@ohbug/browser'

const enhancer = applyPlugin(ohbugPluginPerfume)
init({ apiKey: 'demo_apiKey' }, enhancer)
```

### 自定义插件

示例

```javascript
// capturer 用于自定义信息的捕获
// 使用 createEvent 封装捕获到的信息
// 使用 collector 传递信息给 Ohbug 用于上报
const capturer = ({ createEvent, collector }) => {
  a.addEventListener('error', (e) => {
    // do something
    const event = createEvent('TYPE', e)
    collector(event)
  })
}

// collector 用于对已有信息进行二次处理
// 返回任意格式 object，最终这些信息将出现在 `event.state` 中
const collector = event => {
  return {
    user: 'user_1'
  }
}

const myPlugin = config => {
  return { capturer, collector }
}
```

### 插件列表

- [plugin-perfume](https://github.com/ohbug-org/ohbug/tree/master/packages/plugin-perfume) 用于性能信息监控
- [plugin-rrweb](https://github.com/ohbug-org/ohbug/tree/master/packages/plugin-rrweb) 用于还原异常出现时的场景
