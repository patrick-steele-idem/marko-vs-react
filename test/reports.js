var series = require('async').series;

exports.generate = function generate(data, options, callback) {
    var reportTasks = [];

    reportTasks.push(function(callback) {
        require('./reports-summary').generate(data, options, callback);
    });

    reportTasks.push(function(callback) {
        require('./reports-csv').generate(data, options, callback);
    });

    series(reportTasks,
        function(err) {
            if (err) {
                throw err;
            }
        });
};