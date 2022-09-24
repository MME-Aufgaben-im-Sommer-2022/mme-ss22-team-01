"use strict";

import { TextField, Corners, RoundedCorner, View, Padding, Color, StackView, Borders, Border, Button, Gap } from "../UI/libs/WrappedUI.js";
import { Query } from "appwrite";
import BGMessageListViewItemView from "../UI/Views/BGMessageListViewItemView.js";
import BGListViewMessageItemData from "../Data/Models/BGListViewMessageItemData.js";
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";
import BGSectionedListViewSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import BGMessagesListViewTextHeaderView from "../UI/Views/BGMessagesListViewTextHeaderView.js";
import BGMessageDocumentManager from "../Data/Managers/BGMessageDocumentManager.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";

export default class BGMessagesListViewController extends BGRemoteSectionedListViewController { //

    constructor(containerId) {
        super(BGMessageListViewItemView, BGMessagesListViewTextHeaderView);

        this._containerId = containerId;
    }

    _createMessageDocumentManager() {
        const messageDocumentManager = new BGMessageDocumentManager(this.containerId);

        return messageDocumentManager;
    }

    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    get previewManager() {
        return this._previewManager;
    }

    get messageDocumentManager() {
        return this._messageDocumentManager;
    }

    setup() {
        this._messageDocumentManager = this._createMessageDocumentManager();
        this._previewManager = this._createPreviewManager();

        this.updateMessages();
    }

    async updateMessages() {
        this.startLoading();

        const userId = AppWriteAuthentication.sharedInstance.user.$id;
        const messageDocuments = await this.messageDocumentManager.loadResources([Query.equal("team", this.containerId)]);

        this.sections = messageDocuments.map(document => new BGListViewMessageItemData(document.$id, document.$createdAt, document.$updatedAt, document.text, document.name, document.author !== userId)).reduce((sections, item) => {
            const createdAt = this._strippedDate(item.createdAt);
            let section = sections.find(section => section.createdAt.getTime() === createdAt.getTime());
            if (section === undefined) {
                section = new BGSectionedListViewSectionData(`${createdAt.getTime() / 1000}`, createdAt, createdAt, [], createdAt);
                sections.push(section);
            }
            section.addItem(item);
            return sections;
        }, []);

        this.stopLoading();
    }

    _strippedDate(seconds) {
        const date = new Date(seconds * 1000);
        const strippedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return strippedDate;
    }

    startLoading() {
        super.startLoading();

        this.button.isDisabled = true;
        this.textField.isDisabled = true;
    }

    stopLoading() {
        super.stopLoading();

        this.button.isDisabled = false;
        this.textField.isDisabled = false;
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

    _createActionView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.center, StackView.CrossAxisAlignment.center, Gap.all("5px"));
        stackView.backgroundColor = Color.lightGrey;
        stackView.padding = Padding.all("10px");
        stackView.borders = Borders.top(new Border(Color.darkGreen, "1px"));

        const textField = this._createTextField();
        stackView.addView(textField);
        this._textField = textField;

        const button = this._createButton();
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

    _onTextChange(event) {
        this.button.isDisabled = this.text.length < 1;
    }

    _onItemViewCreated(event) {
        /*
        const itemView = event.data;
        const index = this.messages.length;
        if (index % 2 === 0) itemView.backgroundColor = new Color(245, 245, 245);
        */
    }

    _onItemViewClicked(event) {
        const itemView = event.data;
        console.log(itemView);
    }

    _createButton() { // todo button bild
        const button = new Button();
        button.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        button.backgroundColor = Color.darkGreen;
        button.color = Color.white;
        button.fontSize = "15px";
        button.isDisabled = true;
        button.padding = Padding.axes("10px", "3px");
        button.text = "senden";
        button.corners = Corners.all(new RoundedCorner("10px"))
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onSubmit.bind(this));

        return button;
    }

    async _onSubmit(event) {
        const text = this.text;
        if (text.length < 1) return;

        const userId = AppWriteAuthentication.sharedInstance.user.$id; // TODO oder account.get()

        const messageDocument = await this.messageDocumentManager._create({ text: text, team: this.containerId, author: userId });
        const previewManager = this.previewManager;
        const containerId = this.containerId;

        const previewDocuments = await previewManager.loadResources([Query.equal("$id", containerId)]);
        if (previewDocuments.length > 0) await previewManager.update({$id: previewDocuments[0].$id, message: messageDocument.$id});
        else await previewManager.create({ score: 0, message: messageDocument.$id, $id: containerId });

        this.textField.clear();
        await this.updateMessages();
    }

    _createContentView() {
        const contentView = super._createContentView();
        contentView.overflow = View.Overflow.hidden;
        contentView.mainAxisAlignment = StackView.MainAxisAlignment.spaceBetween;
        contentView.grow = "1";

        const actionView = this._createActionView();
        contentView.addView(actionView);

        return contentView;
    }
}