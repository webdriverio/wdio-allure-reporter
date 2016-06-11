'use strict'

var expect = require('chai').expect

describe('Screenshot during "after all" hook', () => {
    after(() => {
        return browser.screenshot()
    })

    it('with passing test', () => {
        return browser.url('/index.html')
      .waitForExist('#clickable')
      .click('#clickable')
      .getValue('#result')
      .then((value) => {
          expect(value).to.be.equal('1')
      })
    })
})
