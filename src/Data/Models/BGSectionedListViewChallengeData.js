"use strict";

import BGSectionedListViewItemData from "./BGSectionedListViewItemData.js";

export default class BGSectionedListViewChallengeData extends BGSectionedListViewItemData {

    constructor(id, createdAt, updatedAt, title, description, duration, score, origin, author, timestamp) {
        super(id, createdAt, updatedAt);

        this._title = title;
        this._description = description;
        this._duration = duration;
        this._score = score;
        this._origin = origin; 
        this._author = author;
        this._timestamp = timestamp;
    }

    get timestamp() {
        return this._timestamp;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get duration() {
        return this._duration;
    }

    get score() {
        return this._score;
    }

    get origin() {
        return this._origin;
    }

    get author() {
        return this._author;
    }
}