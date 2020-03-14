# `@ohbug/react`

English | [简体中文](./README-zh_CN.md)

## Installation

```
yarn add @ohbug/react
```

## Usage

```jsx
import OhbugReact from '@ohbug/react'

const OhbugErrorBoundary = OhbugReact({
  apiKey: 'YOUR_API_KEY',
  appVersion: 'YOUR_APP_VERSION'
})

function App() {
  return (
    <div className="App">
      <OhbugErrorBoundary>
        <HelloWorld />
      </OhbugErrorBoundary>
    </div>
  )
}
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

Your project API key.

### appVersion

The version number of your app. Conveniently locate the problem version.

### appType

The type of your app. If your app's codebase contains different entries, but reports to the same service, you may need to add `appType` to indicate the type of entry for the source of the problem.

### beforeReport

Used to do some processing on the collected information before reporting.

### reported

Used to perform specific operations after reporting.

## Plugin

### Example

Use of plugin based on [perfume.js](https://github.com/Zizzamia/perfume.js) package.

```
yarn add @ohbug/plugin-perfume
```

```jsx
import { applyPlugin } from '@ohbug/core'
import ohbugPluginPerfume from '@ohbug/plugin-perfume'
import OhbugReact from '@ohbug/react'

const enhancer = applyPlugin(ohbugPluginPerfume)

const OhbugErrorBoundary = OhbugReact(
  {
    apiKey: '9612114ecfdd1cd322ca0188be729f1e9065e36bc0d0ec6acccaf87d21f57bc0'
  },
  enhancer
)

function App() {
  return (
    <div className="App">
      <OhbugErrorBoundary>
        <HelloWorld />
      </OhbugErrorBoundary>
    </div>
  )
}
```
