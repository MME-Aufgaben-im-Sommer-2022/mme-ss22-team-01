"use strict";

import BGListViewItemData from "./BGListViewItemData.js";

export default class BGSectionedListViewSectionData extends BGListViewItemData {

    get items() {
        return this._items;
    }

    set items(value) {
        value.forEach(item => item.section = this); //todo addItem
        this._items = value;
    }

    addItem(item) {
        item.section = this;
        this.items.push(item);
    }

    get isEmpty() {
        return this.items.length < 1;
    }

    constructor(id, createdAt, updatedAt, items) {
        super(id, createdAt, updatedAt);
        
        this.items = items;
    }

    matches(criteria) {
        return this.items.some(item => item.matches(criteria) === true);
    }
}