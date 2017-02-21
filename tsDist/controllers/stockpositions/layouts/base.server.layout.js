'use strict';
var _ = require('lodash');
/**
 * Add in all the children controllers
 */
module.exports = _.extend(require('./bns.server.layout'), require('./tangerine.server.layout'));
/*exports.BaseLayout = class BaseLayout {
    constructor(layoutName, startPosition, endPosition, logicalRecordLength) {
        this.name = layoutName;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.logicalRecordLength = logicalRecordLength;
    }
        
};*/
//# sourceMappingURL=base.server.layout.js.map