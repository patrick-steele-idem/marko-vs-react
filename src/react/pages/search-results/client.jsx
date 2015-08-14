// React looks at process.env.NODE_ENV to enable/disable performance gathering...
process.env.NODE_ENV = 'production';

var React = require('react');
var ReactDOM = require('react-dom');

var SearchResults = require('src/react/components/SearchResults');

var mountNode = document.getElementById("searchResultsMount");

ReactDOM.render(
    <SearchResults searchResultsData={window.searchResultsData}/>,
    mountNode);

console.log('Re-rendering on client completed');