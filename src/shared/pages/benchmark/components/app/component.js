require('./style.css');
var benchmark = require('~/src/shared/util/benchmark');

var benchmarks = {
    'search-results': require('./benchmark-search-results')
};

module.exports = {
    init: function() {
        this.running = false;
    },

    handleBenchmarkButtonClick: function(benchmarkName, event, el) {
        if (this.running) {
            return;
        }

        var oldButtonLabel = el.innerHTML;
        el.innerHTML = oldButtonLabel + ' - running...';

        var resultsEl = this.getEl('results');
        resultsEl.innerHTML  = '';

        var self = this;

        benchmark(benchmarkName, benchmarks[benchmarkName])
            .on('start', function(event) {
                resultsEl.innerHTML += 'Running "' + benchmarkName + '"...\n';
            })
            .on('startBench', function(bench) {
                resultsEl.innerHTML += 'Running benchmark "' + bench.name + '"...\n';
            })
            .on('warmup', function() {
                resultsEl.innerHTML += 'Warming up...\n';
            })
            .on('warmupComplete', function() {
                resultsEl.innerHTML += 'Warmup complete.\n';
            })
            .on('cycle', function(event) {
                resultsEl.innerHTML += event.resultsString + '\n';
            })
            .on('complete', function(event) {
                resultsEl.innerHTML += event.resultsString + '\n';
                el.innerHTML = oldButtonLabel;
                self.running = false;
            })
            .run()
            .catch(function(err) {
                resultsEl.innerHTML = err.stack || err;
                console.error('ERROR:', err.stack || err);
            });

    }
};