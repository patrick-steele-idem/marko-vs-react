'use strict';

require('../init');
var path = require('path');
var fs = require('fs');
var generateReports = require('./generateReports');
var collectStats = require('./collectStats');
var benchmarks = require('../benchmarks');

var outputDir = path.join(__dirname, '../generated');


function runBenchmark(benchmark) {
    var statsByLibName = {};
    var promiseChain = Promise.resolve();

    benchmark.benches.forEach((bench) => {
        promiseChain = promiseChain.then(() => {
            return collectStats(benchmark, bench)
                .then((stats) => {
                    statsByLibName[bench.name] = stats;
                });
        });
    });

    return promiseChain.then(() => {
        return statsByLibName;
    });
}

function run() {
    try {
        fs.mkdirSync(outputDir);
    } catch(e) {}

    var stats = {};

    var promiseChain = Promise.resolve();
    benchmarks.forEach((benchmark) => {
        promiseChain = promiseChain.then(() => {
            return runBenchmark(benchmark)
                .then((benchmarkStats) => {
                    stats[benchmark.name] = benchmarkStats;
                });
        });
    });

    return promiseChain.then(() => {
        return stats;
    });
}

run()
    .then((stats) => {
        console.log('Stats collection successfully completed!');

        var json = JSON.stringify(stats, null, 2);
        fs.writeFileSync(path.join(outputDir, 'data.json'), json, 'utf8');

        return generateReports(
            stats,
            {
                outputDir: outputDir
            });
    })
    .catch((err) => {
        console.error('Stats collection failed. Error:', err.stack || err);
        process.exit(1);
    });