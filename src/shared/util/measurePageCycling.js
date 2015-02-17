// Go through X number of search results pages before completing the test:
var TOTAL_CYCLE_COUNT = 100;

var searchService = require('src/shared/services/search');

module.exports = function measurePageCycling(updateDOMFunc) {
    var count = 0;

    var startTime = Date.now();

    /**
     * Function that gets invoked when all of the test passes
     * have completed.
     */
    function done(err) {
        var totalTime = Date.now() - startTime;
        console.log('Completed in ' + totalTime + 'ms!');
    }

    var pageIndex = 1;

    /**
     * The calling code will be given this code and when invoked
     * it will trigger the next pass of this test or if there
     * are no more tests then the test will be completed and the
     * results will be recorded to the console.
     */
    function next() {
        if (++count === TOTAL_CYCLE_COUNT) {
            done();
        } else {
            // process.nextTick(runNext);
            // setTimeout(runNext, 200);
            runNext();
        }
    }

    /**
     * Runs the next test pass by loading the search results for the next
     * page and providing the search results data to the calling code
     * so that it can go back and update the DOM.
     */
    function runNext() {
        // Incremenet the page index and then perform a search to
        // get the next page of search results
        pageIndex++;

        searchService.performSearch({
                pageIndex: pageIndex
            },
            function(err, searchResultsData) {
                if (err) {
                    return done(err);
                }

                // Search results have been updated so tell the calling
                // code to update the DOM using the new search results.
                // The "next" function that is provided to the calling code
                // should be invoked when the DOM has been *completely*
                // updated (i.e. all changes flushed to the DOM).
                updateDOMFunc(searchResultsData, next);
            });
    }

    runNext();
};