import { Compiler, compilation } from 'webpack'
import { upload } from './utils'
import { LOG_PREFIX } from './constants'

export interface Config {
  apiKey: string
  appVersion: string
  appType?: string
}
export interface Options extends Config {
  publicPath?: string
}
export interface Asset extends Config {
  sourceFile: string
  sourceFilePath: string
  sourceMap: string
  sourceMapPath: string
}

class OhbugWebpackPlugin implements Options {
  apiKey: string
  appVersion: string
  appType?: string
  publicPath?: string

  constructor(options: Options) {
    this.apiKey = options.apiKey
    this.appVersion = options.appVersion
    this.appType = options.appType
    this.publicPath = options.publicPath

    this.validate()
  }

  validate(): void {
    if (typeof this.apiKey !== 'string' || this.apiKey.length < 1) {
      throw new Error(`${LOG_PREFIX} "apiKey" is required!`)
    }
    if (typeof this.appVersion !== 'string' || this.appVersion.length < 1) {
      throw new Error(`${LOG_PREFIX} "appVersion" is required!`)
    }
  }

  getConfig(): Config {
    const config: Config = {
      apiKey: this.apiKey,
      appVersion: this.appVersion
    }
    if (this.appType) config.appType = this.appType
    return config
  }

  getAssets(compiler: Compiler, compilation: compilation.Compilation): Asset[] | undefined {
    const { chunks } = compilation.getStats().toJson()
    const outputPath = compilation.getPath(compiler.outputPath, {})

    return chunks?.reduce((result, chunk) => {
      const sourceFile = chunk.files.find(file => /\.js$/.test(file))
      const sourceMap = chunk.files.find(file => /\.js\.map$/.test(file))
      if (!sourceFile || !sourceMap) {
        return result
      }
      const sourceFilePath = compiler.outputFileSystem.join(outputPath, sourceFile)
      const sourceMapPath = compiler.outputFileSystem.join(outputPath, sourceMap)

      return [
        ...result,
        { sourceFile, sourceFilePath, sourceMap, sourceMapPath, ...this.getConfig() }
      ]
    }, [])
  }

  apply(compiler: Compiler) {
    const plugin = (compilation: compilation.Compilation, cb: () => void) => {
      const assets = this.getAssets(compiler, compilation)

      if (assets?.length) {
        assets.forEach(asset => {
          upload(asset)
        })
      }

      cb()
    }

    if (compiler.hooks && compiler.hooks.afterEmit) {
      compiler.hooks.afterEmit.tapAsync('OhbugWebpackPlugin', plugin)
    } else {
      compiler.plugin('after-emit', plugin)
    }
  }
}

export default OhbugWebpackPlugin
