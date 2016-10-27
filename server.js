if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

require('require-self-ref');
require('marko/express');
require("babel-register")({
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: [".jsx"]
});

require('marko/node-require').install();
require('lasso/node-require-no-op').enable('.less', '.css');

require('marko/compiler').configure({
    assumeUpToDate: false
});

var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var compression = require('compression');

var isProduction = process.env.NODE_ENV === 'production';

require('lasso').configure({
    plugins: [
        {
            plugin: 'lasso-marko',
            config: {
                output: 'vdom'
            }
        },
        'lasso-jsx'
    ],
    bundlingEnabled: isProduction ? true : false,
    minify: isProduction ? true : false,
    fingerprintsEnabled: isProduction ? true : false,
    outputDir: path.join(__dirname, 'static'),
    bundles: [
        { // Separate out the sample data into a separate bundle
            name: 'sample-data',
            dependencies: [
                'require: ' + require.resolve('./src/shared/services/search-results-data.json')
            ]
        }
    ],
    require: {
        transforms: [
            require('envify')
        ]
    }
});

var app = express();
app.use(compression());
app.get('/benchmark', require('./src/shared/pages/benchmark'));
app.get('/marko', require('./src/marko/pages/search-results'));
app.get('/react', require('./src/react/pages/search-results'));
app.use('/static', serveStatic(path.join(__dirname, 'static')));
app.use('/images', serveStatic(path.join(__dirname, 'images')));
app.get('/', require('./src/shared/pages/index'));

var port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

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