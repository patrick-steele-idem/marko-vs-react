var template = require('marko').load(require.resolve('./template.marko'));
var searchService = require('src/shared/services/search');

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    template.render({
        searchResults: function(callback) {
            // Perform a search and invoke the provided callback
            // with the data when the data is available. The data
            // is then made available in the Marko template to
            // complete the rendering of the async fragment
            searchService.performSearch({}, callback);
        }
    }, res);
};