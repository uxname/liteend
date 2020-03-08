const log = require('./Logger').getLogger('graphql_request_logger');
const graphql = require('graphql');

module.exports = class GraphqlRequestLogger {
    static log(httpRequest) {
        let result = [];
        const request = graphql.parse(httpRequest.body.query);
        request.definitions.forEach(definition => {
            definition.selectionSet.selections.forEach(selection => {
                result.push(selection.name.value);
            })
        });

        log.trace(`Requested root paths: [${result.join(', ')}]`);
    }
};


