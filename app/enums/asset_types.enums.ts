/**
 * class for asset types
 */
class AssetType{
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

export type AssetTypes = Array<AssetType>;

export const ASSETTYPES: AssetTypes = [
    new AssetType(''),
    new AssetType('cash'),
    new AssetType('fixed'),
    new AssetType('equity')
];
