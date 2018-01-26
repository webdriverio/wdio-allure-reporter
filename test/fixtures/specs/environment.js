'use strict'

const { addEnvironment } = require('./../../../build/reporter').Api

describe('Suite with environments', () => {
    it('First case', () => {
        addEnvironment('BROWSER', 'Chrome')
        addEnvironment('ENVIRONMENT', 'TEST')
    })

    it('Second case', () => {
        addEnvironment('BROWSER', 'Firefox')
    })
})
