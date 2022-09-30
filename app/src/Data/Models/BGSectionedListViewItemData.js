import BGListViewItemData from "./BGListViewItemData.js";

/**
 * this class is used to extend list view data with a section attribute to keep a strong reference from any item to its group
 */
export default class BGSectionedListViewItemData extends BGListViewItemData {
    
    constructor(id, createdAt, updatedAt, section) {
        super(id, createdAt, updatedAt);

        this.section = section;
    }

    get section() {
        return this._section;
    }

    set section(value) {
        this._section = value;
    }
}