import BGSectionedListViewSectionData from "../../Data/Models/BGSectionedListViewSectionData.js";
import BGListView from "./BGListView.js";
import BGListViewItemView from "./BGListViewItemView.js";
import BGSectionedListViewSectionView from "./BGSectionedListViewSectionView.js";

/**
 * this class is used to extend the simple list view for sections and nested collections
 */
export default class BGSectionedListView extends BGListView {

    /**
     * an event label
     */
    static get SECTION_VIEW_CREATED_NOTIFICATION_TYPE() {
        return "sectionViewCreated";
    }

    constructor(itemViewClass, headerViewClass) {
        super(itemViewClass);
        this._itemViews = [];

        this.headerViewClass = headerViewClass;
    }

    /**
     * this getter setter pair is manage access to the header view class
     */
    set headerViewClass(value) {
        if (this.headerViewClass !== undefined) { throw new Error("Cannot register multiple header view classes"); }
        this._headerViewClass = value;
    }

    get headerViewClass() {
        return this._headerViewClass;
    }

    /**
     * the getters/setters below are used to manage the list view data source and to enable layout changes
     */
    get sectionInset() {
        const sectionViews = this._itemViews;
        if (sectionViews.length < 1) { return undefined; }

        return sectionViews[0].gap;
    }

    set sectionInset(value) {
        this._itemViews.forEach(sectionView => sectionView.gap = value);
    }

    get sections() {
        return this._itemViews.map(sectionView => sectionView.section);
    }

    set sections(value) {
        this._itemViews.forEach(sectionView => sectionView.removeFromParentView());
        this._itemViews = [];
        value.forEach(section => this._addSectionView(section));
    }

    get items() {
        return this.sections.flatMap(section => section.items);
    }

    set items(value) {
        this.sections = [];

        value.forEach(item => this._addItemView(item));
    }

    /**
     * this method is a proxy to an internal function to add a new section
     * @param {BGSectionedListViewSectionData} section a section datasource element
     */
    addSection(section) {
        this._addSectionView(section);
    }

    /**
     * this method is used to add a new section to the list view by creating new views and assigning the data 
     * @param {BGSectionedListViewSectionData} section a section datasource element
     */
    _addSectionView(section) {
        if (this.headerViewClass === undefined) { throw new Error("A class must be registered prior to header view instanciation"); }
        if (this.itemViewClass === undefined) { throw new Error("A class must be registered prior to item view instanciation"); }

        const sectionViews = this._itemViews, sectionView = new BGSectionedListViewSectionView(this.headerViewClass, this.itemViewClass);
        sectionView.listView = this;

        this._onSectionViewCreated(sectionView);
        sectionView.addEventListener(BGListView.ITEM_VIEW_CREATED_NOTIFICATION_TYPE, this._onSectionItemViewCreated.bind(this));
        sectionView.addEventListener(BGListViewItemView.ITEM_VIEW_SELECTED_NOTIFICATION_TYPE, this._onItemViewSelected.bind(this));

        sectionView.section = section;

        sectionViews.push(sectionView);

        this.addView(sectionView);
    }

    /**
     * this method gets invoked upon item view creation
     * @param {Event} event 
     */
    _onSectionItemViewCreated(event) {
        const itemView = event.data;

        this._onItemViewCreated(itemView);
    }

    /**
     * this method notifies observers of new sections, that have been added to the list view
     * @param {View} sectionView 
     */
    _onSectionViewCreated(sectionView) {
        const event = new Event(BGSectionedListView.SECTION_VIEW_CREATED_NOTIFICATION_TYPE, sectionView);
        this.notifyAll(event);
    }

    /**
     * this method is used to remove an item by delegating the call to all sections and removing the item if possible
     * @param {BGListViewItemData} item the item to be deleted
     */
    removeItem(item) {
        this._itemViews.forEach(sectionView => sectionView.removeItem(item));
    }

    /**
     * this method is used to replace an item by delegating the call to all sections and updating the item if possible
     * @param {BGListViewItemData} item the item to be replaced
     * @param {BGListViewItemData} newItem the new item
     */
    updateItem(item, newItem) {
        this._itemViews.forEach(sectionView => sectionView.updateItem(item, newItem));
    }

    /**
     * this method is used to add a new item to any section
     * @param {BGListViewItemData} item item to be added
     */
    _addItemView(item) {
        const sectionViews = this._itemViews;
        let sectionView = sectionViews.find(sectionView => sectionView.data === item.section);
        if (sectionView === undefined) { this.addSection(new BGSectionedListViewSectionData(undefined, 0, 0, [item])); }
        else { sectionView._addItemView(item); }

    }
}