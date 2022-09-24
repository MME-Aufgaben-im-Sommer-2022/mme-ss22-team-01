"use strict";

import { Border, Borders, Button, Color, Corners, Icon, Gap, Label, Padding, RoundedCorner, StackView, TextField } from "../libs/WrappedUI.js";
import { Event } from "../../utils/Observable.js";

export default class BGItemCreationSectionView extends StackView {
    static get ENTRY_COMPLETE_NOTIFICATION_TYPE() {
        return "complete";
    }

    constructor() {
        super(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch, Gap.all("5px"));

        const titleLabel = this._createTitleLabel();
        this._titleLabel = titleLabel;
        this.addView(titleLabel);

        const contentView = this._createContentView();
        this._contentView = contentView;
        this.addView(contentView);

    }

    get contentView() {
        return this._contentView;
    }

    _createLeadingContainer() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("3px"));

        const nameTextField = this._createNameTextField();
        this._nameTextField = nameTextField;
        stackView.addView(nameTextField);
        
        return stackView;
    }

    _createTrailingContainer() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("3px"));

        const button = this._createButton();
        this._button = button;
        stackView.addView(button);

        return stackView;
    }

    _createContentView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("5px"));
        stackView.backgroundColor = new Color(240, 240, 240);
        stackView.corners = Corners.all(new RoundedCorner("10px"));
        stackView.padding = Padding.all("10px");

        const leadingContainer = this._createLeadingContainer();
        stackView.addView(leadingContainer);

        const trailingContainer = this._createTrailingContainer();
        stackView.addView(trailingContainer);

        return stackView;
    }

    get textInputType() {
        return this.nameTextField.textInputType;
    }

    set textInputType(value) {
        this.nameTextField.textInputType = value;
    }

    get nameTextField() {
        return this._nameTextField;
    }

    get name() {
        return this.nameTextField.text;
    }

    set name(value) {
        this.nameTextField.text = value;
    }

    get placeholder() {
        return this.nameTextField.placeholder;
    }

    set placeholder(value) {
        this.nameTextField.placeholder = value;
    }

    get titleLabel() {
        return this._titleLabel;
    }

    get title() {
        return this.titleLabel.text;
    }

    set title(value) {
        this.titleLabel.text = value;
    }

    get button() {
        return this._button;
    }

    get hint() {
        return this.button.text;
    }

    set hint(value) {
        this.button.text = value;
    }

    _createTitleLabel() {
        const label = new Label();
        label.text = "Header";
        label.fontWeight = Label.FontWeight.bold;
        label.fontFamily = Label.FontFamily.sansSerif; //TODO dafür default
        label.color = Color.darkGreen;
        label.fontSize = "17px";

        return label;
    }

    _createButton() {
        const button = new Button();
        button.color = Color.darkGreen;
        button.fontFamily = Button.FontFamily.sansSerif;
        button.fontSize = "13px";
        button.padding = Padding.axes("8px", "3px");
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        button.corners = Corners.all(new RoundedCorner("10px"));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onButtonClicked.bind(this));

        return button;
    }

    _createConfirmIcon(){
        const icon = new Icon();
        icon.classList.add("fa-solid", "fa-check");
        icon.color = Color.darkGreen;
        return icon;
    }

    _onNameChange(event) {
        console.log(event);
    }

    _validate() {
        return this.nameTextField.validate();
    }

    _onButtonClicked() {
        if (this._validate() === false) return;

        const event = new Event(BGItemCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _createNameTextField() {
        const textField = new TextField();

        textField.isRequired = true;
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.padding = Padding.axes("5px", "5px");
        textField.placeholder = "Name";
        textField.backgroundColor = Color.transparent;
        textField.maxLength = 128;
        textField.minLength = 4;
        textField.fontSize = "15px";
        textField.borders = Borders.all(Border.none); //todo dafür static get
        textField.addEventListener(TextField.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textField.addEventListener(TextField.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onNameChange.bind(this));

        return textField;
    }
}