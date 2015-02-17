var fs = require('fs');
var path = require('path');
var access = require('safe-access');

function leftPad(str, length, c) {
    c = c || ' ';
    while (str.length < length) {
        str = c + str;
    }
    return str;
}
exports.generate = function generate(results, options, callback) {
    var outputDir = options.outputDir;
    var names = Object.keys(results);
    var first = results[names[0]];
    var stepCount = first.steps.length;

    var maxNameLength = 0;
    names.forEach(function(name) {
        maxNameLength = Math.max(name.length, maxNameLength);
    });

    var output = '';

    function write(text) {
        output += text;
    }

    function writeLine(text) {
        write(text ? text + '\n' : '\n');
    }

    function writeSectionHeader(label, dividerChar) {
        writeLine(label);

        var divider = '';
        for (var i=0; i<label.length; i++) {
            divider += dividerChar;
        }
        writeLine(divider);
        writeLine();
    }

    function format(value, unit) {
        if (value == null) {
            return '--';
        }

        if (unit === 'ms') {
            return Math.round(value) + ' ms';
        } else if (unit === '%') {
            return value.toFixed(2) + '%';
        } else {
            return value.toFixed(2) + ' ' + unit;
        }
    }

    function renderComparison(
        stepIndex,
        label,
        prop,
        unit,
        comparison) {

        var values = {};
        var max;
        var min;

        var minName;
        var maxName;

        names.forEach(function(name) {

            var stepStats = results[name].steps[stepIndex].stats;
            var value = access(stepStats, prop);
            if (max == null) {
                max = value;
                min = value;

                minName = name;
                maxName = name;
            } else {
                if (value > max) {
                    max = value;
                    maxName = name;
                }

                if (value < min) {
                    min = value;
                    minName = name;
                }
            }
            values[name] = value;
        });


        writeLine(label + ':');
        writeLine();

        names.forEach(function(name) {
            var value = values[name];
            var output = '  ' + leftPad(name, maxNameLength) + ': ' + leftPad(format(value, unit), 13);
            var suffix = '';
            var percentageDifference;

            if (comparison === 'lowerBetter') {
                if (minName === name) {
                    suffix = 'winner';
                } else {
                    percentageDifference = (value - min) / min * 100;
                    suffix += percentageDifference.toFixed(2) + '% worse';
                }
            } else if (comparison === 'higherBetter') {
                if (maxName === name) {
                    suffix = 'winner';
                } else {
                    percentageDifference = (max - value) / max * 100;
                    suffix += percentageDifference.toFixed(2) + '% worse';
                }
            }

            if (suffix) {
                output += ' (' + suffix + ')';
            }

            writeLine(output);
        });

        writeLine();
    }

    for (var stepIndex=0; stepIndex<stepCount; stepIndex++) {
        var concurrency = first.steps[stepIndex].concurrency;
        writeSectionHeader('Concurrency: ' + concurrency, '-');

        renderComparison(
            stepIndex,
            'Avg. response time',
            'responseTime.mean',
            'ms',
            'lowerBetter');

        renderComparison(
            stepIndex,
            'Avg. req/s',
            'requestsPerSecond.mean',
            'req/s',
            'higherBetter');

        renderComparison(
            stepIndex,
            'Avg. CPU',
            'cpu.mean',
            '%',
            'lowerBetter');

        renderComparison(
            stepIndex,
            'Avg. memory',
            'memory.mean',
            'MB',
            'lowerBetter');
    }

    console.log(output);
    fs.writeFile(path.join(outputDir, 'summary.txt'), output, 'utf8', callback);
};