import { Gap, StackView } from "../libs/WrappedUI.js";
import { Event } from "../../utils/Observable.js";

/**
 * this class is the base class for list view items
 */
export default class BGListViewItemView extends StackView {

    /**
     * event label
     */
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

    /**
     * getters/setters to manage access to internal properties and layout props
     */
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

    /**
     * this method gets called if the user clicks on the content view, it then notifies its observers
     */
    didSelect() {
        const event = new Event(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is used to bridge the gap between views and data, it must be overridden in subclasses to assign data to views
     */
    _applyData() {
        // do nothing.
    }

    /**
     * the methods below are used to manage/create the view hierarchy
     */
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
}