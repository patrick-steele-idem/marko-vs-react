/** @jsx React.DOM */
var React = require('react');
var SearchResultsItem = require('src/react/components/SearchResultsItem');
var measurePageCycling = require('src/shared/util/measurePageCycling');

module.exports = React.createClass({
      getInitialState: function() {
          return {
              searchResultsData: this.props.searchResultsData || []
          }
      },

      componentDidUpdate: function() {
          var done = this.doneCallback;
          if (done) {
              this.doneCallback = null;
              done(); // All changes have been flushed to the DOM. Move to the next test pass...
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
              // We use the componentDidUpdate method to be notified when all
              // of the changes have been fully flushed to the DOM. When
              // the "componentDidUpdate" method is called by React, we invoke
              // the stored "done" function to move to the next test pass.
              self.doneCallback = done;

              // Trigger an update of the DOM by updating the internal state
              // with the new search results data. This will trigger a re-render
              // of this UI component and for the "componentDidUpdate" to
              // eventually be called by React
              self.setState({
                  searchResultsData: searchResultsData
              });
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
              </div>
          );
      }
});