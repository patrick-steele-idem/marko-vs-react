var template = require('marko').load(require.resolve('./template.marko'));
var searchService = require('src/shared/services/search');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var SearchResults = require('src/react/components/SearchResults');

/**
 * Utility function to make sure ending <script> tags do not appear in the JSON
 * unescaped since that would prematurely end the containing <script> tag.
 */
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // We use a Marko template to generate the skeleton of the page,
    // and React is used to render the HTML that is injected into
    // the body of the page.
    template.render({
        searchResults: function(callback) {
            searchService.performSearch({}, function(err, searchResultsData) {
                if (err) {
                    return callback(err);
                }

                // Use React to render the SearchResults component to an HTML
                // string that will be provided to the page template:
                var searchResultsHTML = ReactDOMServer.renderToString(
                        <SearchResults searchResultsData={searchResultsData}/>);

                // Serialize the input data to JSON since we need to
                // re-render the SearchResults component on the client
                // to bootstrap the app on the client:
                var searchResultsJSON = safeStringify(searchResultsData);

                // Provide the HTML and JSON to the page template using
                // the async callback provided:
                callback(null, {
                    searchResultsHTML: searchResultsHTML, // <-- Body HTML
                    searchResultsJSON: searchResultsJSON  // <-- JSON data needed to re-render page on client
                });
            });
        }
    }, res);
};