/**
 * 编译并输出到dist/esm目录下
 */

import fs from 'fs'
import path from 'path'
import { isSFC, isJS, compileSFC, compileJS } from './compile.mjs'
import { getDirname, calcTimeCost, cleanDir, write, copy } from './util.mjs'

// 输入目录，绝对路径
const inputDir = path.resolve(getDirname(), `../src`)
// 输出目录，绝对路径，不存在时会自动创建
const outputDir = path.resolve(getDirname(), '../dist/esm')
// 忽略目录，相对于输入目录，这些目录下的文件不参与编译也不会被复制
const excludeDirs = ['/style'].map(i => path.normalize(i))
// 忽略文件后缀，这些文件不参与编译也不会被复制
const excludeExtension = ['.scss']
// 仅需拷贝的目录，相对于输入目录，这些目录下的文件仅会被复制但不参与编译
const onlyCopyDirs = ['/config', '/mixin', '/store'].map(i => path.normalize(i))

/**
 * 编译目录
 *
 * @param filePathList {string[]} 文件名列表
 * @param parentPath {string=} 父级目录的路径
 */
function compileDir(filePathList, parentPath = '') {
  if (!filePathList || filePathList.length === 0) return

  filePathList.forEach(filePath => {
    // 相对于输入目录的路径
    const relativePath = parentPath + path.sep + filePath
    // 完整的绝对路径
    const fullPath = inputDir + relativePath

    const stat = fs.statSync(fullPath)

    // 处理目录
    if (stat.isDirectory()) {
      // 是被忽略的目录
      if (excludeDirs.includes(relativePath)) return

      // 是只需要拷贝的目录
      if (onlyCopyDirs.includes(relativePath)) {
        return copy(fullPath, outputDir + relativePath)
      }

      // 递归编译
      return compileDir(fs.readdirSync(fullPath), relativePath)
    }

    // 是被忽略的文件
    if (excludeExtension.some(i => filePath.endsWith(i))) {
      return
    }

    // 不需要编译的文件仅拷贝
    if (!isSFC(filePath)) {
      return copy(fullPath, outputDir + relativePath)
    }

    const source = fs.readFileSync(fullPath).toString('utf8')

    const compiled = isSFC(filePath)
      ? compileSFC(filePath, source)
      : compileJS(filePath, source)

    // 编译后的文件均为.js
    const filename = relativePath.slice(0, relativePath.lastIndexOf('.')) + '.js'

    write(outputDir + filename, compiled)
  })
}

calcTimeCost(() => {
  cleanDir(outputDir)
  compileDir(fs.readdirSync(inputDir))
}, 'Start es module compilation ...', 'Finish es module compilation')
