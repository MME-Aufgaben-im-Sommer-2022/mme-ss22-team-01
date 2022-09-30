import { Gap, StackView } from "../libs/WrappedUI.js";
import BGListViewItemView from "./BGListViewItemView.js";
import { Event } from "../../utils/Observable.js";

/**
 * this view is used to display collections of data in a list
 */
export default class BGListView extends StackView {

    /**
     * event label
     */
    static get ITEM_VIEW_CREATED_NOTIFICATION_TYPE() {
        return "itemViewCreated";
    }

    /**
     * this getter/setter pair is used to define the view class of items. View classes must extend BGListViewItemView
     */
    set itemViewClass(value) {
        if (this.itemViewClass !== undefined) { throw new Error("Cannot register multiple item view classes"); }
        this._itemViewClass = value;
    }

    get itemViewClass() {
        return this._itemViewClass;
    }

    /**
     * this getter/setter pair is used to access item-data from the item-views
     */
    get items() {
        return this._itemViews.map(itemView => itemView.data);
    }

    set items(value) {
        this._itemViews.forEach(itemView => itemView.removeFromParentView());
        this._itemViews = [];
        value.forEach(item => this._addItemView(item));
    }

    constructor(itemViewClass) {
        super(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch, Gap.all("5px"));
        this.itemViewClass = itemViewClass;
        this._itemViews = [];

        this.overflow = StackView.Overflow.scroll;
    }

    /**
     * this method is a proxy to an internal function to add a new item
     * @param {BGListViewItemData} item an item datasource element
     */
    addItem(item) {
        this._addItemView(item);
    }

    /**
     * this method is used to remove an item view inside the list view for a given item
     * @param {BGListViewItemData} item an item to remove from the list 
     */
    removeItem(item) {
        const itemView = this._itemViews.find(itemView => itemView.data.id === item.id);
        if (itemView === undefined) { return; }
        itemView.removeFromParentView();
    }

    /**
     * this method is used to update an item view by replacing its data with another instance ofBGListViewItemData
     * @param {BGListViewItemData} item item to identify the view and to be replaced
     * @param {BGListViewItemData} newItem item to replace
     */
    updateItem(item, newItem) {
        const itemView = this._itemViews.find(itemView => itemView.data.id === item.id);
        if (itemView === undefined) { return; }
        itemView.data = newItem;
    }

    /**
     * this method is used to create a new item view for a given BGListViewItemData instance and inserting it into the list
     * @param {BGListViewItemData} item item to be added
     */
    _addItemView(item) {
        if (this.itemViewClass === undefined) { throw new Error("A class must be registered prior to item view instanciation"); }

        const itemViews = this._itemViews, itemView = new this.itemViewClass(item);
        itemView.listView = this;

        this._onItemViewCreated(itemView);
        itemView.addEventListener(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this._onItemViewSelected.bind(this));

        itemViews.push(itemView);

        this.addView(itemView);
    }

    /**
     * this method gets called to notify observers of new item views inside the list
     * @param {BGListViewItemView} itemView an item as data for the event
     */
    _onItemViewCreated(itemView) {
        const event = new Event(BGListView.ITEM_VIEW_CREATED_NOTIFICATION_TYPE, itemView);
        this.notifyAll(event);
    }

    /**
     * this method is used to pass item view selection events to observers
     * @param {Event} event an event to be passed
     */
    _onItemViewSelected(event) {
        this.notifyAll(event);
    }
}