import BGSectionedListViewHeaderView from "./BGSectionedListViewHeaderView.js";

/**
 * this view represents the header view of an section and extends BGSectionedListViewHeaderView to display a title
 */
export default class BGSectionedListViewTextHeaderView extends BGSectionedListViewHeaderView {
    /**
     * this method is overridden to set the title-labels text to the provided data object
     */
    _applyData() {
        this.title = this.data;
    }
}