var searchService = require('./util/search');

window.registerBenchmark(function(helpers) {
    return {
        createBench: function(libName, factoryFunc) {
            var mountEl = helpers.createMountEl(libName);
            var pageIndex = 0;

            function getNextSearchResults() {
                return searchService.performSearch({ pageIndex: pageIndex++ });
            }

            var fn = factoryFunc(mountEl, getNextSearchResults);

            return {
                onWarmup: function() {
                    pageIndex = 0;
                    helpers.showMountEl(libName);
                },
                onStart: function() {
                    pageIndex = 0;
                    helpers.showSingleMountEl(libName);
                },
                fn
            };
        }
    };
});