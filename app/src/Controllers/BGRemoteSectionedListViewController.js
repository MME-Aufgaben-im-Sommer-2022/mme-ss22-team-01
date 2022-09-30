import { Color, Label, Padding } from "../UI/libs/WrappedUI.js";
import BGSectionedListViewController from "./ListView/BGSectionedListViewController.js";

/**
 * this class is used prepare a list view controller for remotely loading its data
 */
export default class BGRemoteSectionedListViewController extends BGSectionedListViewController {
    constructor(itemViewClass, headerViewClass) {
        super(itemViewClass);

        this.headerViewClass = headerViewClass;
    }

    /**
     * this getter is used to provide access to the loading view
     */
    get loadingView() {
        return this._loadingView;
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
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
        const contentView = super._createContentView(), loadingView = this._createLoadingView();

        this._loadingView = loadingView;
        contentView.addView(loadingView);

        return contentView;
    }

    /**
     * this method must be overridden to add setup that occurs once before the data gets loaded, eg. api connection setup
     */
    setup() {
        // do nothing.
    }

    /**
     * this method must be overridden to load data from the backend and update the listview accordingly
     */
    async updateSections() {
        // do nothing.
    }

    /**
     * this method is used to prepare the ui for loading data
     */
    startLoading() {
        this.loadingView.isHidden = false;
        this.listView.isDisabled = true;
    }

    /**
     * this method is used to resolve the loading state
     */
    stopLoading() {
        this.loadingView.isHidden = true;
        this.listView.isDisabled = false;
    }
}