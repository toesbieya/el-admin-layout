/**
 * 把.vue转换为.js，保留es module
 */

const fs = require('fs')
const rimraf = require('rimraf')
const compile = require('./compile')

//输入目录
const inputDir = '../src'
//输出目录
const outputDir = '../dist/esm'
//忽略目录，相对于输入目录
const exclude = ['/style']
//忽略文件后缀
const excludeExtension = ['.scss']
//仅需拷贝的目录，相对于输入目录
const onlyCopy = ['/config', '/mixin', '/store']
//仅需拷贝的文件后缀
const onlyCopyExtension = ['.js']

function handler(children, parent = '') {
    if (!children || children.length === 0) return

    children.forEach(child => {
        const relativePath = parent + '/' + child
        const fullPath = inputDir + relativePath
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            //是被忽略的目录
            if (exclude.includes(relativePath)) return

            //是只需要拷贝的目录
            if (onlyCopy.includes(relativePath)) {
                return copy(relativePath)
            }

            //递归处理目录
            return handler(fs.readdirSync(fullPath), relativePath)
        }

        //是被忽略的文件
        if (excludeExtension.some(i => child.endsWith(i))) {
            return
        }

        //是只需要拷贝的文件
        if (onlyCopyExtension.some(i => child.endsWith(i))) {
            return copy(relativePath)
        }

        //转译文件
        const source = fs.readFileSync(fullPath).toString('utf8')
        const filename = child.substring(child.lastIndexOf('/'))
        const compiled = compile(filename, source)
        //改变文件后缀：.vue -> .js
        write(relativePath.substring(0, relativePath.lastIndexOf('.')) + '.js', compiled)
    })
}

//将指定目录或文件复制到输出目录
function copy(relativePath) {
    const src = inputDir + relativePath
    const dest = outputDir + relativePath

    if (!fs.existsSync(dest)) {
        mkdirWhenNoExist(relativePath)
    }

    const stat = fs.statSync(src)

    //目录时递归
    if (stat.isDirectory()) {
        return fs.readdirSync(src).forEach(file => copy(relativePath + '/' + file))
    }

    fs.copyFileSync(src, dest)
}

//将内容写入到输出目录下的指定文件
function write(relativePath, data) {
    const lastIndex = relativePath.lastIndexOf('/')

    //不是'/index.js'的形式
    if (lastIndex > 1) {
        const destDir = outputDir + relativePath.slice(0, lastIndex)
        if (!fs.existsSync(destDir)) {
            mkdirWhenNoExist(relativePath)
        }
    }

    fs.writeFileSync(outputDir + '/' + relativePath, data)
}

//指定目录不存在于输出目录中时新建一个
function mkdirWhenNoExist(relativePath) {
    //带'.'的认为是文件而非目录
    const pathList = relativePath.split('/').filter(i => i && !i.includes('.'))

    for (let i = 0, path = outputDir; i < pathList.length; i++) {
        path += '/' + pathList[i]
        !fs.existsSync(path) && fs.mkdirSync(path)
    }
}

function main() {
    const start = Date.now()
    console.log('\033[44;30m START \033[40;34m Start Compilation ... \033[0m\n')

    fs.existsSync(outputDir) && rimraf.sync(outputDir)
    fs.mkdirSync(outputDir)

    handler(fs.readdirSync(inputDir))

    const spend = Date.now() - start
    console.log('\033[42;30m DONE \033[40;32m Finish Compilation in ' + spend + 'ms\033[0m')
}

main()
