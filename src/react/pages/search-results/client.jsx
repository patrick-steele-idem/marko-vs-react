// React looks at process.env.NODE_ENV to enable/disable performance gathering...
process.env.NODE_ENV = 'production';

var React = require('react/dist/react.min.js');
var ReactDOM = require('react-dom/dist/react-dom.min.js');

var SearchResults = require('~/src/react/components/SearchResults');

var mountNode = document.getElementById("searchResultsMount");

ReactDOM.render(
    <SearchResults searchResultsData={window.searchResultsData}/>,
    mountNode);

console.log('Re-rendering on client completed');