import { Color, Label } from "../libs/WrappedUI.js";
import BGListViewItemView from "../Views/BGListViewItemView.js";

/**
 * this view is used to pose as an header view inside a list view containing a title
 */
export default class BGSectionedListViewHeaderView extends BGListViewItemView {

    /**
     * getters and setters below are used to manage access to the title label and its text
     */
    get titleLabel() {
        return this._titleLabel;
    }

    get title() {
        return this.titleLabel.text;
    }

    set title(value) {
        this.titleLabel.text = value;
    }

    /**
     * the methods below are used to manage the view hierarchy and setup views
     */
    _createTitleLabel() {
        const label = new Label();
        label.text = "Header";
        label.fontWeight = Label.FontWeight.bold;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.color = Color.darkGreen;
        label.fontSize = "17px";

        return label;
    }

    _createContentView() {
        const contentView = super._createContentView(), titleLabel = this._createTitleLabel();

        this._titleLabel = titleLabel;
        contentView.addView(titleLabel);

        return contentView;
    }
}