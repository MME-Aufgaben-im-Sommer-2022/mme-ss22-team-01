/*eslint no-magic-numbers: "off"*/
import { Border, Borders, Button, Color, Corners, Icon, Gap, Padding, RoundedCorner, StackView, TextField } from "../UI/libs/WrappedUI.js";
import { Event } from "../utils/Observable.js";
import BGItemCreationController from "./BGItemCreationController.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";

/**
 * this class is used to resemble a searchable list that can add new items
 */
export default class BGSearchableListViewController extends BGRemoteSectionedListViewController {

    /**
     * event labels
     */
    static get SEARCH_END_NOTIFICATION_TYPE() {
        return "searchEnd";
    }

    static get SEARCH_START_NOTIFICATION_TYPE() {
        return "searchStart";
    }

    static get SEARCH_CHANGE_NOTIFICATION_TYPE() {
        return "change";
    }

    static get SEARCH_CHANGE_END_NOTIFICATION_TYPE() {
        return "changeEnd";
    }

    /**
     * this constant is used to define a text entry timeout in milliseconds
     */
    static get TEXT_CHANGE_TIMEOUT_MILLISECONDS() {
        return 300;
    }

    /**
     * this constant is used to define two states for the controller. 
     */
    static get ListMode() {
        return Object.freeze({
            default: "default",
            searching: "searching",
        });
    }

    constructor(itemViewClass, headerViewClass, listMode = BGSearchableListViewController.ListMode.default) {
        super(itemViewClass, headerViewClass);

        this.listMode = listMode;
    }

    /**
     * the getters below are used to manage access to ui elements and their properties and other critical properties
     */
    get headerButtonsView() {
        return this._headerButtonsView;
    }

    get itemCreationController() {
        return this._itemCreationController;
    }

    get listMode() {
        return this._listMode;
    }

    set listMode(value) {
        this._listMode = value;

        this._applyListMode();
    }

    get searchBar() {
        return this._searchBar;
    }

    get searchText() {
        return this.searchBar.text;
    }

    set searchText(value) {
        this.searchBar.text = value;
    }

    get searchPlaceholder() {
        return this.searchBar.placeholder;
    }

    set searchBarPlaceholder(value) {
        this.searchBar.text = value;
    }

    get searchButton() {
        return this._searchButton;
    }

    get hideSearchBarButton() {
        return this._hideSearchBarButton;
    }

    get cancelButton() {
        return this._cancelButton;
    }

    get addIcon() {
        return this._addIcon;
    }

    get addButton() {
        return this._addButton;
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createSearchBar() {
        const textField = new TextField();
        textField.isHidden = true;
        textField.color = Color.darkGreen;
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.fontSize = "12px";
        textField.padding = Padding.axes("8px", "3px");
        textField.backgroundColor = Color.transparent;
        textField.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        textField.corners = Corners.all(new RoundedCorner("7px"));
        textField.grow = "1";
        textField.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));

        return textField;
    }

    _createSearchButton() {
        const button = this._createHeaderButton(), searchIcon = this._createSearchIcon();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.showSearchBar.bind(this));

        button.addView(searchIcon);

        return button;
    }

    _createCloseButton() {
        const button = this._createHeaderButton(), closeIcon = this._createCloseIcon();
        button.isHidden = true;

        button.addView(closeIcon);

        return button;
    }

    _createHeaderButton() {
        const button = new Button();
        button.fontFamily = Button.FontFamily.sansSerif;
        button.fontSize = "15px";
        button.padding = Padding.axes("8px", "5px");
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(new Border(Color.transparent, "2px"));
        button.corners = Corners.all(new RoundedCorner("5px"));
        button.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onHeaderButtonMouseOver.bind(this));
        button.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onHeaderButtonMouseOut.bind(this));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onHeaderButtonMouseOut.bind(this));

        return button;
    }

    _creatCancelButton() {
        const button = this._createCloseButton();
        button.isHidden = true;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.hideItemCreationController.bind(this));

        return button;
    }

    _createIcon() {
        const icon = new Icon();
        icon.color = Color.darkGreen;
        icon.pointerEvents = Icon.PointerEvents.none;
        icon.classList.add("fa-solid");

        return icon;
    }

    _createSearchIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-magnifying-glass");

        return icon;
    }

    _createCloseIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-close");

        return icon;
    }

    _createHeaderButtonsView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("2px")), searchButton = this._createSearchButton(), hideSearchBarButton = this._createHideSearchBarButton(), addButton = this._createAddButton(), cancelButton = this._creatCancelButton();

        this._searchButton = searchButton;
        stackView.addView(searchButton);

        this._hideSearchBarButton = hideSearchBarButton;
        stackView.addView(hideSearchBarButton);

        this._addButton = addButton;
        stackView.addView(addButton);

        this._cancelButton = cancelButton;
        stackView.addView(cancelButton);

        return stackView;
    }

    _createHideSearchBarButton() {
        const button = this._createCloseButton();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.hideSearchBar.bind(this));

        return button;
    }

    _createHeaderView() {
        const headerView = super._createHeaderView(), searchBar = this._createSearchBar(), headerButtonsView = this._createHeaderButtonsView();

        this._searchBar = searchBar;
        headerView.addView(searchBar);

        this._headerButtonsView = headerButtonsView;
        headerView.addView(headerButtonsView);

        return headerView;
    }

    _createAddIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-plus");

        return icon;
    }

    _createAddButton() {
        const button = this._createHeaderButton(), addIcon = this._createAddIcon();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.showItemCreationController.bind(this));

        this._addIcon = addIcon;
        button.addView(addIcon);

        return button;
    }

    /**
     * this method is used to highlight header buttons on hover
     * @param {Event} event 
     */
    _onHeaderButtonMouseOver(event) {
        const button = event.data;
        button.backgroundColor = Color.lightGrey;
    }

     /**
     * this method is used to unhighlight header buttons if the user exits the elements bounds
     * @param {Event} event 
     */
    _onHeaderButtonMouseOut(event) {
        const button = event.data;
        button.backgroundColor = Color.transparent;
    }

    /**
     * this method is used to show/hide the searchbar
     * @param {boolean} show 
     */
    _toggleSearchBar(show) {
        this.titleLabel.isHidden = show;
        this.searchButton.isHidden = show;
        this.hideSearchBarButton.isHidden = !show;
        this.searchBar.isHidden = !show;
    }

    /**
     * this method is used to update the controllers appearance on a mode change
     */
    _applyListMode() {
        const listMode = this._listMode;

        switch (listMode) {
            case BGSearchableListViewController.ListMode.default:
                this._toggleSearchBar(false);
                break;
            case BGSearchableListViewController.ListMode.searching:
                this._toggleSearchBar(true);
                break;
            default:
                throw new Error(`Unsupported list mode: ${listMode}`);
        }
    }

    /**
     * this method is invoked upon every text change. It starts a timer with an predefined delay to indicate that text entry has concluded
     */
    _onSearchTextChange() {
        const timeout = this._timeout;
        if (timeout !== undefined) { clearTimeout(timeout); }
        this._timeout = setTimeout(this._onSearchTextChangeEnd.bind(this), BGSearchableListViewController.TEXT_CHANGE_TIMEOUT_MILLISECONDS);
    }

    /**
     * this method gets called if the timer resolves, marking the end of an text entry
     */
    _onSearchTextChangeEnd() {
        const event = new Event(BGSearchableListViewController.SEARCH_CHANGE_END_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method gets called if users press the search button
     */
    _onSearchStart() {
        this.searchBar.focus();

        const event = new Event(BGSearchableListViewController.SEARCH_START_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method gets called if users cancel the search manually by pressing the x button
     */
    _onSearchEnd() {
        this.searchBar.clear();
        this.updateSections();

        const event = new Event(BGSearchableListViewController.SEARCH_END_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is used to show the searchbar and toggle events
     */
    showSearchBar() {
        this.listMode = BGSearchableListViewController.ListMode.searching;
        this._onSearchStart();
    }

    /**
     * this method is used to show the searchbar and toggle events
     */
    hideSearchBar() {
        this.listMode = BGSearchableListViewController.ListMode.default;
        this._onSearchEnd();
    }

    /**
     * this method is used to present the user with a new controller to create new items in
     */
    showItemCreationController() {
        this.hideItemCreationController();

        this.hideSearchBar();
        this.searchButton.isHidden = true;
        this.cancelButton.isHidden = false;
        this.addButton.isHidden = true;

        const itemCreationController = this._createItemCreationController();
        itemCreationController.addEventListener(BGItemCreationController.ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE, this._onItemConfigurationFinished.bind(this));
        this.listView.isHidden = true;
        this.addController(itemCreationController, this.contentView);

        this._itemCreationController = itemCreationController;
    }

    /**
     * this method is used to dismiss the creation controller
     */
    hideItemCreationController() {
        this.listView.isHidden = false;
        this.searchButton.isHidden = false;
        this.cancelButton.isHidden = true;
        this.addButton.isHidden = false;

        const itemCreationController = this.itemCreationController;
        if (itemCreationController === undefined) { return; }
        itemCreationController.removeFromParentController();
    }

    /**
     * this method creates the controller for new items, it may be overridden in subclasses
     * @returns an instance of BGItemCreationController
     */
    _createItemCreationController() {
        return new BGItemCreationController();
    }

    /**
     * this method hides the controller upon a new item creation
     * @param {Event} event 
     */
    _onItemConfigurationFinished(event) {
        this.hideItemCreationController();
        this.notifyAll(event);
    }

     /**
     * this method is used to prepare the ui for loading data
     */
    startLoading() {
        super.startLoading();

        this.searchBar.isDisabled = true;
        this.headerButtonsView.isDisabled = true;
    }

     /**
     * this method is used to resolve the loading state
     */
    stopLoading() {
        super.stopLoading();

        this.searchBar.isDisabled = false;
        this.headerButtonsView.isDisabled = false;
    }
}