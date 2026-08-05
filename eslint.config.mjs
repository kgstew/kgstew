import js from '@eslint/js'
import next from 'eslint-config-next'

export default [
  { ignores: ['.next/**', 'node_modules/**', 'tools/**', 'originals/**'] },
  js.configs.recommended,
  ...next(),
]
