"use strict";

import { View, Color, StackView, Label, Padding, Borders, Border, Controller, Gap } from "../UI/libs/WrappedUI.js";

export default class BGController extends Controller {

    get titleLabel() {
        return this._titleLabel;
    }

    get title() {
        return this.titleLabel.text;
    }

    set title(value) {
        this.titleLabel.text = value;
    }

    get headerView() {
        return this._headerView;
    }

    get contentView() {
        return this._contentView;
    }

    _createTitleLabel() {
        const label = new Label();

        label.text = "Title";
        label.color = Color.darkGreen;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.fontSize = "22px";
        label.fontWeight = Label.FontWeight.bold;

        return label;
    }

    _createHeaderView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("5px"));

        stackView.shrink = "0";
        stackView.backgroundColor = Color.white;
        stackView.padding = Padding.axes("15px", "10px");
        stackView.borders = Borders.bottom(new Border(Color.darkGreen, "1px"));

        const titleLabel = this._createTitleLabel();
        this._titleLabel = titleLabel;
        stackView.addView(titleLabel);
        //stackView.shadow = new BoxShadow("0px", "5px", new Color(0, 0, 0, 0.25), "5px", "3px");

        return stackView;
    }

    _createView() {
        const view = super._createView();
        view.backgroundColor = Color.white;
        view.overflow = View.Overflow.hidden;

        const headerView = this._createHeaderView();
        view.addView(headerView);
        this._headerView = headerView;

        const contentView = this._createContentView();
        this._contentView = contentView;
        //contentView.grow = "1";
        view.addView(contentView);

        return view;
    }

    _createContentView() {
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);
        //stackView.grow = "1";

        return stackView;
    }
}