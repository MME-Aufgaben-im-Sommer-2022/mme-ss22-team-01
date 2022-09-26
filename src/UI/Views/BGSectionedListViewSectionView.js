"use strict";

import BGListView from "./BGListView.js";

export default class BGSectionedListViewSectionView extends BGListView {
    constructor(headerViewClass, itemViewClass) {
        super(itemViewClass);

        this.headerViewClass = headerViewClass;
        this.overflow = BGSectionedListViewSectionView.Overflow.visible;
    }

    get listView() {
        return this._listView;
    }

    set listView(value) {
        this._listView = value;
    }

    get section() {
        return this._section;
    }

    set section(value) {
        this._section = value;
        this.header = value.header;
        this.items = value.items;
    }

    get header() {
        return this._header;
    }

    set header(value) {
        this._header = value;

        const headerView = this.headerView;
        if (headerView !== undefined) headerView.removeFromParentView();

        this._addHeaderView();
    }

    set headerViewClass(value) {
        if (this.headerViewClass !== undefined) throw new Error("Cannot register multiple header view classes");
        this._headerViewClass = value;
    }

    get headerViewClass() {
        return this._headerViewClass;
    }

    get sectionHeaderView() {
        return this._sectionHeaderView;
    }
    
    _addHeaderView() {
        const headerViewClass = this._headerViewClass;
        if (headerViewClass === undefined) throw new Error("A class must be registered prior to header view instanciation");

        const headerView = new headerViewClass(this.header);
        this._headerView = headerView;

        const itemViews = this._itemViews;
        itemViews.length < 1 ? this.addView(headerView) : this.addViewBefore(headerView, itemViews[0]);
    }
}