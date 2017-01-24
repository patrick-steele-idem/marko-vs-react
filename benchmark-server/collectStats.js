var httpStats = require('http-stats');
var child_process = require('child_process');
var http = require('http');
var path = require('path');
var fs = require('fs');
var serverScriptPath = path.join(__dirname, '../server.js');
var rootOutputDir = path.join(__dirname, '../generated');
var mkdirp = require('mkdirp');

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

function collectStats(benchmark, bench) {
    var outputDir = path.join(rootOutputDir, benchmark.name, bench.name);
    try {
        mkdirp.sync(outputDir);
    } catch(e) {}

    var finalStats;

    var url = `http://localhost:8080/${benchmark.name}/${bench.name}/`;
    var killServerProcess;
    var isServerRunning = false;
    var serverProcess;

    return Promise.resolve()
        .then(function startServer() {
            console.log('Starting server process for "' + bench.name + '"...');

            serverProcess = child_process.fork(
                serverScriptPath,
                [],
                {
                    cwd: process.cwd(),
                    env: {
                        NODE_ENV: 'production'
                    }
                });

            function onProcessExit() {
                if (serverProcess) {
                    serverProcess.kill();
                    serverProcess = null;
                }
            }

            process.once('exit', onProcessExit);

            var killServerProcessPromise = new Promise((resolve, reject) => {
                serverProcess.on('close', function(code) {
                    isServerRunning = false;
                    process.removeListener('exit', onProcessExit);

                    console.log('Server process exited with code ' + code + '\n');

                    if (code !== 0) {
                        return reject(new Error('FAILURE: Server process exited with code ' + code));
                    }

                    serverProcess = null;
                    resolve();
                });
            });

            killServerProcess = function killServerProcess() {
                if (serverProcess) {
                    serverProcess.kill();
                    serverProcess = null;
                }

                return killServerProcessPromise;
            };

            return new Promise((resolve, reject) => {
                serverProcess.on('message', function(message) {
                    if (message === 'online') {
                        isServerRunning = true;
                        resolve();
                    }
                });
            });
        })
        .then(function saveResponseHTML() {
            return new Promise((resolve, reject) => {
                http.get(url, function(res) {
                    var outputFilePath = path.join(outputDir, 'output.html');
                    res
                        .pipe(fs.createWriteStream(outputFilePath, 'utf8'))
                        .on('error', function(err) {
                            reject(err);
                        })
                        .on('finish', function() {
                            if (res.statusCode !== 200) {
                                console.log('Output file: ' + outputFilePath);
                                throw new Error('Status code: ' + res.statusCode + ' - Response not OK: ' + url);
                            }

                            resolve();
                        });
                });
            });
        })
        .then(function startMeasuring() {
            return new Promise((resolve, reject) => {
                console.log('Collecting stats for ' + url + ' (pid: ' + serverProcess.pid + ')...');

                httpStats.measure({
                         url: url,
                         beginConcurrency: 1,
                         endConcurrency: 5,
                         stepRequests: 500,
                         pids: [serverProcess.pid],
                         report: {
                             outputDir: path.join(outputDir, 'html-report')
                         }
                    },
                    function done(err, httpStats) {
                        if (err) {
                            return reject(err);
                        }
                        finalStats = cleanupStats(httpStats);
                        console.log('Completed stats collection for ' + url + ' (pid: ' + serverProcess.pid + ').\nKilling server process...');
                        resolve();
                    });
            });
        })
        .then(function stopServer() {
            if (!isServerRunning) {
                throw new Error(`Server is not running for ${benchmark.name}/${bench.name}`);
            }

            return killServerProcess();
        })
        .then(() => {
            return finalStats;
        });
}

module.exports = collectStats;