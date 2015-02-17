var path = require('path');
var outputDir = path.join(__dirname, 'generated');
var data = require('./generated/data.json');

require('./reports').generate(
    data,
    {
        outputDir: outputDir
    },
    function(err) {
        if (err) {
            throw err;
        }
    });