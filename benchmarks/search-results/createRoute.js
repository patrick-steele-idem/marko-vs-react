'use strict';

var searchService = require('./util/search');
var pageLayoutTemplate = require('./page.marko');

module.exports = function createRoute(libName, options) {
    var pageTemplate = require(`./${libName}/page.marko`);

    return function(req, res) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');

        pageTemplate.render({
            $global: {
                jsBundle: options.jsBundle,
                title: libName
            },
            pageLayout: pageLayoutTemplate,
            searchResults: searchService.performSearch({})
        }, res);

        res.on('error', function(err) {
            console.error('ERROR:', err);
        });
    };
};