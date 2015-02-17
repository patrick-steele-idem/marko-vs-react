var template = require('marko').load(require.resolve('./template.marko'));

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    template.render({}, res);
};