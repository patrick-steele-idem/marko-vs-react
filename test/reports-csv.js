var fs = require('fs');
var path = require('path');
var access = require('safe-access');

function CSVWriter() {
    this.lines = [];
    this.currentRow = null;
}

CSVWriter.prototype = {
    writeRow: function(values) {
        this.lines.push(values.join(','));
    },

    beginRow: function() {
        this.currentRow = [];
    },

    writeCol: function(value) {
        this.currentRow.push(value);
    },

    endRow: function() {
        this.writeRow(this.currentRow);
        this.currentRow = null;
    },

    writeFile: function(filename) {
        var output = this.lines.join('\n');
        fs.writeFileSync(filename, output, 'utf8');
    }
};

exports.generate = function generate(results, options, callback) {
    var outputDir = options.outputDir;
    var names = Object.keys(results);
    var first = results[names[0]];
    var stepCount = first.steps.length;


    function writeCSVFile(
        filename,
        prop) {


        var csvWriter = new CSVWriter();

        csvWriter.writeRow(['Concurrency'].concat(names));

        for (var stepIndex=0; stepIndex<stepCount; stepIndex++) {
            csvWriter.beginRow();

            for (var nameIndex=0; nameIndex < names.length; nameIndex++) {
                var name = names[nameIndex];
                var step = results[name].steps[stepIndex];

                if (nameIndex === 0) {
                    csvWriter.writeCol(step.concurrency);
                }

                var stepStats = step.stats;

                var value = access(stepStats, prop);
                if (typeof value === 'number') {
                    value = value.toFixed(2);
                }
                csvWriter.writeCol(value);
            }

            csvWriter.endRow();
        }

        csvWriter.writeFile(path.join(outputDir, filename + '.csv'));
    }

    writeCSVFile(
        'responseTime',
        'responseTime.mean');

    writeCSVFile(
        'requestsPerSecond',
        'requestsPerSecond.mean');

    writeCSVFile(
        'cpu',
        'cpu.mean');

    writeCSVFile(
        'memory',
        'memory.mean');
};