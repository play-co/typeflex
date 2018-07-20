import { YGDirection } from './enums';
import { YGFloatOptional } from './ygfloatoptional';
import { YGCachedMeasurement } from './internal';
import { YGFloatArrayEqual } from "./utils";
import { YGFloatIsUndefined } from "./yoga";

const kYGDefaultDimensionValues: [number, number] = [undefined, undefined];
const YG_MAX_CACHED_RESULT_COUNT: number = 16;

class YGLayout {
    public position: [number, number, number, number];
    public dimensions: [number, number];
    public margin: [number, number, number, number, number, number];
    public border: [number, number, number, number, number, number];
    public padding: [number, number, number, number, number, number];
    public direction: YGDirection;

    public computedFlexBasisGeneration: number;
    public computedFlexBasis: YGFloatOptional;
    public hadOverflow: boolean;

    public generationCount: number;
    public lastOwnerDirection: YGDirection;

    public nextCachedMeasurementsIndex: number;
    public cachedMeasurements: Array<YGCachedMeasurement>;
    public measuredDimensions: Array<number>;

    public cachedLayout: YGCachedMeasurement;
    public didUseLegacyFlag: boolean;
    public doesLegacyStretchFlagAffectsLayout: boolean;

    constructor() {
        this.dimensions = kYGDefaultDimensionValues;
        this.direction = YGDirection.Inherit;
        this.computedFlexBasisGeneration = 0;
        this.computedFlexBasis = new YGFloatOptional();
        this.hadOverflow = false;
        this.generationCount = 0;
        this.lastOwnerDirection = YGDirection.RTL;
        this.nextCachedMeasurementsIndex = 0;
        this.measuredDimensions = kYGDefaultDimensionValues;
        this.cachedLayout = new YGCachedMeasurement();
        this.didUseLegacyFlag = false;
        this.doesLegacyStretchFlagAffectsLayout = false;
    }

    equal(layout: YGLayout) : boolean {
        let isEqual: boolean = YGFloatArrayEqual(this.position, layout.position) &&
                               YGFloatArrayEqual(this.dimensions, layout.dimensions) &&
                               YGFloatArrayEqual(this.margin, layout.margin) &&
                               YGFloatArrayEqual(this.border, layout.border) &&
                               YGFloatArrayEqual(this.padding, layout.padding) &&
                               this.direction == layout.direction &&
                               this.hadOverflow == layout.hadOverflow &&
                               this.lastOwnerDirection == layout.lastOwnerDirection &&
                               this.nextCachedMeasurementsIndex == layout.nextCachedMeasurementsIndex &&
                               this.cachedLayout == layout.cachedLayout &&
                               this.computedFlexBasis == layout.computedFlexBasis;
        
        for (let i = 0; i < YG_MAX_CACHED_RESULT_COUNT && isEqual; ++i) {
            isEqual = isEqual && this.cachedMeasurements[i] == layout.cachedMeasurements[i];
        }

        if (!YGFloatIsUndefined(this.measuredDimensions[0]) || !YGFloatIsUndefined(layout.measuredDimensions[0])) {
            isEqual = isEqual && (this.measuredDimensions[0] == layout.measuredDimensions[0]);
        }

        if (!YGFloatIsUndefined(this.measuredDimensions[1]) || !YGFloatIsUndefined(layout.measuredDimensions[1])) {
            isEqual = isEqual && (this.measuredDimensions[1] == layout.measuredDimensions[1]);
        }

        return isEqual;
    }

    diff(layout: YGLayout): boolean {
        return !this.equal(layout);
    }

    clean(): void {
        this.dimensions = kYGDefaultDimensionValues;
        this.direction = YGDirection.Inherit;
        this.computedFlexBasisGeneration = 0;
        this.computedFlexBasis = new YGFloatOptional();
        this.hadOverflow = false;
        this.generationCount = 0;
        this.lastOwnerDirection = YGDirection.RTL;
        this.nextCachedMeasurementsIndex = 0;
        this.measuredDimensions = kYGDefaultDimensionValues;
        this.cachedLayout = new YGCachedMeasurement();
        this.didUseLegacyFlag = false;
        this.doesLegacyStretchFlagAffectsLayout = false;
    }
}

export {
    YGLayout
};