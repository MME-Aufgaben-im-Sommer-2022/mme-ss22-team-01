import { Corners, RoundedCorner, Padding, Gap, View } from "../../UI/libs/WrappedUI.js";
import BGChallengeListViewItemView from "../../UI/Views/BGChallengeListViewItemView.js";
import BGSectionedListView from "../../UI/Views/BGSectionedListView.js";
import BGController from "../BGController.js";

/**
 * this class is used to encapsulate all functions and properties needed to display a grouped collection inside a view controller
 */
export default class BGSectionedListViewController extends BGController {

    /**
     * this constructor is used to create a new controller and must be provided with the classes needed to display corresponding data
     * @param {BGListViewItemView} itemViewClass a class to represent an item visually - must be a subclass of BGListViewItemView
     * @param {BGListViewItemView} headerViewClass a class to represent a section header visually - must be a subclass of BGListViewItemView
     */
    constructor(itemViewClass, headerViewClass) {
        super();

        this.itemViewClass = itemViewClass;
        this.headerViewClass = headerViewClass;
    }

    /**
     * a getter to expose the internal listview object
     */
    get listView() {
        return this._listView;
    }

    /**
     * a proxy setter to access listview items
     */
    set items(value) {
        this.listView.items = value;
    }

    /**
     * a proxy getter to access listview items
     */
    get items() {
        return this.listView.items;
    }

    /**
     * a proxy setter to access itemViewClass items
     */
    set itemViewClass(value) {
        this.listView.itemViewClass = value;
    }

    /**
     * a proxy getter to access itemViewClass items
     */
    get itemViewClass() {
        return this.listView.itemViewClass;
    }

    /**
     * a proxy setter to access headerViewClass items
     */
    set headerViewClass(value) {
        this.listView.headerViewClass = value;
    }

    /**
     * a proxy getter to access headerViewClass items
     */
    get headerViewClass() {
        return this.listView.headerViewClass;
    }

    /**
     * a proxy getter to access itemViewClass sections
     */
    get sections() {
        return this.listView.sections;
    }

    /**
     * a proxy setter to access itemViewClass sections
     */
    set sections(value) {
        this.listView.sections = value;
    }

    /**
     * this method is used to create the listview 
     * @returns an instance of BGSectionedListView
     */
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

    /**
     * this method is used to notify observers about the creation of new item views
     * @param {Event} event a listview event to notify observers about
     */
    _onItemViewCreated(event) {
        this.notifyAll(event);
    }

    /** 
     * this method notifies observers if an item view has been clicked
     * @param {Event} event a listview event to notify observers about
     */
    _onItemViewClicked(event) {
        this.notifyAll(event);
    }
    
    /**
     * this method is overridden from its superclass to add the listview as the main content
     * @returns a view instance to contain the main content
     */
    _createContentView() {
        const contentView = super._createContentView(), listView = this._createListView();
        contentView.overflow = View.Overflow.hidden;

        contentView.addView(listView);

        return contentView;
    }
}