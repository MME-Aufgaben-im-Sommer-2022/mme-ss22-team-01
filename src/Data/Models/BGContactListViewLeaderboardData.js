"use strict";

import BGListViewItemData from "./BGListViewItemData.js";

export default class BGListViewLeaderboardData extends BGListViewItemData {
    constructor(id, createdAt, updatedAt, name, score, rank) {
        super(id, createdAt, updatedAt);

        this._name = name;
        this._score = score;
        this._rank = rank;
    }

    get name() {
        return this._name;
    }

    get score() {
        return this._score;
    }

    get rank() {
        return this._rank;
    }
}