require('app-module-path').addPath(__dirname);
require('node-jsx').install({extension: '.jsx'});

var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var compression = require('compression');

var isProduction = process.env.NODE_ENV === 'production';

require('optimizer').configure({
    plugins: [
        'optimizer-marko',
        'optimizer-jsx'
    ],
    bundlingEnabled: isProduction ? true : false,
    minify: isProduction ? true : false,
    fingerprintsEnabled: isProduction ? true : false,
    outputDir: path.join(__dirname, 'static'),
    bundles: [
        { // Separate out the sample data into a separate bundle
            name: 'sample-data',
            dependencies: [
                'require: src/shared/services/seach-results-data.json'
            ]
        }
    ]
});

var app = express();
app.use(compression());
app.get('/marko', require('./src/marko/pages/search-results'));
app.get('/react', require('./src/react/pages/search-results'));
app.use('/static', serveStatic(path.join(__dirname, 'static')));
app.get('/', require('./src/shared/pages/index'));

var port = 8080;

app.listen(port, function(err) {
    if (err) {
        throw err;
    }

    console.log('Listening on port ' + port);

    if (process.send) {
        console.log('Server online');
        process.send('online'); // Let browser-refresh know we are ready to serve traffic
    }
});

process.on('SIGTERM', function() {
    process.exit(0);
});