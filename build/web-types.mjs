import { readFileSync } from 'fs'
import path from 'path'
import { getDirname, write } from './util.mjs'

const getJSONFile = relativePath => {
  return readFileSync(path.resolve(getDirname(), relativePath)).toString()
}

const baseJson = JSON.parse(getJSONFile('../web-types.json'))
const packageJson = JSON.parse(getJSONFile('../package.json'))

baseJson.version = packageJson.version

write(path.resolve(getDirname(), '../dist/web-types.json'), JSON.stringify(baseJson, null, 2))
