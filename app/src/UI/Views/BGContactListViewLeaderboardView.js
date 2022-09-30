import BGContactListViewItemView from "./BGContactListViewItemView.js";

/**
 * this view is used to adapt the default contact list item view for use in a leaderboard list.
 */
export default class BGContactListViewLeaderboardView extends BGContactListViewItemView {

    /**
     * this method is overridden from its superclass to assign properties from the data source to us elements
     */
    _applyData() {
        const data = this._data;

        this.name = data.name;
        this.detail = `${data.score} 🍀`;
        this.rank = data.rank;
    }

    /**
     * the getters below are used to manipulate the text in ui elements
     */
    get name() {
        return this.nameLabel.text;
    }

    set name(value) {
        this.nameLabel.text = value;
    }

    get rank() {
        return this.contactLabel.text;
    }

    set rank(value) {
        this.contactLabel.text = `${value}`;
    }
}