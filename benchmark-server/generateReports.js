var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function generateReports(data, options) {
    var promiseChain = Promise.resolve();
    var outputDir = options.outputDir;

    Object.keys(data).forEach((benchmarkName) => {
        var reportOptions = {
            outputDir: path.join(outputDir, benchmarkName)
        };

        try {
            mkdirp.sync(reportOptions.outputDir);
        } catch(e) {}

        var benchmarkStats = data[benchmarkName];
        console.log(benchmarkName);
        console.log('==============================');
        promiseChain = promiseChain
            .then(() => {
                return require('./reports-summary').generate(benchmarkStats, reportOptions);
            })
            .then(() => {
                return require('./reports-csv').generate(benchmarkStats, reportOptions);
            });
    });

    return promiseChain;
};