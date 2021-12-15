/**
 * 将.vue编译成.js
 * 不支持ts，不支持style
 * 参考@vant/cli、@vue/component-compiler-utils、vue-component-compiler
 */

const path = require('path')
const babel = require('@babel/core')
const { compile, parseComponent } = require('vue-template-compiler')
const transpile = require('vue-template-es2015-compiler')

/**
 * 判断文件是否为SFC
 *
 * @param filename {string} 文件名称
 * @return {boolean} 是则返回true
 */
function isSFC(filename) {
  return filename.endsWith('.vue')
}

/**
 * 将parseComponent返回的template编译成render函数
 *
 * @param template {import('vue-template-compiler').SFCBlock}
 * @return {string} 编译后的函数字符串
 */
function compileTemplate(template) {
  const isFunctional = template.attrs.functional
  const toFunction = code => {
    return `function (${isFunctional ? `_h,_vm` : ``}) {${code}}`
  }
  const { render, staticRenderFns } = compile(template.content)

  // 去除with(this)，并全部转为es5语法
  return transpile(
    `var __render__ = ${toFunction(render)}\n` +
    `var __staticRenderFns__ = [${staticRenderFns.map(toFunction)}]`,
    {
      transforms: {
        stripWithFunctional: isFunctional
      }
    }
  )
}

/**
 * 将生成的渲染函数字符串插入原有的script字符串中
 *
 * @param sourceScript {string} parseComponent得到的script字符串
 * @param render {string} compileTemplate返回的结果
 */
function injectRender(sourceScript, render) {
  sourceScript = sourceScript.trim().replace('export default', 'const __component__ =')

  // 加入渲染函数
  sourceScript += `\n${render}`

  // 修改render和staticRenderFns选项
  sourceScript += `\n__component__.render = __render__`
  sourceScript += `\n__component__.staticRenderFns = __staticRenderFns__`

  // vue-loader里的写法
  sourceScript += `\n__component__._compiled = true`

  // 导出
  sourceScript += `\nexport default __component__`

  return sourceScript
}

/**
 * 编译js
 *
 * @param filename {string} 文件名
 * @param source {string} 需要编译的js内容
 * @return {string}
 */
function compileJS(filename, source) {
  const config = {
    filename,
    envName: process.env.NODE_ENV || 'production',
    configFile: false,
    presets:[
      ['@vue/babel-preset-jsx', { functional: false }]
    ],
    compact: false,
    comments: false
  }

  return babel.transformSync(source, config).code
}

/**
 * 编译SFC
 *
 * @param filename {string} 文件名
 * @param source {string} 需要编译的SFC内容
 * @return {string}
 */
function compileSFC(filename, source) {
  const { template, script } = parseComponent(source)
  let code = script.content

  if (template) {
    const render = compileTemplate(template)
    // 使用template的SFC无需再编译js，因为不可能有jsx
    return injectRender(code, render)
  }

  return compileJS(filename, code)
}

module.exports = {
  isSFC,
  compileSFC,
  compileJS
}

function test() {
  const fs = require('fs')
  const filePath = path.resolve(__dirname, '../test/Temp.vue')
  const source = fs.readFileSync(filePath).toString('utf8')
  fs.writeFileSync('../test/Temp.js', compileSFC(filePath, source))
}