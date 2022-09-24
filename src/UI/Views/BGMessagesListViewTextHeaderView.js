"use strict";

import { Color, Corners, Label, Padding, RoundedCorner, StackView } from "../libs/WrappedUI.js";
import BGSectionedListViewTextHeaderView from "./BGSectionedListViewTextHeaderView.js";

export default class BGMessagesListViewTextHeaderView extends BGSectionedListViewTextHeaderView {
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

    _applyData() {
        this.title = this._formatDate(this.data);
    }

    _formatDate(date) {
        return `${date.getDate()}.${date.getMonth() + 1}`;
    }
}