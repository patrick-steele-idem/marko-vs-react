var template = require('marko').load(require.resolve('./template.marko'));

// Export a render(input) method that can be used
// to render this UI component on the client
// and get back an object that can be used to inject
// the rendered UI component into the DOM and to have
// binding of behavior occur after the resulting HTML
// is added to the DOM
require('marko-widgets').renderable(exports, function render(input, out) {
    var itemData = input.itemData;

    // Render the Marko template using the item
    // data as the view model:
    template.render(itemData, out);
});

function Widget() {

}

Widget.prototype = {
    /**
     * This method will be invoked by Marko Widgets when the "click"
     * event is detected on the button element since the following
     * code is used in the Marko template:
     * <button type="button" w-onclick="handleBuyButtonClick">
     *     ...
     * </button>
     */
    handleBuyButtonClick: function() {
        this.el.style.backgroundColor = 'yellow';
    }
};

exports.Widget = Widget;