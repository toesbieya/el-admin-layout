/**
 * 把.vue转换为.js，保留es module，输出到dist/esm目录下
 */

const fs = require('fs')
const path = require('path')
const compile = require('./compile')
const {calcTimeCost, cleanDir, write, copy} = require('./util')

//输入目录，绝对路径
const inputDir = path.resolve(__dirname, `../src`)
//输出目录，绝对路径
const outputDir = path.resolve(__dirname, '../dist/esm')
//忽略目录，相对于输入目录
const exclude = ['/style'].map(i => path.normalize(i))
//忽略文件后缀
const excludeExtension = ['.scss']
//仅需拷贝的目录，相对于输入目录
const onlyCopy = ['/config', '/mixin', '/store'].map(i => path.normalize(i))
//仅需拷贝的文件后缀
const onlyCopyExtension = ['.js']


function handler(filePathList, parentPath = '') {
    if (!filePathList || filePathList.length === 0) return

    filePathList.forEach(filePath => {
        //相对于输入目录的路径
        const relativePath = parentPath + path.sep + filePath
        //完整的绝对路径
        const fullPath = inputDir + relativePath

        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            //是被忽略的目录
            if (exclude.includes(relativePath)) return

            //是只需要拷贝的目录
            if (onlyCopy.includes(relativePath)) {
                return copy(fullPath, outputDir + relativePath)
            }

            //递归处理目录
            return handler(fs.readdirSync(fullPath), relativePath)
        }

        //是被忽略的文件
        if (excludeExtension.some(i => filePath.endsWith(i))) {
            return
        }

        //是只需要拷贝的文件
        if (onlyCopyExtension.some(i => filePath.endsWith(i))) {
            return copy(fullPath, outputDir + relativePath)
        }

        //转译文件
        const source = fs.readFileSync(fullPath).toString('utf8')
        const compiled = compile(filePath, source, true)

        //改变文件后缀：.vue -> .js
        const filename = relativePath.slice(0, relativePath.lastIndexOf('.')) + '.js'

        write(outputDir + filename, compiled)
    })
}

calcTimeCost(() => {
    cleanDir(outputDir)
    handler(fs.readdirSync(inputDir))
}, 'Start es module compilation ...', 'Finish es module compilation')
