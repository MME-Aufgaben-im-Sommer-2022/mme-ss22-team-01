"use strict";

import { Gap, StackView } from "../libs/WrappedUI.js";
import { Event } from "../../utils/Observable.js";

export default class BGListViewItemView extends StackView { // stattdessen article extenden oder in article wrappen?

    static get ITEM_VIEW_SELECTED_NOTIFICATION_TYPE() {
        return "itemViewSelected";
    }

    constructor(data) {
        super(StackView.Axis.horizontal);

        this.overflow = StackView.Overflow.hidden;
        this.shrink = "0";

        this._createView();

        this.data = data;
    }

    set listView(value) {
        this._listView = value;
    }

    get listView() {
        return this._listView;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;

        this._applyData();
    }

    get contentView() {
        return this._contentView;
    }

    get contentPadding() {
        return this.contentView.padding;
    }

    set contentPadding(value) {
        this.contentView.padding = value;
    }

    filter(criteria) { // Todo des nochmal überdenken
        return true;
    }

    _createView() {
        const contentView = this._createContentView();        
        this._contentView = contentView;
        this.addView(contentView);

        return this;
    }

    _createContentView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px"));
        stackView.grow = "1";
        stackView.addDOMEventListener("click", this.didSelect.bind(this), true);

        return stackView;
    }

    didSelect() {
        const event = new Event(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _applyData() {
        //throw new ImplementationError();
    }
}