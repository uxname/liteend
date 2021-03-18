const path = require('path');
const items = [];

require('fs').readdirSync(path.join(__dirname, '/')).forEach(file => {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        file.replace('.js', '');
        items.push(require('./' + file));
    }
});

module.exports = items;
