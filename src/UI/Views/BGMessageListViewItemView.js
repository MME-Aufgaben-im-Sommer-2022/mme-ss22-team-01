"use strict";

import { Border, Borders, Color, Corners, Gap, Label, Margin, Padding, RoundedCorner, StackView, TextView } from "../libs/WrappedUI.js";
import BGListViewItemView from "./BGListViewItemView.js";

export default class BGMessageListViewItemView extends BGListViewItemView {

    get nameLabel() {
        return this._nameLabel;
    }

    get name() {
        return this.nameLabel.text;
    }

    set name(value) {
        this.nameLabel.text = value;
    }

    get timeLabel() {
        return this._timeLabel;
    }

    get time() {
        return this.timeLabel.text;
    }

    set time(value) {//todo formatting
        this.timeLabel.text = value;
    }

    static get Origin() {
        return Object.freeze({
            self: BGMessageListViewItemView.MainAxisAlignment.flexEnd,
            foreign: BGMessageListViewItemView.MainAxisAlignment.flexStart
        });
    }

    set origin(value) {
        this.mainAxisAlignment = value;
    }

    get origin() {
        const origin = this.mainAxisAlignment;
        const values = Object.values(BGMessageListViewItemView.Origin);

        const value = values.find(value => value === origin);
        if (value === undefined) throw new Error(`Unsupported origin: ${origin}`);

        return value;
    }

    get textView() {
        return this._textView;
    }

    get text() {
        return this.textView.text;
    }

    set text(value) {
        this.textView.text = value;
    }

    constructor(data) {
        super(data);

        this.contentView.borders = Borders.all(new Border(Color.darkGreen, "1px"));
    }

    _createContentView() {
        const contentView = super._createContentView();
        contentView.axis = StackView.Axis.vertical;
        contentView.crossAxisAlignment = StackView.CrossAxisAlignment.stretch;
        contentView.grow = "0";
        contentView.gap = Gap.all("5px");
        contentView.padding = Padding.all("5px");
        contentView.backgroundColor = Color.lightGrey;
        contentView.corners = Corners.all(new RoundedCorner("10px"));
        contentView.maxWidth = "65%";

        const infoView = this._createInfoView();
        contentView.addView(infoView);

        const textView = this._createTextView();
        this._textView = textView;
        contentView.addView(textView);

        return contentView;
    }

    _createInfoView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.flexStart);
        stackView.gap = Gap.all("10px");

        const nameLabel = this._createNameLabel();
        stackView.addView(nameLabel);
        this._nameLabel = nameLabel;

        const timeLabel = this._createTimeLabel();
        stackView.addView(timeLabel);
        this._timeLabel = timeLabel;

        return stackView;
    }

    _createNameLabel() {
        const label = new Label();
        label.fontWeight = Label.FontWeight.bold;
        label.fontSize = "12px";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.text = "Natalie";
        label.color = Color.darkGreen;

        return label;
    }

    _createTimeLabel() {
        const label = new Label();
        label.fontFamily = Label.FontFamily.sansSerif;
        label.fontWeight = Label.FontWeight.bold;
        label.text = "10:00";
        label.fontSize = "8px";
        label.color = Color.darkGrey;

        return label;
    }

    _createTextView() {
        const textView = new TextView();
        textView.fontFamily = Label.FontFamily.sansSerif;
        textView.fontSize = "14px";
        textView.padding = Padding.zero;
        textView.margin = Margin.zero;
        textView.color = Color.black;
        textView.text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

        return textView;
    }

    _applyData() {
        const data = this.data;

        this.time = this._formatDate(data.createdAt);
        this.text = data.text;
        this.name = data.name;
        this.origin = data.isForeign ? BGMessageListViewItemView.Origin.foreign : BGMessageListViewItemView.Origin.self;
    }

    _formatDate(timestamp){
        let date = new Date(timestamp*1000);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if(hours < 10){
            hours = "0" + hours;
        }
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes;
    }
}