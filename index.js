const AllureReporter = require('./build/reporter')
const AllureApi = require('./build/runtime.js')

exports.default = AllureReporter
module.exports = exports['default']
module.exports.AllureApi = { AllureApi }
