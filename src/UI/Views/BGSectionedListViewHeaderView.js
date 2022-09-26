"use strict";

import { Color, Label } from "../libs/WrappedUI.js";
import BGListViewItemView from "../Views/BGListViewItemView.js";

export default class BGSectionedListViewHeaderView extends BGListViewItemView {

    get titleLabel() {
        return this._titleLabel;
    }

    get title() {
        return this.titleLabel.text;
    }

    set title(value) {
        this.titleLabel.text = value;
    }

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
        const contentView = super._createContentView();

        const titleLabel = this._createTitleLabel();
        this._titleLabel = titleLabel;
        contentView.addView(titleLabel);

        return contentView;
    }
}