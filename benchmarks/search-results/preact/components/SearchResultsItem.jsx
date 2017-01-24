var preact = require('preact');
var h = preact.h;
var Component = preact.Component;

module.exports = class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchased: false,
            item: this.props.item
        };

        this.handleBuyButtonClick = this.handleBuyButtonClick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.state = {
            purchased: false,
            item: this.props.item
        };
    }

    handleBuyButtonClick() {
        this.setState({ 'purchased': true });
    }

    render() {
        var item = this.state.item;
        var style = { backgroundColor: this.state.purchased ? '#f1c40f' : ''};

        return (
            <div className="search-results-item" style={style}>
                <h2>{item.title}</h2>
                <div class="lvpic pic img left">
            		<div class="lvpicinner full-width picW">
                        <a href={"/buy/" + item.id} class="img imgWr2">
            			     <img src={item.image} alt={item.title}/>
            			</a>
            		</div>
                </div>

                <span class="price">{item.price}</span>

                {this.state.purchased ?
                   <div class="purchased">Purchased!</div> :
                   <button class="buy-now" type="button" onClick={this.handleBuyButtonClick}>
                       Buy now!
                   </button>
                }

            </div>
        );
    }
};