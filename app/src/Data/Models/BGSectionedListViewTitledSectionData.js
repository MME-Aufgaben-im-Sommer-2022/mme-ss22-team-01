import BGSectionedListViewSectionData from "./BGSectionedListViewSectionData.js";

/**
 * this class is extends a basic data source for any section for a header property to store a title
 */
export default class BGSectionedListViewTitledSectionData extends BGSectionedListViewSectionData {

    constructor(id, createdAt, updatedAt, items, header) {
        super(id, createdAt, updatedAt, items);
        
        this.header = header;
    }

    get header() {
        return this._header;
    }

    set header(value) {
        this._header = value;
    }
}