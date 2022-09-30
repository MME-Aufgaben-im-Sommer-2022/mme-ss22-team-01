import BGListView from "./BGListView.js";

/**
 * this view is used to display a collection of items inside an one section of a list view
 */
export default class BGSectionedListViewSectionView extends BGListView {
    constructor(headerViewClass, itemViewClass) {
        super(itemViewClass);

        this.headerViewClass = headerViewClass;
        this.overflow = BGSectionedListViewSectionView.Overflow.visible;
    }

    /**
     * getter and setter pair to expose the internal list view 
     */
    get listView() {
        return this._listView;
    }

    set listView(value) {
        this._listView = value;
    }

    /**
     * this two getter and setter pairs are used to hold the data part
     */
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
        if (headerView !== undefined) { headerView.removeFromParentView(); }

        this._addHeaderView();
    }

    /**
     * this getter and setter pair is used to access the internal reference to the header view class
     */
    set headerViewClass(value) {
        if (this.headerViewClass !== undefined) { throw new Error("Cannot register multiple header view classes"); }
        this._headerViewClass = value;
    }

    get headerViewClass() {
        return this._headerViewClass;
    }

    /**
     * this getter manages access to the internal stored header view instance
     */
    get sectionHeaderView() {
        return this._sectionHeaderView;
    }

    /**
     * this method is used to add an header view to the section, the header view class must be provided as a class property
     */
    _addHeaderView() {
        if (this.headerViewClass === undefined) { throw new Error("A class must be registered prior to header view instanciation"); }

        const headerView = new this.headerViewClass(this.header), itemViews = this._itemViews;
        this._headerView = headerView;

        return itemViews.length < 1 ? this.addView(headerView) : this.addViewBefore(headerView, itemViews[0]);
    }
}