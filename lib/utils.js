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
    } else if (test.err.stack) {
        var stackTrace = test.err.stack.trim();
        status = stackTrace.startsWith('AssertionError') ? FAILED : BROKEN;
    } else {
        status = BROKEN;
    }
    return status
}

export function isEmpty (object) {
    return !object || Object.keys(object).length === 0
}
