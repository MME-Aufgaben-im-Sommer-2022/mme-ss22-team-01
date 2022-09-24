"use strict";

import { Border, Borders, Color, Gap, Margin, Padding, Select, StackView, TextArea } from "../libs/WrappedUI.js";
import BGItemCreationSectionView from "./BGItemCreationSectionView.js";

export default class BGChallengeCreationSectionView extends BGItemCreationSectionView {
    constructor() {
        super();
    }

    get descriptionTextArea() {
        return this._descriptionTextArea;
    }

    get description() {
        return this.descriptionTextArea.text;
    }

    set description(value) {
        this.descriptionTextArea.text = value;
    }

    get tagContainerView() {
        return this._tagContainerView;
    }

    _createContentView() {
        const contentView = super._createContentView();
        contentView.crossAxisAlignment = StackView.CrossAxisAlignment.flexEnd;

        return contentView;
    }

    _createLeadingContainer() {
        const stackView = super._createLeadingContainer();
        stackView.axis = StackView.Axis.vertical;
        stackView.mainAxisAlignment = StackView.MainAxisAlignment.center;
        stackView.crossAxisAlignment = StackView.CrossAxisAlignment.stretch;
        stackView.grow = "1";
        stackView.gap = Gap.all("2px");

        const descriptionTextArea = this._createDescriptionTextArea();
        this._descriptionTextArea = descriptionTextArea;
        stackView.addView(descriptionTextArea);

        const tagContainerView = this._createTagContainerView();
        stackView.addView(tagContainerView);
        this._tagContainerView = tagContainerView;

        return stackView;
    }
    /*
        _createTrailingContainer() {
            const trailingContainer = super._createTrailingContainer();
    
            const startButton = this._createButton();
            this._startButton = startButton;
            trailingContainer.addView(startButton);
    
            return trailingContainer;
        }
    */

    _createDescriptionTextArea() {
        const textArea = new TextArea();

        textArea.fontFamily = TextArea.FontFamily.sansSerif;
        textArea.resize = TextArea.Resize.vertical;
        textArea.padding = Padding.axes("5px", "5px");
        textArea.placeholder = "Beschreibung";
        textArea.backgroundColor = Color.transparent;
        textArea.fontSize = "15px";
        textArea.isRequired = true;
        textArea.maxLength = 512;
        textArea.minLength = 4;
        textArea.minHeight = "50px";
        textArea.maxHeight = "300px"
        textArea.borders = Borders.all(Border.none); //todo dafür static get
        textArea.addEventListener(TextArea.TEXT_FIELD_CHANGE_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textArea.addEventListener(TextArea.TEXT_FIELD_KEYPRESS_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textArea.addEventListener(TextArea.TEXT_FIELD_PASTE_NOTIFICATION_TYPE, this._onNameChange.bind(this));
        textArea.addEventListener(TextArea.TEXT_FIELD_INPUT_NOTIFICATION_TYPE, this._onNameChange.bind(this));

        return textArea;
    }

    get durationSelect() {
        return this._durationSelect;
    }

    get scoreSelect() {
        return this._scoreSelect;
    }

    get duration() {
        const selectedOption = this.durationSelect.selectedOption;

        if (selectedOption === undefined) return;
        return Number(selectedOption.value);
    }

    get score() {
        const selectedOption = this.scoreSelect.selectedOption;

        if (selectedOption === undefined) return;
        return Number(selectedOption.value);
    }

    _createTagContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("5px"));
        stackView.margin = Margin.top("10px");

        const durationSelect = this._createDurationSelect();
        this._durationSelect = durationSelect;
        stackView.addView(durationSelect);

        const scoreSelect = this._createScoreSelect();
        this._scoreSelect = scoreSelect;
        stackView.addView(scoreSelect);

        return stackView;
    }

    _createDurationSelect() {
        const select = new Select();
        select.options.add(new Option("1 Std", "3600"));
        select.options.add(new Option("12 Std", "43200"));
        select.options.add(new Option("1 Tag", "86400"));
        select.options.add(new Option("3 Tage", "259200"));
        select.options.add(new Option("1 Woche", "604800"));
        select.options.add(new Option("1 Monat", "2628000"));
        select.backgroundColor = Color.orange;

        return select;
    }

    _createScoreSelect() {
        const select = new Select();
        select.options.add(new Option("10 Punkte", "10"));
        select.options.add(new Option("20 Punkte", "20"));
        select.options.add(new Option("50 Punkte", "50"));
        select.options.add(new Option("100 Punkte", "100"));
        select.options.add(new Option("250 Punkte", "250"));
        select.options.add(new Option("500 Punkte", "500"));
        select.options.add(new Option("1000 Punkte", "1000"));
        select.backgroundColor = Color.darkGreen;

        return select;
    }

    _validate() {
        return super._validate() && this.descriptionTextArea.validate();
    }
}