"use strict";

import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import { TextField, Border, Borders, BoxShadow, Color, Corners, Label, Padding, RoundedCorner, StackView, View, Gap, Margin, Button, Controller } from "../UI/libs/WrappedUI.js";
import image from "../../public/muneeb-syed-x9NfeD3FpsE-blur-10-unsplash.jpg";

export default class BGAuthenticationController extends Controller {

    constructor(mode = BGAuthenticationController.Mode.login) {
        super();

        this.mode = mode;
    }

    static get LOGIN_BUTTON_HINT_TEXT() {
        return "Anmelden";
    }

    static get REGISTER_BUTTON_HINT_TEXT() {
        return "Registrieren";
    }

    static get Mode() {
        return Object.freeze({
            login: "login",
            register: "register"
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

        const mailTextField = this._createMailTextField();
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

    _createTextField() {
        const textField = new TextField();
        textField.fontFamily = TextField.FontFamily.sansSerif;
        textField.margin = Margin.zero;
        textField.fontSize = "17px";
        textField.padding = Padding.axes("10px", "7px");
        textField.borders = Borders.all(Border.none);
        textField.corners = Corners.all(new RoundedCorner("1px"));
        textField.isRequired = true;

        return textField;
    }

    _createNameTextField() {
        const textField = this._createTextField();
        textField.placeholder = "Name";
        textField.minLength = 4;

        return textField;
    }

    _createPasswordTextField() {
        const textField = this._createTextField();
        textField.placeholder = "Passwort";
        textField.textInputType = TextField.TextInputType.password;
        textField.minLength = 4;
        textField.maxLength = 32;

        return textField;
    }

    _createMailTextField() {
        const textField = this._createTextField();
        textField.placeholder = "Mail";
        textField.textInputType = TextField.TextInputType.email;

        return textField;
    }

    _createButton() {
        const button = new Button();
        button.fontFamily = Button.FontFamily.sansSerif;
        button.padding = Padding.axes("15px", "5px");
        button.corners = Corners.all(new RoundedCorner("10px"));
        button.fontSize = "15px";

        return button;
    }

    _createModeButton() {
        const button = this._createButton();

        button.color = Color.white;
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(Border.none);
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._switchMode.bind(this));

        return button;
    }

    _createSubmitButton() {
        const button = this._createButton();

        button.color = Color.darkGreen;
        button.backgroundColor = Color.white;
        button.borders = Borders.all(new Border(Color.darkGreen, "2px"));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._submit.bind(this));

        return button;
    }

    _updateMode() {
        const mode = this.mode;

        switch (mode) {
            case BGAuthenticationController.Mode.login:
                this.nameTextField.isHidden = true;
                this.modeHint = BGAuthenticationController.REGISTER_BUTTON_HINT_TEXT;
                this.submitHint = BGAuthenticationController.LOGIN_BUTTON_HINT_TEXT;
                break;
            case BGAuthenticationController.Mode.register:
                this.nameTextField.isHidden = false;
                this.modeHint = BGAuthenticationController.LOGIN_BUTTON_HINT_TEXT;
                this.submitHint = BGAuthenticationController.REGISTER_BUTTON_HINT_TEXT;
                break;
            default:
                throw new Error(`Unsupported mode ${mode}`);
        }
    }

    _switchMode() {
        this.mode = this.mode === BGAuthenticationController.Mode.login ? BGAuthenticationController.Mode.register : BGAuthenticationController.Mode.login;
    }

    async _submit() {
        const contentView = this.contentView;
        try {
            const mode = this.mode;
            switch (mode) {
                case BGAuthenticationController.Mode.login:
                    if ((this.mailTextField.validate() && this.passwordTextField.validate()) === false) throw new Error("Failed to validate input");
                    contentView.isDisabled = true;
                    await AppWriteAuthentication.sharedInstance.login(this.email, this.password);
                    break;
                case BGAuthenticationController.Mode.register:
                    if ((this.mailTextField.validate() && this.nameTextField.validate() && this.passwordTextField.validate()) === false) throw new Error("Failed to validate input");
                    contentView.isDisabled = true;
                    await AppWriteAuthentication.sharedInstance.register(this.email, this.password, this.name);
                    break;
                default:
                    throw new Error(`Unsupported mode: ${mode}`);
            }
            this.removeFromParentController();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            contentView.isDisabled = false;
        }
    }
}