var searchService = require('~/src/shared/services/search');
var markoSearchResultsComponent = require('~/src/marko/components/app-search-results');
var React = require('react');
var ReactSearchResults = require('~/src/react/components/SearchResults');
var ReactDOM = require('react-dom');

module.exports = function() {
    document.getElementById('mountRow').innerHTML = '';

    var mountEls = {};

    function createMountEl(name) {
        var mountEl = document.getElementById('mountRow')
            .appendChild(document.createElement('td'))
            .appendChild(document.createElement('div'));

        mountEl.className = 'benchmark-container';
        mountEl.id = ''

        mountEls[name] = mountEl;
        return mountEl;
    }

    function showMountEl(name) {
        for (var curName in mountEls) {
            var mountEl = mountEls[curName];
            if (curName === name) {
                mountEl.style.display = 'block';
            } else {
                mountEl.style.display = 'none';
            }
        }
    }

    return {
        benches: {
            marko: function(name) {
                var mountEl = createMountEl(name);
                var pageIndex = 0;

                function getNextSearchResults() {
                    return searchService.performSearch({ pageIndex: pageIndex++ });
                }

                var markoSearchResultsWidget = markoSearchResultsComponent
                    .renderSync({
                        searchResultsData: getNextSearchResults()
                    })
                    .appendTo(mountEl)
                    .getWidget();

                return {
                    onStart: function() {
                        pageIndex = 0;
                        showMountEl(name);
                    },
                    fn: function(done) {
                        markoSearchResultsWidget.setProps({
                            searchResultsData: getNextSearchResults()
                        });

                        markoSearchResultsWidget.update();
                        done();
                    }
                }
            },

            react: function() {
                var mountEl = createMountEl(name);
                var pageIndex = 0;

                function getNextSearchResults() {
                    return searchService.performSearch({ pageIndex: pageIndex++ });
                }

                ReactDOM.render(
                    <ReactSearchResults searchResultsData={getNextSearchResults()} />,
                    mountEl);

                return {
                    onStart: function() {
                        pageIndex = 0;
                        showMountEl(name);
                    },

                    fn: function(done) {
                        ReactDOM.render(
                            <ReactSearchResults searchResultsData={getNextSearchResults()} />,
                            mountEl,
                        done);


                    }
                };
            }
        }
    }
};