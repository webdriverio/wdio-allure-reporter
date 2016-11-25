'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _allureJsCommons = require('allure-js-commons');

var _allureJsCommons2 = _interopRequireDefault(_allureJsCommons);

var _allureJsCommonsRuntime = require('allure-js-commons/runtime');

var _allureJsCommonsRuntime2 = _interopRequireDefault(_allureJsCommonsRuntime);

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var AllureReporter = (function (_events$EventEmitter) {
    _inherits(AllureReporter, _events$EventEmitter);

    function AllureReporter(baseReporter, config) {
        var _this = this;

        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, AllureReporter);

        _get(Object.getPrototypeOf(AllureReporter.prototype), 'constructor', this).call(this);

        this.baseReporter = baseReporter;
        this.config = config;
        this.options = options;
        this.outputDir = this.options.outputDir || 'allure-results';
        this.allure = new _allureJsCommons2['default']();
        this.runtime = new _allureJsCommonsRuntime2['default'](this.allure);

        this.allure.setOptions({
            targetDir: this.outputDir
        });

        var epilogue = this.baseReporter.epilogue;

        this.on('end', function () {
            try {
                _this.parseStats(_this.baseReporter.stats);
            } catch (e) {
                var logFile = require('path').join(process.cwd(), 'allure-reporter-debug.log');
                require('fs').writeFileSync(logFile, JSON.stringify(_this.baseReporter.stats));

                console.error('Failed parsing stats for Allure reporter: ' + e.message + '. Dumped this.baseReporter.stats to ' + logFile + '.');
                console.error(e.stack);
            }

            epilogue.call(baseReporter);
        });
    }

    _createClass(AllureReporter, [{
        key: 'parseStats',
        value: function parseStats(stats) {
            this.commandOutput = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _getIterator(_Object$keys(stats.runners)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cid = _step.value;

                    var runner = stats.runners[cid];

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _getIterator(_Object$keys(runner.specs)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var specId = _step2.value;

                            var spec = runner.specs[specId];
                            this.sessionID = runner.sessionID;

                            // Save any pre-test commands and output
                            this.preTestOutput = spec.output;

                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = _getIterator(_Object$keys(spec.suites)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var suiteName = _step3.value;

                                    var suite = spec.suites[suiteName];
                                    this.allure.startSuite(suiteName, suite.start.getTime());

                                    var _iteratorNormalCompletion4 = true;
                                    var _didIteratorError4 = false;
                                    var _iteratorError4 = undefined;

                                    try {
                                        for (var _iterator4 = _getIterator(_Object$keys(suite.tests)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                            var testName = _step4.value;

                                            var test = suite.tests[testName];

                                            if (test.state === 'pending') {
                                                this.allure.pendingCase(testName, test.start.getTime());
                                                continue;
                                            }

                                            this.allure.startCase(testName, test.start.getTime());
                                            this.openSteps = 0;

                                            this.runtime.addEnvironment('capabilities', runner.sanitizedCapabilities);
                                            this.runtime.addEnvironment('baseUrl', runner.config.baseUrl);
                                            this.runtime.addEnvironment('spec files', spec.files);

                                            if (this.preTestOutput && this.preTestOutput.length) {
                                                this.startStep('before first test', this.preTestOutput[0].payload.time.getTime());
                                                this.addOutput(this.preTestOutput);
                                                this.flushCommandOutput();
                                                var endTime = this.preTestOutput[this.preTestOutput.length - 1].payload.time.getTime();
                                                this.endStep('passed', endTime);
                                                this.reconcileSteps(endTime);
                                                delete this.preTestOutput;
                                            }

                                            this.addOutput(test.output);
                                            this.reconcileSteps();

                                            if (this.commandOutput.length) {
                                                this.startStep('after last command');
                                                this.flushCommandOutput();
                                                this.endStep('passed');
                                            }

                                            if (test.state === 'pass') {
                                                this.allure.endCase('passed');
                                            } else if (test.error && test.error.type === 'AssertionError') {
                                                this.allure.endCase('failed', test.error);
                                            } else {
                                                this.allure.endCase('broken', test.error);
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError4 = true;
                                        _iteratorError4 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                                _iterator4['return']();
                                            }
                                        } finally {
                                            if (_didIteratorError4) {
                                                throw _iteratorError4;
                                            }
                                        }
                                    }

                                    this.allure.endSuite(spec.suites[suiteName].end && spec.suites[suiteName].end.getTime());
                                    console.log('Wrote Allure report for ' + suiteName + ' to [' + this.outputDir + '].');
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                        _iterator3['return']();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                _iterator2['return']();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'padTime',
        value: function padTime(num) {
            var size = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

            if (num >= Math.pow(10, size - 1)) return num;
            return (Math.pow(10, size) + num).toString().substring(1);
        }
    }, {
        key: 'formatTime',
        value: function formatTime(time) {
            return this.padTime(time.getHours()) + ':' + this.padTime(time.getMinutes()) + ':' + this.padTime(time.getSeconds()) + '.' + this.padTime(time.getMilliseconds(), 3);
        }
    }, {
        key: 'stripSessionId',
        value: function stripSessionId(path) {
            return path.replace(new RegExp('^.*?' + this.sessionID), '');
        }
    }, {
        key: 'addOutput',
        value: function addOutput(events) {
            var _this2 = this;

            this.commandOutput = [];
            events.map(function (event, index) {
                switch (event.type) {
                    case 'beforecommand':

                        // TODO: Don't show args if they are empty. Don't show args if they are a
                        // JSON WebElement. Truncate args length. Are userland custom commands
                        // shown in the 'Selenium log' file? If not, add them to
                        // this.commandOutput
                        _this2.startStep(event.payload.command + ' ' + JSON.stringify(event.payload.args), event.payload.time.getTime());
                        break;
                    case 'aftercommand':
                        _this2.flushCommandOutput();
                        _this2.endStep('passed', event.payload.time.getTime());
                        break;
                    case 'command':
                        _this2.commandOutput.push(_this2.formatTime(event.payload.time) + ' COMMAND: ' + event.payload.method.toUpperCase() + ' ' + _this2.stripSessionId(event.payload.uri.path) + ' - ' + _this2.format(event.payload.data) + '\n\n');
                        break;
                    case 'result':
                        _this2.commandOutput.push(_this2.formatTime(event.payload.time) + ' RESULT: ' + _this2.format(event.payload.body.value) + '\n\n');
                        break;
                    case 'screenshot':
                        var penultimateEvent = events[index - 2];
                        var screenshotCommands = [];
                        var screenshotStart = event.payload.time.getTime();
                        var screenshotEnd = screenshotStart;

                        if (penultimateEvent && penultimateEvent.type === 'command' && penultimateEvent.payload.uri.path.match(/screenshot/i)) {
                            screenshotStart = penultimateEvent.payload.time.getTime();
                            screenshotCommands.unshift(_this2.commandOutput.pop());
                            screenshotCommands.unshift(_this2.commandOutput.pop());
                        }
                        _this2.flushCommandOutput();

                        _this2.startStep('screenshot', screenshotStart);
                        _this2.allure.addAttachment(event.payload.filename || event.payload.title + ' @ ' + event.payload.parent, new Buffer(event.payload.data, 'base64'));

                        if (screenshotCommands.length) {
                            _this2.commandOutput.push(screenshotCommands.shift());
                            _this2.commandOutput.push(screenshotCommands.shift());
                            _this2.flushCommandOutput();
                        }

                        _this2.endStep('passed', screenshotEnd);
                        break;
                    case 'log':
                        _this2.commandOutput.push(_this2.formatTime(event.payload.time) + ' LOG: ' + _this2.format(event.payload.data) + '\n\n');
                        break;
                }
            });
        }
    }, {
        key: 'flushCommandOutput',
        value: function flushCommandOutput() {
            var name = arguments.length <= 0 || arguments[0] === undefined ? 'Selenium log' : arguments[0];

            if (!this.commandOutput.length) return;
            this.allure.addAttachment(name, new Buffer(this.commandOutput.join('')));
            this.commandOutput = [];
        }
    }, {
        key: 'startStep',
        value: function startStep(stepName, timestamp) {
            this.allure.startStep(stepName, timestamp);
            this.openSteps++;
        }
    }, {
        key: 'endStep',
        value: function endStep(status, timestamp) {
            this.allure.endStep(status, timestamp);
            this.openSteps--;
        }
    }, {
        key: 'getCurrentStep',
        value: function getCurrentStep() {
            return this.allure.getCurrentSuite().currentStep;
        }
    }, {
        key: 'reconcileSteps',
        value: function reconcileSteps(timestamp) {
            while (this.openSteps > 0) {
                this.endStep('broken', timestamp);
            }
        }
    }, {
        key: 'format',
        value: function format(val) {
            return JSON.stringify(this.baseReporter.limit(val));
        }
    }]);

    return AllureReporter;
})(_events2['default'].EventEmitter);

exports['default'] = AllureReporter;
module.exports = exports['default'];
