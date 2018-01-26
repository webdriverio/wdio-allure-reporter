'use strict'
const { feature } = require('./../../../build/reporter').Api

describe('A passing Suite', () => {
    it('with passing test', () => {
        feature(browser.desiredCapabilities.browserName)
    })
})
