declare module 'tailwindcss/resolveConfig' {
  import type { Config } from 'tailwindcss'

  declare function resolveConfig(_config: Config): Config
  export = resolveConfig
}
