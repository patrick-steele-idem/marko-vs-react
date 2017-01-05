var measurePageCycling = require('~/src/shared/util/measurePageCycling');

module.exports = {
    getTemplateData: function(state, input) {
        return input.searchResultsData;
    },

    handleStartButtonClick: function() {
        var self = this;
        var searchResultsData;

        // Start cycling through search result pages and update the DOM
        // after receiving each search results page
        measurePageCycling(
            function updateDOM(newSearchResultsData, done) {
                searchResultsData = newSearchResultsData;
                self.setProps({
                    searchResultsData: searchResultsData
                });
                self.update();
                done();
            });
    }
};