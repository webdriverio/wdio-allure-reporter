describe('suite', function () {
    it('test with leaked step', function () {
        return browser
            .url('/index.html')
            .then(function () {
                browser.click('#clickable').then(function () {
                    console.log('done')
                })
            })
    })
})
