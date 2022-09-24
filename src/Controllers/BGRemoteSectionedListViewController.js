"use strict";

import { Color, Label, Padding } from "../UI/libs/WrappedUI.js";
import BGSectionedListViewController from "./ListView/BGSectionedListViewController.js";

export default class BGRemoteSectionedListViewController extends BGSectionedListViewController {
    constructor(itemViewClass, headerViewClass) {
        super(itemViewClass);

        this.headerViewClass = headerViewClass;
    }

    get loadingView() {
        return this._loadingView;
    }

    _createLoadingView() {
        const label = new Label();

        label.color = Color.darkGreen;
        label.text = "laden...";
        label.textAlignment = Label.TextAlignment.center;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.padding = Padding.vertical("3px");
        label.fontSize = "12px";
        label.fontWeight = Label.FontWeight.bold;

        return label;
    }

    _createContentView() {
        const contentView = super._createContentView();

        //contentView.backgroundColor = Color.cyan;
        //contentView.grow = "1";
        //contentView.mainAxisAlignment = StackView.MainAxisAlignment.center;
        const loadingView = this._createLoadingView();
        this._loadingView = loadingView;
        contentView.addView(loadingView);

        return contentView;
    }

    setup() {

    }

    async updateSections(filter) { }

    startLoading() {
        this.loadingView.isHidden = false;
        this.listView.isDisabled = true;
    }

    stopLoading() {
        this.loadingView.isHidden = true;
        this.listView.isDisabled = false;
    }
}