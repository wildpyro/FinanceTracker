'use strict';

exports.BaseLayout = class BaseLayout {
    constructor(layoutName, startPosition, endPosition, logicalRecordLength) {
        this.name = layoutName;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.logicalRecordLength = logicalRecordLength;     
    }
        
}
;