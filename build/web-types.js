const path = require('path')
const baseJson = require('../web-types.json')
const packageJson = require('../package.json')
const { write } = require('./util')

baseJson.version = packageJson.version

write(path.resolve(__dirname, '../dist/web-types.json'), JSON.stringify(baseJson, null, 2))
