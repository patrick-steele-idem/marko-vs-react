var httpStats = require('http-stats');
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var series = require('async').series;
var reports = require('./reports');
var http = require('http');

var outputDir = path.join(__dirname, 'generated');

function cleanupStats(stats) {
    var steps = stats.steps;

    for (var i=0; i<steps.length; i++) {
        var stepStats = steps[i].stats;
        var usageArray = stepStats.usage;
        delete stepStats.usage;

        if (usageArray && usageArray.length) {
            stepStats.cpu = usageArray[0].cpu;
            stepStats.memory = usageArray[0].memory;
        }
    }

    return stats;
}

function run(callback) {
    var statsByName = {};

    function collectData(name, callback) {
        console.log('Starting server process for "' + name + '"...');

        var mainScript = path.join(__dirname, '../server.js');

        var serverProcess  = child_process.fork(
            mainScript,
            [],
            {
                cwd: process.cwd(),
                env: {
                    NODE_ENV: 'production'
                }
            });

        var killed = false;

        serverProcess.on('close', function(code) {
            killed = true;

            console.log('Server process exited with code ' + code + '\n');

            if (code !== 0) {
                return callback(new Error('FAILURE: Server process exited with code ' + code))
            }

            callback(null, statsByName);
        });

        var url = 'http://localhost:8080/' +  name;

        function saveResponseHTML(callback) {
            http.get(url, function(res) {
                    if (res.statusCode !== 200) {
                        throw new Error('Response not OK: ' + url);
                    }

                    var outputFilePath = path.join(outputDir, 'html-' + name + '.html');
                    res.pipe(fs.createWriteStream(outputFilePath, 'utf8'));
                    callback();
                });
        }

        function startMeasuring() {
            console.log('Collecting stats for ' + url + ' (pid: ' + serverProcess.pid + ')...');


            httpStats.measure({
                     url: url,
                     beginConcurrency: 1,
                     endConcurrency: 5,
                     stepRequests: 500,
                     pids: [serverProcess.pid],
                     report: {
                         outputDir: path.join(outputDir, 'html-report-' + name)
                     }
                },
                done);
        }

        function done(err, stats) {
            stats = cleanupStats(stats);
            statsByName[name] = stats;
            console.log('Completed stats collection for ' + url + ' (pid: ' + serverProcess.pid + ').\nKilling server process...');
            serverProcess.kill();
        }

        serverProcess.on('message', function(message) {
            if (message === 'online') {
                saveResponseHTML(function(err) {
                    if (err) {
                        throw err;
                    }
                    startMeasuring();
                });
            }
        });

        process.once('exit', function() {
            if (!killed) {
                serverProcess.kill();
            }
        });
    }

    series([
            function(callback) {
                collectData('marko', callback);
            },
            function(callback) {
                collectData('react', callback);
            }
        ],
        function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, statsByName);
        });
}

try {
    fs.mkdirSync(outputDir);
} catch(e) {}

run(function(err, results) {
    if (err) {
        throw err;
    }

    console.log('Stats collection successfully completed!');

    var json = JSON.stringify(results, null, 2);
    fs.writeFileSync(path.join(outputDir, 'data.json'), json, 'utf8');

    reports.generate(
        results,
        {
            outputDir: outputDir
        },
        function(err) {
            if (err) {
                throw err;
            }
        });
});
