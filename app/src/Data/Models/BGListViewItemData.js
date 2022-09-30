/**
 * this class is the base data source for all item views, it encapsulates a unique id and general infos shared by any list item
 */
export default class BGListViewItemData {
    constructor(id, createdAt, updatedAt) {
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }
}