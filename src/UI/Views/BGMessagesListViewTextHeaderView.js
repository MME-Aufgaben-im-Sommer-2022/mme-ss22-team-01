import { Color, Corners, Label, Padding, RoundedCorner, StackView } from "../libs/WrappedUI.js";
import BGSectionedListViewTextHeaderView from "./BGSectionedListViewTextHeaderView.js";
/**
 * this view resembles the header of messages created at on day
 */
export default class BGMessagesListViewTextHeaderView extends BGSectionedListViewTextHeaderView {

    /**
     * the two methods below are used to manage/create the view hierarchy
     */
    _createTitleLabel() {
        const label = super._createTitleLabel();
        label.textAlignment = Label.TextAlignment.center;
        label.backgroundColor = Color.darkGreen;
        label.padding = Padding.axes("15px", "3px");
        label.corners = Corners.all(new RoundedCorner("10px"));
        label.fontWeight = Label.FontWeight.lighter;
        label.color = Color.white;
        label.fontSize = "10px";

        return label;
    }

    _createContentView() {
        const contentView = super._createContentView();
        contentView.mainAxisAlignment = StackView.MainAxisAlignment.center;

        return contentView;
    }

    /**
     * this method is used to update ui elements with corresponding data
     */
    _applyData() {
        this.title = this._formatDate(this.data);
    }

    /**
     * this method is used to display dates in a human readable format
     * @param {Date} date 
     * @returns 
     */
    _formatDate(date) {
        return `${date.getDate()}.${date.getMonth() + 1}`;
    }
}