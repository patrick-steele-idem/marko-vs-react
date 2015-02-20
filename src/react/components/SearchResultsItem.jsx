/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            purchased: false
        };
    },

    handleBuyButtonClick: function() {
        this.setState({
            purchased: true
        });
    },

    render: function () {
        var itemData = this.props.itemData;

        var divStyle = {
            backgroundColor: this.state.purchased === true ? 'yellow': null
        };

        return (
            <div className="search-results-item" style={divStyle}>
                <h2>{itemData.title}</h2>
                <img src={itemData.image} alt={itemData.title}/>
                <span>{itemData.price}</span>
                <button type="button" onClick={this.handleBuyButtonClick}>
                    Buy now!
                </button>
            </div>
        );
    }
});


