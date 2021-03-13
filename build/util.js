const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

//当前工程的绝对路径
const PROJECT_DIR = __dirname.slice(0, -6)

/**
 * 计算函数的执行时间
 *
 * @param fun {function}    需要执行的函数
 * @param startTip {string} 执行前打印的内容
 * @param doneTip {string}  成功执行后打印的内容
 */
exports.calcTimeCost = async function (fun, startTip, doneTip) {
    const start = Date.now()
    module.exports.start(startTip)

    try {
        await fun()
    }
    catch (e) {
        module.exports.error('There has been an error in program execution:')
        console.error(e)
        return
    }

    const spend = Date.now() - start
    module.exports.done(doneTip + ` in  ${spend}ms`)
}

/**
 * 清空指定目录下所有文件
 *
 * @param dir {string} 绝对路径
 */
exports.cleanDir = function (dir) {
    fs.existsSync(dir) && rimraf.sync(dir)
    exports.mkdirWhenNoExist(dir)
}

/**
 * 将内容写入到指定文件
 * 目录不存在时会自动创建
 *
 * @param path {string}      写入的文件的绝对路径，需要在工程目录下
 * @param data {string|any}  写入的内容，作为fs.writeFileSync的第二个参数
 */
exports.write = function (path, data) {
    const dir = exports.getFileDir(path)
    if (!fs.existsSync(dir)) {
        exports.mkdirWhenNoExist(dir)
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
exports.copy = function (src, dest) {
    const dir = exports.getFileDir(dest)
    if (!fs.existsSync(dir)) {
        exports.mkdirWhenNoExist(dir)
    }

    const stat = fs.statSync(src)

    //目录时递归
    if (stat.isDirectory()) {
        return fs.readdirSync(src).forEach(filePath => {
            exports.copy(path.join(src, filePath), path.join(dest, filePath))
        })
    }

    fs.copyFileSync(src, dest)
}

/**
 * 指定目录不存在时新建一个
 *
 * @param dir {string} 需要是绝对路径，并且在当前工程目录下
 */
exports.mkdirWhenNoExist = function (dir) {
    dir = path.normalize(dir)

    const index = dir.indexOf(PROJECT_DIR)
    if (index < 0 || dir.length === PROJECT_DIR.length) {
        return
    }

    //相对于工程目录的路径，去除前面的文件分隔符
    const relativePath = dir.slice(index + PROJECT_DIR.length + 1)

    //dist/test/ -> ['dist', 'test']
    const pathList = relativePath.split(path.sep).filter(Boolean)

    for (let i = 0, p = PROJECT_DIR; i < pathList.length; i++) {
        //当前判断的目录的绝对路径
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
exports.getFileDir = function (filePath) {
    //如果不包含'.'，则视为目录，原样返回
    return filePath.lastIndexOf('.') === -1
        ? filePath
        : path.dirname(filePath)
}


exports.start = function (content) {
    console.log('\033[44;30m START \033[40;34m ' + content + ' \033[0m\n')
}
exports.done = function (content) {
    console.log('\033[42;30m DONE \033[40;32m ' + content + ' \033[0m\n')
}
exports.error = function (content) {
    console.log('\033[41;30m ERROR \033[40;31m ' + content + ' \033[0m\n')
}
