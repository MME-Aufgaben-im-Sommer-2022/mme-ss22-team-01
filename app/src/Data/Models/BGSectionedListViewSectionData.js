import BGListViewItemData from "./BGListViewItemData.js";

/**
 * this class is used to create the base data source class for list view sections
 */
export default class BGSectionedListViewSectionData extends BGListViewItemData {

    get items() {
        return this._items;
    }

    set items(value) {
        value.forEach(item => item.section = this);
        this._items = value;
    }

    get isEmpty() {
        return this.items.length < 1;
    }

    addItem(item) {
        item.section = this;
        this.items.push(item);
    }

    constructor(id, createdAt, updatedAt, items) {
        super(id, createdAt, updatedAt);
        
        this.items = items;
    }
}