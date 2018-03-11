'use strict'
const reporter = require('./../../../build/reporter')

describe('Create step', () => {
    it('Step with attachment', () => {
        reporter.createStep('a step', 'body value', 'body label')
    })
})
