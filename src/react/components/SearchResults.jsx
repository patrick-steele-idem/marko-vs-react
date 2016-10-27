var React = require('react');
var SearchResultsItem = require('~/src/react/components/SearchResultsItem');
var Footer = require('~/src/react/components/Footer');
var measurePageCycling = require('~/src/shared/util/measurePageCycling');

module.exports = React.createClass({
      getInitialState: function() {
          return {
              searchResultsData: this.props.searchResultsData || []
          }
      },

      handleStartButtonClick: function() {
          var self = this;

          /**
           * This function will be called for each test pass. When
           * the changes have been fully flushed to the DOM the
           * provided "next" function should be invoked to run
           * the next test pass.
           *
           * @param {Object}    searchResultsData  The raw search results data
           * @param {Function}  done               Function to trigger the next test pass when done
           */
          function updateDOM(searchResultsData, done) {
              // Trigger an update of the DOM by updating the internal state
              // with the new search results data. When the changes
              // are flushed to the DOM we invoke the provided callback.
              self.setState({
                  searchResultsData: searchResultsData
              }, done);
          }

          // Start the client-side performance test
          measurePageCycling(updateDOM);
      },

      render: function () {
          var searchResultsData = this.state.searchResultsData;

          return (
              <div className="search-results">
                  <button type="button" onClick={this.handleStartButtonClick}>
                      Start Client Performance Tests
                  </button>
                  <div>
                  {searchResultsData.items.map(function(item, i) {
                      return <SearchResultsItem key={i} itemData={item}/>
                  })}
                  </div>
                  <Footer/>
              </div>
          );
      }
});