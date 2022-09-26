"use strict";

import BGContactListViewItemView from "./BGContactListViewItemView.js";

export default class BGContactListViewLeaderboardView extends BGContactListViewItemView {
    _applyData() {
        const data = this._data;

        this.name = data.name;
        this.detail = `${data.score} 🍀`;
        this.rank = data.rank;
    }

    get name() {
        return this.nameLabel.text;
    }

    set name(value) {
        this.nameLabel.text = value;
    }

    get rank() {
        this.contactLabel.text;
    }

    set rank(value) {
        this.contactLabel.text = `${value}`;
    }
}