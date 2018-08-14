import { expect } from 'chai';
import { clean, getResultFiles, getResultFileValue, runCucumber } from '../helper';

describe('Cucumber params attachments', () => {
    beforeEach(clean)

    const checkFn = results => {
        expect(results).to.have.lengthOf(1)

        const result = results[0]
        const attachments = result('test-case[status="passed"] step[status="passed"] attachment')

        expect(attachments).to.have.lengthOf(2)

        const dataTable = attachments.eq(0)
        const docString = attachments.eq(1)

        expect(dataTable.attr('title')).to.be.equal('DataTable')
        expect(docString.attr('title')).to.be.equal('DocString')
        expect(dataTable.attr('type')).to.be.equal('text/plain')
        expect(docString.attr('type')).to.be.equal('text/plain')

        const attachmentFileNames = getResultFiles('txt')

        const dataTableFile = attachmentFileNames.find(filename => filename === dataTable.attr('source'))
        const docStringFile = attachmentFileNames.find(filename => filename === docString.attr('source'))

        expect(getResultFileValue(dataTableFile)).to.be.equal(`some | table\npassed | into\n`)
        expect(getResultFileValue(docStringFile)).to.be.equal('some data here')
    }

    it('works with common', () => runCucumber(['withParam']).then(checkFn))

    it('works with cucumber', () =>
        runCucumber(['withParam'], './test/fixtures/wdio.conf/wdio.conf.cucumber.step.js')
            .then(checkFn))
})
