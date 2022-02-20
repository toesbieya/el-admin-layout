/**
 * 编译.vue、.js文件，按es6输出
 * 不支持ts，不支持style
 * 参考@vant/cli、@vue/component-compiler-utils、vue-component-compiler
 */

import fs from 'fs'
import path from 'path'
import babel from '@babel/core'
import { compile, parseComponent } from 'vue-template-compiler'
import transpile from 'vue-template-es2015-compiler'
import { getDirname } from './util.mjs'

/**
 * 判断文件是否为SFC
 *
 * @param filename {string} 文件名称
 * @return {boolean} 是则返回true
 */
export function isSFC(filename) {
  return filename.endsWith('.vue')
}

/**
 * 判断文件是否为js文件
 *
 * @param filename {string} 文件名称
 * @return {boolean} 是则返回true
 */
export function isJS(filename) {
  return filename.endsWith('.js')
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
export function compileJS(filename, source) {
  const config = {
    filename,
    envName: process.env.NODE_ENV || 'production',
    configFile: false,
    presets: [
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
export function compileSFC(filename, source) {
  const { template, script } = parseComponent(source)
  let code = script.content

  if (template) {
    const render = compileTemplate(template)
    code = injectRender(code, render)
  }

  return compileJS(filename, code)
}

function test() {
  const filePath = path.resolve(getDirname(), '../test/Temp.vue')
  const source = fs.readFileSync(filePath).toString('utf8')
  fs.writeFileSync('../test/Temp.js', compileSFC(filePath, source))
}
