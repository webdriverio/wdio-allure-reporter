'use strict'

const {story} = require('./../../../build/reporter').Api

describe('Suite with stories', () => {
    it('Test #1', () => {
        story('Story label for Test #1')
    })

    it('Test #2', () => {
        story('Story label for Test #2')
    })
})
