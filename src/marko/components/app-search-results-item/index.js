module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    getTemplateData: function(state, input) {
        return input.itemData;
    },

    handleBuyButtonClick: function() {
        this.el.style.backgroundColor = 'yellow';
    }
});