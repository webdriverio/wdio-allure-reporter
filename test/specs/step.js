import { expect } from 'chai'
import { clean, run, getResultFiles, getResultFileValue } from '../helper'

describe('Step', () => {
    beforeEach(clean)

    it('should add step to the test', () => {
        return run(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Create step')
            expect(result('test-case > name').eq(0).text()).to.be.equal('Step with attachment')
            expect(result('test-case attachment[title="body label"]')).to.have.lengthOf(1)
        })
    })

    it('should have attachment', () => {
        return run(['step']).then((results) => {
            const txtAttachment = getResultFiles('txt')
            expect(txtAttachment).to.have.lengthOf(1)

            const attachmentValue = getResultFileValue(txtAttachment)
            expect(attachmentValue).to.be.equal('body value')
        })
    })
})
