import {expect} from 'chai'
import {Given, Then, When} from 'cucumber'

Given('I visit {string}', (url) => browser.url(url))

When('I click the clickable region', () => browser.click('#clickable'))

Then('I should get the result: {int}', (num) => {
    expect(num).to.be.equal(1)
})

Then('I run failing step', () => {
    expect(true).to.be.equal(false)
})

Then('I see steps after as pending', () => {
    expect(true).to.be.equal(true)
})

When('Step has DataTable parameter', param => {
    expect(param.rawTable).to.be.eql([ [ 'some', 'table' ], [ 'passed', 'into' ] ])
})

When('Step has DocString parameter', param => {
    expect(param).to.be.equal('some data here')
})
