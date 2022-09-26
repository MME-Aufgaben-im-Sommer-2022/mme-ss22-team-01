"use strict";

import { Gap, StackView } from "../libs/WrappedUI.js";
import BGListViewItemView from "./BGListViewItemView.js";
import { Event } from "../../utils/Observable.js";

export default class BGListView extends StackView {

    static get ITEM_VIEW_CREATED_NOTIFICATION_TYPE() {
        return "itemViewCreated";
    }

    set itemViewClass(value) {
        if (this.itemViewClass !== undefined) throw new Error("Cannot register multiple item view classes");
        this._itemViewClass = value;
    }

    get itemViewClass() {
        return this._itemViewClass;
    }

    constructor(itemViewClass) {
        super(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch, Gap.all("5px"));
        this.itemViewClass = itemViewClass;
        this._itemViews = [];

        this.overflow = StackView.Overflow.scroll;
    }

    get items() {
        return this._itemViews.map(itemView => itemView.data);
    }

    set items(value) {
        this._itemViews.forEach(itemView => itemView.removeFromParentView());
        this._itemViews = [];
        value.forEach(item => this._addItemView(item));
    }

    addItem(item) {
        this._addItemView(item);
    }

    removeItem(item) {
        const itemView = this._itemViews.find(itemView => itemView.data.id === item.id);
        if (itemView === undefined) return;
        itemView.removeFromParentView();
    }

    updateItem(item, newItem) {
        const itemView = this._itemViews.find(itemView => itemView.data.id === item.id);
        if (itemView === undefined) return;
        itemView.data = newItem;
    }

    _addItemView(item) {
        const itemViews = this._itemViews;
        const itemViewClass = this._itemViewClass;
        if (itemViewClass === undefined) throw new Error("A class must be registered prior to item view instanciation");

        const itemView = new itemViewClass(item);
        itemView.listView = this;

        this._onItemViewCreated(itemView);
        itemView.addEventListener(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this._onItemViewSelected.bind(this));

        itemViews.push(itemView);

        this.addView(itemView);
    }

    _onItemViewCreated(itemView) {
        const event = new Event(BGListView.ITEM_VIEW_CREATED_NOTIFICATION_TYPE, itemView);
        this.notifyAll(event);
    }

    _onItemViewSelected(event) {
        const itemView = event.data;

        const e = new Event(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, itemView);
        this.notifyAll(e);
    }
}