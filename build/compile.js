/**
 * 参考@vue/component-compiler-utils和vue-component-compiler
 */

const babel = require('@babel/core')
const {compile, parseComponent} = require('vue-template-compiler')
const transpile = require('vue-template-es2015-compiler')

/**
 * 将.vue文件编译为js，保留esm语法
 * 源文件中只能有<template>和<script>标签
 * 组件选项中的render必须在最后一项
 *
 * @param filename {string}       文件名称
 * @param source {string}         源码
 * @param isProduction {boolean}  是否为生产环境
 * @return {string}               转换后的js代码字符串
 */
module.exports = function (filename, source, isProduction = process.env.NODE_ENV === 'production') {
    const {template, script} = parseComponent(source)

    //没有<template>标签，则认为使用了render
    if (!template) {
        //如果使用了jsx语法，进行babel转译
        if (source.includes('<')) {
            const config = {
                filename,
                envName: isProduction ? 'production' : 'development',
                configFile: false,
                presets: ['@vue/babel-preset-jsx'],
                compact: false,
                comments: false
            }
            return babel.transformSync(script.content, config).code
        }

        //否则原样返回
        return script.content
    }


    /*将template编译为render函数*/
    const isFunctional = template.attrs.functional
    const toFunction = code => {
        return `function (${isFunctional ? `_h,_vm` : ``}) {${code}}`
    }
    const {render, staticRenderFns} = compile(template.content)

    //去除with(this)，并全部转为es5语法
    let code = transpile(
        `var __render__ = ${toFunction(render)}\n` +
        `var __staticRenderFns__ = [${staticRenderFns.map(toFunction)}]`,
        {
            transforms: {
                stripWithFunctional: isFunctional
            }
        }
    )

    if (!isProduction) {
        code += `\n\n__render__._withStripped = true`
    }

    script.content = script.content.trim()

    //在import和export default之间插入template编译后的代码
    const exportDefaultIndex = script.content.indexOf('export default')

    //加上export default前面的内容，原始内容会有换行符
    if (exportDefaultIndex > 0) {
        code = script.content.slice(0, exportDefaultIndex) + code
    }

    //把export default改为const __component__ =
    code += `\n\nconst __component__ =` + script.content.slice(exportDefaultIndex + 14)

    //修改render和staticRenderFns选项
    code += `\n\n__component__.render = __render__`
    if (staticRenderFns && staticRenderFns.length > 0) {
        code += `\n__component__.staticRenderFns = __staticRenderFns__`
    }

    code += `\n__component__._compiled = true`

    //修改function选项
    if (isFunctional) {
        code += `\n__component__.functional = true`
    }

    //导出
    code += `\n\nexport default __component__`

    return code
}

function test() {
    const fs = require('fs')
    const source = fs.readFileSync('../test/Temp.vue').toString('utf8')
    fs.writeFileSync('../test/Temp.js', module.exports('Temp.vue', source))
}
