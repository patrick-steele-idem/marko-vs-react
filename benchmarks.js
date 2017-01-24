var fs = require('fs');
var path = require('path');

var benchmarksDir = path.join(__dirname, 'benchmarks');

var benchmarks = [];

fs.readdirSync(benchmarksDir).forEach((benchmarkName) => {
    var benchmarkDir = path.join(benchmarksDir, benchmarkName);

    if (!fs.statSync(benchmarkDir).isDirectory()) {
        // Only look at directories
        return;
    }

    var benchmark = {
        name: benchmarkName,
        dir: benchmarkDir,
        benches: [],
        createRoute: require(path.join(benchmarkDir, 'createRoute'))
    };

    benchmarks.push(benchmark);

    fs.readdirSync(benchmarkDir).forEach((libName) => {
        if (libName === 'util') {
            return;
        }

        var libDir = path.join(benchmarkDir, libName);
        if (!fs.statSync(libDir).isDirectory()) {
            // Only look at directories
            return;
        }
        var bench = {
            dir: libDir,
            name: libName,
            url: `/${benchmarkName}/${libName}`,

        };

        benchmark.benches.push(bench);
    });
});

module.exports = benchmarks;