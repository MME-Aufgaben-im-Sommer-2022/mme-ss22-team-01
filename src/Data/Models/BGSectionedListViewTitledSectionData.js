"use strict";

import BGSectionedListViewSectionData from "./BGSectionedListViewSectionData.js";

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