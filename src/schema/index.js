const items = [];

require('fs').readdirSync(__dirname + '/').forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        file.replace('.js', '');
        items.push(require('./' + file));
    }
});

module.exports = items;
