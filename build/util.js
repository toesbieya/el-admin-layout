module.exports = {
    calcTimeCost(fun, startTip, doneTip) {
        const start = Date.now()
        module.exports.start(startTip)

        try {
            fun()
        }
        catch (e) {
            module.exports.error('There has been an error in program execution:')
            console.error(e)
            return
        }

        const spend = Date.now() - start
        module.exports.done(doneTip + ` in  ${spend}ms`)
    },

    start(content) {
        console.log('\033[44;30m START \033[40;34m ' + content + ' \033[0m\n')
    },
    done(content) {
        console.log('\033[42;30m DONE \033[40;32m ' + content + ' \033[0m\n')
    },
    error(content) {
        console.log('\033[41;30m ERROR \033[40;31m ' + content + ' \033[0m\n')
    }
}
