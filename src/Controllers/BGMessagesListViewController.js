/*eslint no-magic-numbers: "off"*/
import { TextField, Corners, RoundedCorner, View, Padding, Color, StackView, Borders, Border, Button, Gap } from "../UI/libs/WrappedUI.js";
import { Query } from "appwrite";
import BGMessageListViewItemView from "../UI/Views/BGMessageListViewItemView.js";
import BGListViewMessageItemData from "../Data/Models/BGListViewMessageItemData.js";
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";
import BGSectionedListViewSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import BGMessagesListViewTextHeaderView from "../UI/Views/BGMessagesListViewTextHeaderView.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";
import AppWriteDocumentManager from "../Data/Managers/AppWriteDocumentManager.js";
import AppWriteConfig from "../AppWrite/AppWriteConfig.js";
import AppWriteMembershipManager from "../Data/Managers/AppWriteMembershipManager.js";

/**
 * this class is used to load and display messages for a particular team
 */
export default class BGMessagesListViewController extends BGRemoteSectionedListViewController {

    constructor(containerId) {
        super(BGMessageListViewItemView, BGMessagesListViewTextHeaderView);

        this._containerId = containerId;
    }

    /**
     * the getters/setters below are used to provide limited access to ui elements and their properties as well as other critical internal variables 
     */
    get membershipsManager() {
        return this._membershipsManager;
    }

    get containerId() {
        return this._containerId;
    }

    get textField() {
        return this._textField;
    }

    get text() {
        return this.textField.text;
    }

    set text(value) {
        this.textField.text = value;
    }

    get button() {
        return this._button;
    }

    get previewManager() {
        return this._previewManager;
    }

    get messagesManager() {
        return this._messagesManager;
    }

    /**
     * this method is used to create a database manager to handle messages
     * @returns an instance of AppWriteDocumentManager
     */
    _createMessagesManager() {
        const messagesManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_MESSAGES_ID);

        return messagesManager;
    }

    /**
     * this method is used to create a backend manager to handle team members
     * @returns an instance of AppWriteMembershipManager
     */
    _createMembershipsManager() {
        const membershipsManager = new AppWriteMembershipManager(this.containerId);

        return membershipsManager;
    }

    /**
     * this method is used to create a backend manager to handle preview items
     * @returns an instance of BGPreviewDocumentManager
     */
    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    /**
     * this method is used to setup backend connections and initially load list view data
     */
    setup() {
        this._messagesManager = this._createMessagesManager();
        this._previewManager = this._createPreviewManager();
        this._membershipsManager = this._createMembershipsManager();

        this.updateSections();
    }

    /**
     * this method is used to fetch messages and update the listview
     */
    async updateSections() {
        this.startLoading();

        const userId = AppWriteAuthentication.sharedInstance.user.$id, memberships = await this.membershipsManager.loadResources(), messageDocuments = await this.messagesManager.loadResources([Query.equal("team", this.containerId)]);

        this.sections = messageDocuments.reduce((sections, document) => {
            const membership = memberships.find(membership => membership.userId === document.author);
            let name = "", section, item, createdAt;
            if (membership !== undefined) { name = membership.userName; }
            item = new BGListViewMessageItemData(document.$id, document.$createdAt, document.$updatedAt, document.text, name, document.author !== userId);
            createdAt = this._strippedDate(item.createdAt);

            section = sections.find(section => section.createdAt.getTime() === createdAt.getTime());
            if (section === undefined) {
                section = new BGSectionedListViewSectionData(`${createdAt.getTime() / 1000}`, createdAt, createdAt, [], createdAt);
                sections.push(section);
            }
            section.addItem(item);
            return sections;
        }, []);

        this.stopLoading();
    }

    /**
     * this method is used to derive a date object from a timestamp that only contains the full date
     * @param {number} seconds 
     * @returns 
     */
    _strippedDate(seconds) {
        const date = new Date(seconds * 1000), strippedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return strippedDate;
    }

    /**
     * this method is used to update ui elements to reflect a loading state
     */
    startLoading() {
        super.startLoading();

        this.button.isDisabled = true;
        this.textField.isDisabled = true;
    }

    /**
     * this method is used to update ui elements to resolve a loading state
     */
    stopLoading() {
        super.stopLoading();

        this.button.isDisabled = false;
        this.textField.isDisabled = false;
    }

    /**
     * this method is overridden to prevent sending empty massages
     */
    _onTextChange() {
        this.button.isDisabled = this.text.length < 1;
    }

    /**
     * this method is called if users press the send button, firstly the message gets added to the backend and the list gets updated afterwards
     */
    async _onSubmit() {
        if (this.text.length < 1) { return; }

        const userId = AppWriteAuthentication.sharedInstance.user.$id, messageDocument = await this.messagesManager.create({ text: this.text, team: this.containerId, author: userId }), previewManager = this.previewManager, containerId = this.containerId, previewDocuments = await previewManager.loadResources([Query.equal("$id", containerId)]);

        if (previewDocuments.length > 0) { await previewManager.update({ $id: previewDocuments[0].$id, message: messageDocument.$id }); }
        else { await previewManager.create({ score: 0, message: messageDocument.$id, $id: containerId }); }

        this.textField.clear();
        await this.updateSections();
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createActionView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.center, StackView.CrossAxisAlignment.center, Gap.all("5px")), textField = this._createTextField(), button = this._createButton();
        stackView.backgroundColor = Color.lightGrey;
        stackView.padding = Padding.all("10px");
        stackView.borders = Borders.top(new Border(Color.darkGreen, "1px"));

        stackView.addView(textField);
        this._textField = textField;

        stackView.addView(button);
        this._button = button;

        return stackView;
    }

    _createTextField() {
        const textField = new TextField();
        textField.backgroundColor = Color.white;
        textField.corners = Corners.all(new RoundedCorner("10px"));
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.grow = "1";
        textField.fontSize = "15px";
        textField.padding = Padding.axes("10px", "3px");
        textField.placeholder = "Nachricht";
        textField.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        textField.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onTextChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onTextChange.bind(this));

        return textField;
    }

    _createButton() {
        const button = new Button();
        button.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        button.backgroundColor = Color.darkGreen;
        button.color = Color.white;
        button.fontSize = "15px";
        button.isDisabled = true;
        button.padding = Padding.axes("10px", "3px");
        button.text = "senden";
        button.corners = Corners.all(new RoundedCorner("10px"));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onSubmit.bind(this));

        return button;
    }

    _createContentView() {
        const contentView = super._createContentView(), actionView = this._createActionView();
        contentView.overflow = View.Overflow.hidden;
        contentView.mainAxisAlignment = StackView.MainAxisAlignment.spaceBetween;
        contentView.grow = "1";

        contentView.addView(actionView);

        return contentView;
    }
}