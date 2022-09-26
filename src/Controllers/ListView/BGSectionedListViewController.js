"use strict";

import { Corners, RoundedCorner, Padding, Gap, View } from "../../UI/libs/WrappedUI.js";
import BGChallengeListViewItemView from "../../UI/Views/BGChallengeListViewItemView.js";
import BGSectionedListView from "../../UI/Views/BGSectionedListView.js";
import BGController from "../BGController.js";

export default class BGSectionedListViewController extends BGController {

    constructor(itemViewClass, headerViewClass) {
        super();

        this.itemViewClass = itemViewClass;
        this.headerViewClass = headerViewClass;
    }

    get listView() {
        return this._listView;
    }

    set items(value) {
        this.listView.items = value;
    }

    get items() {
        return this.listView.items;
    }

    set itemViewClass(value) {
        this.listView.itemViewClass = value;
    }

    get itemViewClass() {
        return this.listView.itemViewClass;
    }

    set headerViewClass(value) {
        this.listView.headerViewClass = value;
    }

    get headerViewClass() {
        return this.listView.headerViewClass;
    }

    get sections() {
        return this.listView.sections;
    }

    set sections(value) {
        this.listView.sections = value;
    }

    _createListView() {
        const sectionedListView = new BGSectionedListView();
        sectionedListView.padding = Padding.all("10px");
        sectionedListView.gap = Gap.all("10px");
        sectionedListView.addEventListener(BGSectionedListView.ITEM_VIEW_CREATED_NOTIFICATION_TYPE, this._onItemViewCreated.bind(this));
        sectionedListView.addEventListener(BGChallengeListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this._onItemViewClicked.bind(this));
        sectionedListView.corners = Corners.bottom(new RoundedCorner("15px"));
        this._listView = sectionedListView;

        return sectionedListView;
    }

    _onItemViewCreated(event) {
        this.notifyAll(event);
    }

    _onItemViewClicked(event) {
        this.notifyAll(event);
    }
    
    _createContentView() {
        const contentView = super._createContentView();
        contentView.overflow = View.Overflow.hidden;

        const listView = this._createListView();
        contentView.addView(listView);

        return contentView;
    }
}