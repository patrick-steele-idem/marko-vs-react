var template = require('./template.marko');
var searchService = require('~/src/shared/services/search');

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    template.render({
        searchResults: searchService.performSearch({})
    }, res);
};