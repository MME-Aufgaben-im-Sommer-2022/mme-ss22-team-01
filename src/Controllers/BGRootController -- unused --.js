"use strict";

import { View, Color, StackView, Label, Padding, Corners, RoundedCorner, Borders, Border, BoxShadow, Grid, GridInset, Controller, Navigation, Gap, Button, RootController } from "../UI/libs/WrappedUI.js";
import image from "../../public/muneeb-syed-x9NfeD3FpsE-unsplash.jpg";


export default class BGRootViewController extends RootController { // todo umbennen zu rootcontroller oder eine klasse als bgindexcontroller

    constructor() {
        super();

        this._embeddedControllers = [];
    }

    get embeddedControllers() {
        return this._embeddedControllers;
    }

    _createTitleView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px"));

        const titleLabel = this._createTitleLabel();
        this._titleLabel = titleLabel;
        stackView.addView(titleLabel);

        return stackView;
    }

    embedController(controller, position) {
        if (controller.parentController !== undefined) throw new Error("Cannot add controller to more than one parent controller");

        this.embeddedControllers.push(controller);

        controller.parentController = this;

        this.contentView.addView(controller.view);

        controller.view.gridInset = position;
    }

    get navigationView() {
        return this._navigationView;
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

    get scoreLabel() {
        return this._scoreLabel;
    }

    get score() {
        return parseInt(this.scoreLabel.text);
    }

    set score(value) {
        this.scoreLabel.text = value.toString();
    }

    get iconButton() {
        return this._iconButton;
    }

    get contact() {
        return this.iconButton.text;
    }

    set contact(value) {
        this.iconButton.text = value;
    }

    get contentView() {
        return this._contentView;
    }

    _createNavigationView() {
        const navigation = new Navigation();
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center);

        stackView.backgroundColor = Color.white;
        stackView.height = "75px";
        stackView.padding = Padding.horizontal("15px");
        stackView.borders = Borders.bottom(new Border(Color.darkGrey, "1px"));
        stackView.shadow = new BoxShadow("0px", "5px", new Color(0, 0, 0, 0.25), "5px", "3px");

        const titleView = this._createTitleView();
        stackView.addView(titleView);

        const infoView = this._createInfoView();
        stackView.addView(infoView);
        navigation.addView(stackView);

        return navigation;
    }

    _createContentView() {
        const grid = new Grid();

        grid.columns = "1fr 4fr";
        grid.rows = "1fr 1fr";
        grid.gap = Gap.all("15px");
        grid.padding = Padding.all("15px");
        grid.minHeight = "0";

        return grid;
    }


    _createTitleLabel() {
        const label = new Label();

        label.text = "BeGreen";
        label.color = Color.darkGreen;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.fontWeight = Label.FontWeight.bold;
        label.fontSize = "20px";
        this._titleLabel = label;

        return label;
    }

    _createScoreLabel() {
        const label = new Label();

        label.textAlignment = Label.TextAlignment.center;
        label.color = Color.darkGreen;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.padding = Padding.axes("20px", "10px");
        label.backgroundColor = Color.lightGrey;
        label.corners = Corners.all(new RoundedCorner("10px"));
        label.fontSize = "22px";

        return label;
    }

    _createIconButton() {
        const button = new Button();

        button.minWidth = "50px";
        button.minHeight = "50px";
        button.text = "N";
        button.textAlignment = Label.TextAlignment.center;
        button.color = Color.white;
        button.fontFamily = Label.FontFamily.sansSerif;
        button.padding = Padding.all("15px");
        button.backgroundColor = Color.darkGreen;
        button.borders = Borders.all(Border.none);
        button.corners = Corners.all(new RoundedCorner("25px"));
        button.fontWeight = Label.FontWeight.bold;
        button.fontSize = "17px";

        return button;
    }

    _createInfoView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px"));

        const scoreLabel = this._createScoreLabel();
        this._scoreLabel = scoreLabel;
        stackView.addView(scoreLabel);

        const iconButton = this._createIconButton();
        this._iconButton = iconButton;
        stackView.addView(iconButton);

        return stackView;
    }

    _createView() {
        const view = super._createView();
        view.backgroundColor = Color.darkGreen;
        view.backgroundSize = "cover";
        view.backgroundImage = `url(${image})`;

        const navigationView = this._createNavigationView();
        navigationView.zIndex = "1";
        this._navigationView = navigationView;
        view.addView(navigationView);

        const contentView = this._createContentView();
        contentView.grow = "1";

        this._contentView = contentView;
        view.addView(contentView);
    }
}
