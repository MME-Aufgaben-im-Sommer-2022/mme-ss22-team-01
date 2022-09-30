import BGListViewItemData from "./BGListViewItemData.js";

/**
 * this class is used to pose as data source for message items
 */
export default class BGListViewMessageItemData extends BGListViewItemData {
    constructor(id, createdAt, updatedAt, text, name, isForeign) {
        super(id, createdAt, updatedAt);

        this._text = text;
        this._name = name;
        this._isForeign = isForeign;
    }

    get text() {
        return this._text;
    }

    get name() {
        return this._name;
    }

    get isForeign() {
        return this._isForeign;
    }
}