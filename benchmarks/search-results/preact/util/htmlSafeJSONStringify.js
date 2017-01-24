var escapeEndingScriptTagRegExp = /<\//g;

function htmlSafeJSONStringify(val) {
    return JSON.stringify(val).replace(escapeEndingScriptTagRegExp, '\\u003C/');
}

module.exports = htmlSafeJSONStringify;