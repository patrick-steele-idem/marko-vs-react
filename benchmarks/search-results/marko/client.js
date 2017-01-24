var app = require('./components/app');
require('marko/widgets').initWidgets();

window.addBench('marko', function(el, getNextSearchResults) {

    var widget = app.renderSync({
            searchResultsData: getNextSearchResults()
        })
        .appendTo(el)
        .getWidget();

    return function(done) {
        widget.setProps({
            searchResultsData: getNextSearchResults()
        });

        widget.update();
        done();
    };
});