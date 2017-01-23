var React = require('react');
var SearchResultsItem = require('~/src/react/components/SearchResultsItem');
var Footer = require('~/src/react/components/Footer');

module.exports = React.createClass({
    componentDidMount: function() {
        var timeToInteractive = Date.now() - window.startTime;
        console.log('TIME TO INTERACTIVE:', timeToInteractive + 'ms');
    },
    
    render: function () {
    var searchResultsData = this.props.searchResultsData;

    return (
            <div className="search-results">
                <div>
                {searchResultsData.items.map(function(item, i) {
                    return <SearchResultsItem key={item.id} itemData={item}/>
                })}
                </div>
                <Footer/>
            </div>
        );
    }
});