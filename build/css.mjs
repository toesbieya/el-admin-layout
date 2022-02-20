/**
 * 将.scss编译为.css，输出到dist/index.min.css
 *
 * 完整样式，包含maxViewHeight.scss
 */

import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import sass from 'sass'
import { transform } from 'esbuild'
import { getDirname, calcTimeCost, mkdirWhenNoExist, getFileDir } from './util.mjs'

const __dirname = getDirname()

// 输入文件
const input = path.resolve(__dirname, 'temp.scss')
// 输入文件的内容
const code = `@import '../src/style/index.scss';\n@import '../src/style/maxViewHeight.scss';`
// 输出文件
const output = path.resolve(__dirname, '../dist/index.min.css')

async function compile() {
  fs.writeFileSync(input, code)

  const modulePath = path.resolve(__dirname, '../node_modules')

  try {
    const result = sass.compile(input, {
      importers: [{
        findFileUrl(url, { fromImport }) {
          return pathToFileURL(path.join(modulePath, url))
        }
      }],
      logger: sass.Logger.silent
    })

    // from: undefined 用来阻止cssnano显示警告
    const { code } = await transform(result.css, {
      loader: 'css',
      minify: true
    })

    fs.writeFileSync(output, code)
  }
  catch (e) {
    throw e
  }
  finally {
    fs.unlinkSync(input)
  }
}

calcTimeCost(() => {
  mkdirWhenNoExist(getFileDir(output))
  return compile()
}, 'Start scss compilation ...', 'Finish scss compilation')
