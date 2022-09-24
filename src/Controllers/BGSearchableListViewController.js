"use strict";

import { Border, Borders, Button, Color, Corners, Icon, Gap, Padding, RoundedCorner, StackView, TextField, Label } from "../UI/libs/WrappedUI.js";
import { Event } from "../utils/Observable.js";
import BGItemCreationController from "./BGItemCreationController.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";

export default class BGSearchableListViewController extends BGRemoteSectionedListViewController {

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

    static get TEXT_CHANGE_TIMEOUT_MILLISECONDS() {
        return 300;
    }

    constructor(itemViewClass, headerViewClass, listMode = BGSearchableListViewController.ListMode.default) {
        super(itemViewClass, headerViewClass);

        this.listMode = listMode;
    }

    get itemCreationController() {
        return this._itemCreationController;
    }

    static get ListMode() {
        return Object.freeze({
            default: "default",
            searching: "searching"
        });
    }

    get listMode() {
        return this._listMode;
    }

    set listMode(value) {
        this._listMode = value;

        this._applyListMode(); //Todo die hier statt setter?
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
        //textField.isDisabled = true;
        textField.grow = "1";
        textField.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onSearchTextChange.bind(this));

        return textField;
    }

    _createSearchButton() {
        const button = this._createHeaderButton();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.showSearchBar.bind(this));
        const searchIcon = this._createSearchIcon();
        button.addView(searchIcon);

        return button;
    }

    _createCloseButton() {
        const button = this._createHeaderButton();
        button.isHidden = true;
        const closeIcon = this._createCloseIcon();
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

    _onHeaderButtonMouseOver(event) {
        const button = event.data;
        button.backgroundColor = Color.lightGrey;
    }

    _onHeaderButtonMouseOut(event) {
        const button = event.data;
        button.backgroundColor = Color.transparent;
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
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("2px"));

        const searchButton = this._createSearchButton();
        this._searchButton = searchButton;
        stackView.addView(searchButton);

        const hideSearchBarButton = this._createHideSearchBarButton();
        this._hideSearchBarButton = hideSearchBarButton;
        stackView.addView(hideSearchBarButton);

        const addButton = this._createAddButton();
        this._addButton = addButton;
        stackView.addView(addButton);

        const cancelButton = this._creatCancelButton();
        this._cancelButton = cancelButton;
        stackView.addView(cancelButton);

        return stackView;
    }

    _createHideSearchBarButton() {
        const button = this._createCloseButton();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.hideSearchBar.bind(this));

        return button;
    }

    get headerButtonsView() {
        return this._headerButtonsView;
    }

    _createHeaderView() {
        const headerView = super._createHeaderView();

        const searchBar = this._createSearchBar();
        this._searchBar = searchBar;
        headerView.addView(searchBar);

        const headerButtonsView = this._createHeaderButtonsView();
        this._headerButtonsView = headerButtonsView;
        headerView.addView(headerButtonsView);

        return headerView;
    }

    _toggleSearchBar(show) {
        //this.headerView.views.forEach(view => view.isHidden = show);
        this.titleLabel.isHidden = show;
        this.searchButton.isHidden = show;
        this.hideSearchBarButton.isHidden = !show;
        this.searchBar.isHidden = !show;
    }

    /*
    toggleMode() {
        this.listMode = this.listMode === BGSearchableListViewController.ListMode.default ? BGSearchableListViewController.ListMode.searching : BGSearchableListViewController.ListMode.default;
    }*/

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

    _onSearchTextChange() {
        const timeout = this._timeout;
        if (timeout !== undefined) clearTimeout(timeout);
        this._timeout = setTimeout(this._onSearchTextChangeEnd.bind(this), BGSearchableListViewController.TEXT_CHANGE_TIMEOUT_MILLISECONDS);
    }

    _onSearchTextChangeEnd() {
        const event = new Event(BGSearchableListViewController.SEARCH_CHANGE_END_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onSearchStart() {
        const event = new Event(BGSearchableListViewController.SEARCH_START_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onSearchEnd() {
        const event = new Event(BGSearchableListViewController.SEARCH_END_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    showSearchBar(event) {
        this.listMode = BGSearchableListViewController.ListMode.searching;
        this._onSearchStart();
    }

    hideSearchBar(event) {
        this.listMode = BGSearchableListViewController.ListMode.default;
        this._onSearchEnd();
    }

    get addIcon() {
        return this._addIcon;
    }

    _createAddIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-plus");

        return icon;
    }

    _createAddButton() {
        const button = this._createHeaderButton();
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this.showItemCreationController.bind(this));
        const addIcon = this._createAddIcon();
        this._addIcon = addIcon;
        button.addView(addIcon);

        return button;
    }

    get addButton() {
        return this._addButton;
    }

    showItemCreationController() {
        this.hideItemCreationController(); // todo kollisiuon mit teams

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

    hideItemCreationController() {
        this.listView.isHidden = false;
        this.searchButton.isHidden = false;
        this.cancelButton.isHidden = true;
        this.addButton.isHidden = false;

        const itemCreationController = this.itemCreationController;
        if (itemCreationController === undefined) return;
        itemCreationController.removeFromParentController();
    }

    _createItemCreationController() {
        return new BGItemCreationController();
    }

    _onItemConfigurationFinished(event) {
        this.hideItemCreationController();
        this.notifyAll(event);
    }

    startLoading() {
        super.startLoading();

        this.searchBar.isDisabled = true;
        this.headerButtonsView.isDisabled = true;
    }

    stopLoading() {
        super.stopLoading();

        this.searchBar.isDisabled = false;
        this.headerButtonsView.isDisabled = false;
    }
}