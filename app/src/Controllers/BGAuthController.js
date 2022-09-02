"use strict";

import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGIndexController from "./BGIndexController.js";
import { TextField, Border, Borders, BoxShadow, Color, Corners, Label, Padding, RoundedCorner, StackView, View, Gap, Margin, Button, RootController } from "../UI/libs/WrappedUI.js";
import image from "../../public/muneeb-syed-x9NfeD3FpsE-blur-10-unsplash.jpg";

export default class BGAuthController extends RootController {

    constructor(mode = BGAuthController.Mode.login) {
        super();

        this.mode = mode;
    }

    static get Mode() {
        return Object.freeze({
            login: "Anmelden",
            register: "Registrieren"
        });
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;

        this._updateMode();
    }

    get title() {
        return this.label.text;
    }

    set title(value) {
        this.title.text = value;
    }

    get label() {
        return this._label;
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

    get passwordTextField() {
        return this._passwordTextField;
    }

    get password() {
        return this.passwordTextField.text;
    }

    set password(value) {
        this.passwordTextField.text = value;
    }

    get mailTextField() {
        return this._mailTextField;
    }

    get email() {
        return this.mailTextField.text;
    }

    set email(value) {
        this.mailTextField.text = value;
    }

    get modeButton() {
        return this._modeButton;
    }

    get modeHint() {
        return this.modeButton.text;
    }

    set modeHint(value) {
        this.modeButton.text = value;
    }

    get submitButton() {
        return this._submitButton;
    }

    get submitHint() {
        return this.submitButton.text;
    }

    set submitHint(value) {
        this.submitButton.text = value;
    }

    get contentView() {
        return this._contentView;
    }

    _createView() {
        const view = super._createView();

        view.position = View.Position.absolute;
        view.left = "0px";
        view.right = "0px";
        view.bottom = "0px";
        view.top = "0px";
        view.zIndex = "2";
        view.mainAxisAlignment = StackView.MainAxisAlignment.center;
        view.crossAxisAlignment = StackView.CrossAxisAlignment.center;
        view.backgroundColor = Color.darkGreen;
        view.backgroundSize = "cover";
        view.backgroundImage = `url(${image})`;

        const contentView = this._createContentView();
        this._contentView = contentView;
        view.addView(contentView);

        return view;
    }

    _createContentView() {
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);
        stackView.gap = Gap.all("25px");
        stackView.width = "325px";


        //stackView.minWidth = "200px";
        //stackView.width = "30%"; //Todo width implizit durch textField?
        //stackView.height = "300px";
        //stackView.padding = Padding.all("50px");

        const label = this._createLabel();
        stackView.addView(label);
        this._label = label;

        const textFieldContainerView = this._createTextFieldContainerView();
        stackView.addView(textFieldContainerView);

        const buttonContainerView = this._createButtonContainerView();
        stackView.addView(buttonContainerView);

        return stackView;
    }

    _createTextFieldContainerView() {
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);

        stackView.gap = Gap.all("2px");
        stackView.overflow = StackView.Overflow.hidden;
        stackView.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        stackView.shadow = new BoxShadow("0px", "5px", new Color(0, 0, 0, 0.25), "5px", "3px");
        stackView.corners = Corners.all(new RoundedCorner("10px"));
        stackView.backgroundColor = Color.darkGreen;

        const mailTextField = this._createMailTextField(); // da einfach createTextField, placeholder, mode
        stackView.addView(mailTextField);
        this._mailTextField = mailTextField;

        const nameTextField = this._createNameTextField();
        stackView.addView(nameTextField);
        this._nameTextField = nameTextField;

        const passwordTextField = this._createPasswordTextField();
        stackView.addView(passwordTextField);
        this._passwordTextField = passwordTextField;

        return stackView;
    }

    _createButtonContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("10px"));

        const modeButton = this._createModeButton();
        this._modeButton = modeButton;
        stackView.addView(modeButton);

        const submitButton = this._createSubmitButton();
        this._submitButton = submitButton;
        stackView.addView(submitButton);

        return stackView;
    }

    _createLabel() {
        const label = new Label();
        label.text = "BeGreen";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.fontWeight = Label.FontWeight.bold;
        label.textAlignment = Label.TextAlignment.center;
        label.fontSize = "30px";
        label.color = Color.white;

        return label;
    }

    _createNameTextField() {
        const textField = new TextField();
        //textField.backgroundColor = Color.white;
        //textField.corners = Corners.all(new RoundedCorner("10px"));
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.margin = Margin.zero;
        textField.fontSize = "17px";
        textField.padding = Padding.axes("10px", "7px");
        textField.placeholder = "name";
        textField.borders = Borders.unset;//  all(new Border(Color.darkGreen, "2px"));

        return textField;
    }

    _createPasswordTextField() {
        const textField = new TextField();
        textField.textInputType = TextField.TextInputType.password;
        textField.margin = Margin.zero;
        //textField.backgroundColor = Color.white;
        //textField.corners = Corners.all(new RoundedCorner("10px"));
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.fontSize = "17px";
        textField.padding = Padding.axes("10px", "7px");
        textField.placeholder = "password";
        //textField.borders = Borders.all(new Border(Color.darkGreen, "2px"));

        return textField;
    }

    _createMailTextField() {
        const textField = new TextField();
        textField.textInputType = TextField.TextInputType.email;
        textField.margin = Margin.zero;
        //textField.backgroundColor = Color.white;
        //textField.corners = Corners.all(new RoundedCorner("10px"));
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.fontSize = "17px";
        textField.padding = Padding.axes("10px", "7px");
        textField.placeholder = "mail";
        //textField.borders = Borders.all(new Border(Color.darkGreen, "2px"));

        return textField;
    }

    _createModeButton() {
        const button = new Button();

        button.text = "modeButton";
        button.color = Color.white;
        button.fontFamily = Button.FontFamily.sansSerif;
        button.fontSize = "15px";
        button.padding = Padding.axes("15px", "5px");
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(Border.none);
        button.corners = Corners.all(new RoundedCorner("10px"));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._switchMode.bind(this));

        return button;
    }

    _createSubmitButton() { //Todo eine methode createbutton und dann hier nur noch die custom actions, viel duplizierter code
        const button = new Button();

        button.text = "submitButton";
        button.color = Color.darkGreen;
        button.fontFamily = Button.FontFamily.sansSerif;
        button.fontSize = "15px";
        button.padding = Padding.axes("15px", "5px");
        button.backgroundColor = Color.white;
        button.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        button.corners = Corners.all(new RoundedCorner("10px"));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._submit.bind(this));

        return button;
    }

    _updateMode() {
        switch (this.mode) { // Todo des kann noch gekürzt werden wenn da nichts mehr dazukommt
            case BGAuthController.Mode.login:
                this.nameTextField.isHidden = true;
                this.modeHint = BGAuthController.Mode.register;
                this.submitHint = BGAuthController.Mode.login;
                break;
            case BGAuthController.Mode.register:
                this.nameTextField.isHidden = false;
                this.modeHint = BGAuthController.Mode.login;
                this.submitHint = BGAuthController.Mode.register;
                break;
            default:
                throw new Error("Unsupported mode");
        }
    }

    _switchMode() {
        this.mode = this.mode === BGAuthController.Mode.login ? BGAuthController.Mode.register : BGAuthController.Mode.login;
    }

    async _submit() {
        const contentView = this.contentView;
        contentView.isDisabled = true;
        try {
            switch (this.mode) { // Todo des kann noch gekürzt werden wenn da nichts mehr dazukommt
                case BGAuthController.Mode.login: // todo validate
                    await AppWriteAuthentication.sharedInstance.login(this.email, this.password);
                    break;
                case BGAuthController.Mode.register:
                    await AppWriteAuthentication.sharedInstance.register(this.email, this.password, this.name);
                    break;
                default:
                    throw new Error("Unsupported mode");
            }
            this.addController(new BGIndexController());
        }
        catch (error) {
            console.log(error);
        }
        finally {
            contentView.isDisabled = false;
        }
    }
}