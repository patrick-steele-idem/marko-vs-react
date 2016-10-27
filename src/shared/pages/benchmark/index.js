var template = require('./template.marko');

module.exports = function(req, res) {
    res.marko(template);
};