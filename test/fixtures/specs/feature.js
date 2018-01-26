'use strict'

const { feature } = require('./../../../build/reporter').Api

describe('Suite with features', () => {
    it('First case', () => {
        feature('Test feature 1')
    })

    it('Second case', () => {
        feature('Test feature 2')
    })
})
