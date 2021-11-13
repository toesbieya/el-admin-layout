/**
 * 将.scss编译为.css，输出到dist/index.min.css
 *
 * 完整样式，包含maxViewHeight.scss
 */

const fs = require('fs')
const path = require('path')
const sass = require('sass')
const cssnano = require('cssnano')
const { calcTimeCost, mkdirWhenNoExist, getFileDir } = require('./util')

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
    const result = sass.renderSync({
      file: input,
      outputStyle: 'compressed',
      importer(url, prev) {
        if (url.startsWith('~')) {
          return { file: path.join(modulePath, url.substring(1)) }
        }
        return { file: prev }
      }
    })

    // from: undefined 用来阻止cssnano显示警告
    const { css } = await cssnano().process(result.css, { from: undefined })

    fs.writeFileSync(output, css)
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
