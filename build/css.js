const fs = require('fs')
const path = require('path')
const sass = require("sass")
const {calcTimeCost} = require('./util')

function compile() {
    const tempFilePath = path.resolve(__dirname, 'temp.scss')
    const code = `@import '../src/style/index.scss';\n@import '../src/style/maxViewHeight.scss';`

    fs.writeFileSync(tempFilePath, code)

    const modulePath = path.resolve(__dirname, '../node_modules')

    try {
        const result = sass.renderSync({
            file: tempFilePath,
            outputStyle: 'compressed',
            importer(url, prev) {
                if (url.startsWith('~')) {
                    return {file: modulePath + '/' + url.substring(1)}
                }
                return {file: prev}
            }
        })

        fs.writeFileSync(path.resolve(__dirname, '../dist/index.css'), result.css)
    }
    catch (e){
        throw e
    }
    finally {
        fs.unlinkSync(tempFilePath)
    }
}

calcTimeCost(compile, 'Start scss compilation ...', 'Finish scss compilation')
