var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            purchased: false,
            itemData: this.props.itemData
        };
    },

    handleBuyButtonClick: function() {
        this.setState({ 'purchased': true });
    },

    render: function () {
        var itemData = this.state.itemData;
        var style = { backgroundColor: this.state.purchased ? '#f1c40f' : ''};

        return (
            <div className="search-results-item" style={style}>
                <h2>{itemData.title}</h2>
                <img src={itemData.image} alt={itemData.title}/>
                <span>{itemData.price}</span>

                {this.state.purchased ?
                   <div>Purchased!</div> :
                   <button type="button" onClick={this.handleBuyButtonClick}>
                       Buy now!
                   </button>
                }

            </div>
        );
    }
});


