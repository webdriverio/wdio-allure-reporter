export const PASSED = 'passed'
export const FAILED = 'failed'
export const BROKEN = 'broken'

export function getTestStatus (test, config) {
    let status = FAILED

    if (config.framework === 'jasmine') {
        return status
    }

    if (test.err.name) {
        status = test.err.name === 'AssertionError' ? FAILED : BROKEN
    } else {
        const stackTrace = test.err.stack.trim()
        status = stackTrace.startsWith('AssertionError') ? FAILED : BROKEN
    }
    return status
}

export function isEmpty (object) {
    return !object || Object.keys(object).length === 0
}

export function attachCucumberArgument (allure, argument) {
    if (!argument) {
        return
    }

    argument = Array.isArray(argument)
        ? argument[0]
        : argument

    let attachmentContent, argumentType

    if (typeof argument === 'string') {
        argumentType = 'DocString'
        attachmentContent = argument
    } else if (typeof argument === 'object') {
        argumentType = 'DataTable'
        attachmentContent = argument.rows.reduce((memo, row) => `${memo}${row.cells.join(' | ')}\n`, '')
    } else {
        return
    }

    allure.startStep('Params', Date.now())
    allure.addAttachment(argumentType, attachmentContent, 'text/plain')
    allure.endStep(PASSED)
}
