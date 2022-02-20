import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 当前工程的绝对路径
const PROJECT_DIR = path.dirname(getDirname())

/**
 * 获取esmodule下的__dirname
 * @return {string}
 */
export function getDirname() {
  return fileURLToPath(new URL('.', import.meta.url))
}

/**
 * 计算函数的执行时间
 *
 * @param fun {function}    需要执行的函数
 * @param startTip {string} 执行前打印的内容
 * @param doneTip {string}  成功执行后打印的内容
 */
export async function calcTimeCost(fun, startTip, doneTip) {
  const start = Date.now()
  log.start(startTip)

  try {
    await fun()
  }
  catch (e) {
    log.error('There has been an error in program execution:')
    console.error(e)
    return
  }

  const spend = Date.now() - start
  log.done(doneTip + ` in  ${spend}ms`)
}

/**
 * 清空指定目录下所有文件
 *
 * @param dir {string} 绝对路径
 */
export function cleanDir(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return
  }

  const children = fs.readdirSync(dir)
  children.forEach(filename => {
    const filePath = path.join(dir, filename)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      cleanDir(filePath)
      fs.rmdirSync(filePath)
    }
    else fs.unlinkSync(filePath)
  })

  mkdirWhenNoExist(dir)
}

/**
 * 将内容写入到指定文件
 * 目录不存在时会自动创建
 *
 * @param path {string}      写入的文件的绝对路径，需要在工程目录下
 * @param data {string|any}  写入的内容，作为fs.writeFileSync的第二个参数
 */
export function write(path, data) {
  const dir = getFileDir(path)
  if (!fs.existsSync(dir)) {
    mkdirWhenNoExist(dir)
  }

  fs.writeFileSync(path, data)
}

/**
 * 将源文件或源目录下的所有内容复制到指定目录下
 * 指定目录不存在时会自动创建
 *
 * @param src  {string} 需要拷贝的目录或文件的绝对路径，需要在工程目录下
 * @param dest {string} 需要复制到哪个目录下，比如/src/index.js -> /dist/index.js，那就是/dist
 */
export function copy(src, dest) {
  const dir = getFileDir(dest)
  if (!fs.existsSync(dir)) {
    mkdirWhenNoExist(dir)
  }

  const stat = fs.statSync(src)

  // 目录时递归
  if (stat.isDirectory()) {
    return fs.readdirSync(src).forEach(filePath => {
      copy(path.join(src, filePath), path.join(dest, filePath))
    })
  }

  fs.copyFileSync(src, dest)
}

/**
 * 指定目录不存在时新建一个
 *
 * @param dir {string} 需要是绝对路径，并且在当前工程目录下
 */
export function mkdirWhenNoExist(dir) {
  dir = path.normalize(dir)

  const index = dir.indexOf(PROJECT_DIR)
  if (index < 0 || dir.length === PROJECT_DIR.length) {
    return
  }

  // 相对于工程目录的路径，去除前面的文件分隔符
  const relativePath = dir.slice(index + PROJECT_DIR.length + 1)

  // dist/test/ -> ['dist', 'test']
  const pathList = relativePath.split(path.sep).filter(Boolean)

  for (let i = 0, p = PROJECT_DIR; i < pathList.length; i++) {
    // 当前判断的目录的绝对路径
    p = path.join(p, pathList[i])

    !fs.existsSync(p) && fs.mkdirSync(p)
  }
}

/**
 * 获取文件路径对应的上级目录，/dist/test.js -> /dist，/dist -> /dist
 *
 * @param filePath {string} 文件或目录的路径
 * @return {string}
 */
export function getFileDir(filePath) {
  // 如果不包含'.'，则视为目录，原样返回
  return filePath.lastIndexOf('.') === -1
    ? filePath
    : path.dirname(filePath)
}

export const log = {
  start(content) {
    console.log(`\x1b[44;30m START \x1b[40;34m ${content} \x1b[0m\n`)
  },
  done(content) {
    console.log(`\x1b[42;30m DONE \x1b[40;32m ${content} \x1b[0m\n`)
  },
  error(content) {
    console.log(`\x1b[41;30m ERROR \x1b[40;31m ${content} \x1b[0m\n`)
  }
}
