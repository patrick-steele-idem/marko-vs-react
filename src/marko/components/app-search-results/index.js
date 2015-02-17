var searchResultsItem = require('src/marko/components/app-search-results-item');
var measurePageCycling = require('src/shared/util/measurePageCycling');
// var dom = require('marko-widgets/dom');
var template = require('marko').load(require.resolve('./template.marko'));
var markoWidgets = require('marko-widgets');

// Export a render(input) method that can be used
// to render this UI component on the client
// and get back an object that can be used to inject
// the rendered UI component into the DOM and to have
// binding of behavior occur after the resulting HTML
// is added to the DOM
markoWidgets.renderable(exports, function render(input, out) {
    var searchResultsData = input.searchResultsData;

    // Render the Marko template using the search results
    // data as the view model:
    template.render(searchResultsData, out);
});

function searchResultsRenderer(searchResultsData, out) {
    // Loop over the search results items and invoke
    // the renderer for each item (passing in the input
    // and the out that we were given).
    searchResultsData.items.forEach(function(itemData) {
        searchResultsItem.renderer({
                itemData: itemData
            }, out);
    });
}

function Widget(config) {
    this.itemsEl = this.getEl('items');
}

Widget.prototype = {
    /**
     * Update the DOM based on the provided search results data.
     */
    renderSearchResults: function(searchResultsData) {
        // We created a separate searchResultsRenderer(input, out) function
        // that is used to produce the HTML output of rendering all of the
        // search result items. We then inject the HTML into the DOM
        // by replacing all of the children of our items container
        // with the new HTML.
        var renderResult = markoWidgets.render(searchResultsRenderer, searchResultsData);
        renderResult.replaceChildrenOf(this.itemsEl);
    },

    handleStartButtonClick: function() {
        var self = this;

        function updateDOM(searchResultsData, done) {
            self.renderSearchResults(searchResultsData); // Render the new search result items
            done(); // The DOM has been updated with the new search results item. Continue on...
        }

        // Start cycling through search result pages and update the DOM
        // after receiving each search results page
        measurePageCycling(updateDOM);
    }
};

exports.Widget = Widget;