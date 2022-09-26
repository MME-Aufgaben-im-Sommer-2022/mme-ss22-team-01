"use strict";

import BGSectionedListViewItemData from "./BGSectionedListViewItemData.js";

export default class BGListViewTeamItemData extends BGSectionedListViewItemData {

    constructor(id, createdAt, updatedAt, name, score, message = "") {
        super(id, createdAt, updatedAt);

        this._score = score;
        this._message = message;
        this._name = name;
    }

    get message() {
        return this._message;
    }

    get score() {
        return this._score;
    }

    get name() {
        return this._name;
    }
}