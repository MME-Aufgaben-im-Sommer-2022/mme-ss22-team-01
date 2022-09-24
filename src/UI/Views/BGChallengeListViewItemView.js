"use strict";

import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication.js";
import { Event } from "../../utils/Observable.js";
import { Border, Borders, Button, Color, Corners, Gap, InlineBlock, Icon, Label, Margin, Padding, RoundedCorner, StackView, TextView } from "../libs/WrappedUI.js";
import BGListViewItemView from "./BGListViewItemView.js";


export default class BGChallengeListViewItemView extends BGListViewItemView {

    static get CHALLENGE_ACCEPT_NOTIFICATION_TYPE() {
        return "accept";
    }

    static get CHALLENGE_FINISH_NOTIFICATION_TYPE() {
        return "finish";
    }

    static get CHALLENGE_CANCEL_NOTIFICATION_TYPE() {
        return "cancel";
    }

    static get CHALLENGE_DELETE_NOTIFICATION_TYPE() {
        return "delete";
    }

    static get ChallengeState() {
        return Object.freeze({
            assigned: "assigned",
            unassigned: "unassigned",
            expired: "expired"
        });
    }

    constructor(data) {
        super(data);

        this.corners = Corners.all(new RoundedCorner("10px"));
    }

    get challengeState() {
        return this._challengeState;
    }

    set challengeState(value) {
        this._challengeState = value;

        this._applyChallengeState();
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

    get textView() {
        return this._textView;
    }

    get text() {
        return this.textView.text;
    }

    set text(value) {
        this.textView.text = value;
    }

    _createView() {
        const view = super._createView();
        view.backgroundColor = new Color(245, 245, 245); // TOdo des noch raus nur test, farbe wird dynamisch gesetzt

        const dividerView = this._createDividerView();
        view.addView(dividerView);

        const buttonContainerView = this._createButtonContainerView();
        view.addView(buttonContainerView);
        //this._buttonContainerView = buttonContainerView;

        return view;
    }


    _createContentView() {
        const contentView = super._createContentView();
        contentView.axis = StackView.Axis.vertical;
        contentView.crossAxisAlignment = StackView.MainAxisAlignment.flexStart;
        contentView.padding = Padding.all("10px");
        contentView.gap = Gap.all("5px");

        const titleLabel = this._createTitleLabel();
        contentView.addView(titleLabel);
        this._titleLabel = titleLabel;

        const textView = this._createTextView();
        contentView.addView(textView);
        this._textView = textView;

        const tagContainerView = this._createTagContainerView();
        contentView.addView(tagContainerView);
        this._tagContainerView = tagContainerView;

        return contentView;
    }

    _createTitleLabel() {
        const label = new Label();
        label.fontWeight = Label.FontWeight.bold;
        label.fontSize = "15px";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.text = "Natalie";
        label.color = Color.black;

        return label;
    }

    _createTextView() {
        const textView = new TextView();
        textView.fontFamily = Label.FontFamily.sansSerif;
        textView.fontSize = "14px";
        textView.padding = Padding.zero;
        textView.margin = Margin.zero;
        textView.color = Color.darkGrey;
        textView.text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.";

        return textView;
    }

    get expiryTag() {
        return this._expiryTag;
    }

    get durationTag() {
        return this._durationTag;
    }

    get scoreTag() {
        return this._scoreTag;
    }

    get score() {
        return this.scoreTag.text;
    }

    set score(value) {
        this.scoreTag.text = value;
    }

    get duration() {
        return this.durationTag.text;
    }

    set duration(value) {
        this.durationTag.text = value;
    }

    get expiry() {
        return this.expiryTag.text;
    }

    set expiry(value) {
        this.expiryTag.text = value;
    }

    _createTagContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("5px"));
        stackView.margin = Margin.top("15px");

        const durationTag = this._createDurationTag();
        this._durationTag = durationTag;
        stackView.addView(durationTag);

        const scoreTag = this._createScoreTag();
        this._scoreTag = scoreTag;
        stackView.addView(scoreTag);

        const expiryTag = this._createExpiryTag();
        this._expiryTag = expiryTag;
        stackView.addView(expiryTag);

        return stackView;
    }

    _createTag(text) {
        const label = new Label();
        label.corners = Corners.all(new RoundedCorner("12px"));
        label.borders = Borders.all(new Border(Color.darkGrey, "1px"));
        label.padding = Padding.axes("20px", "3px");
        label.fontSize = "9px";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.text = text;
        label.color = Color.white;

        return label;
    }

    _createDurationTag() {
        const tag = this._createTag();
        tag.backgroundColor = Color.orange;

        return tag;
    }

    _createScoreTag() {
        const tag = this._createTag();
        tag.backgroundColor = Color.darkGreen;

        return tag;
    }

    _createExpiryTag() {
        const tag = this._createTag();
        tag.backgroundColor = Color.red;
        tag.isHidden = true;

        return tag;
    }

    get acceptButton() {
        return this._acceptButton;
    }

    get finishButton() {
        return this._finishButton;
    }

    get cancelButton() {
        return this._cancelButton;
    }

    get deleteButton() {
        return this._deleteButton;
    }

    _createButtonContainerView() { // Todo maybe contact view und diese klasse aus neuer  class erben lassen
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceAround, StackView.CrossAxisAlignment.center, Gap.all("20px"));
        stackView.padding = Padding.axes("30px", "10px");

        const acceptButton = this._createAcceptButton();
        stackView.addView(acceptButton);
        this._acceptButton = acceptButton;

        const deleteButton = this._createDeleteButton();
        stackView.addView(deleteButton);
        this._deleteButton = deleteButton;

        const finishButton = this._createFinishButton();
        stackView.addView(finishButton);
        this._finishButton = finishButton;

        const cancelButton = this._createCancelButton();
        stackView.addView(cancelButton);
        this._cancelButton = cancelButton;

        return stackView;
    }

    _createButton() { // todo für icon einfach awesomefont benutzen wenn des hinhaut // STATE EINFÜREN UND BUTTONS MIT VERSCHIENDEN ACTIONS HIDEN. ODER BUTTONCLASS FOR STATE
        const button = new Button();
        button.borders = Borders.all(new Border(Color.darkGrey, "1px"));
        button.padding = Padding.zero;
        button.corners = Corners.all(new RoundedCorner("100%"));

        return button;
    } //Todo die buttons hier noch klären

    _createAcceptButton() {
        const button = this._createButton();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onAccept.bind(this));
        const acceptIcon = this._createAcceptIcon();
        button.addView(acceptIcon);

        return button;
    }

    _createDeleteButton() {
        const button = this._createButton();
        button.backgroundColor = Color.transparent; 
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onDelete.bind(this));
        const deleteIcon = this._createDeleteIcon();
        button.addView(deleteIcon);

        return button;
    }

    _createFinishButton() {
        const button = this._createButton();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onFinish.bind(this));
        const finishIcon = this._createFinishIcon();
        button.addView(finishIcon);

        return button;
    }

    _createCancelButton() {
        const button = this._createButton();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onCancel.bind(this));
        const cancelIcon = this._createCancelIcon();
        button.addView(cancelIcon);

        return button;
    }

    _createIcon() {
        const icon = new Icon();
        icon.pointerEvents = Icon.PointerEvents.none;
        icon.fontSize = "25px";
        icon.classList.add("fa-solid");

        return icon;
    }

    _createDeleteIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-circle-minus");
        icon.color = Color.red;

        return icon;
    }

    _createAcceptIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-circle-arrow-left");
        icon.color = Color.darkBlue;

        return icon;
    }

    _createFinishIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-circle-check");
        icon.color = Color.darkGreen;

        return icon;
    }

    _createCancelIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-circle-xmark");
        icon.color = Color.red;

        return icon;
    }

    _createDividerView() {
        const inlineBlock = new InlineBlock();
        inlineBlock.minWidth = "2px";
        inlineBlock.corners = Corners.all(new RoundedCorner("1px"))
        inlineBlock.backgroundColor = Color.lightGrey;
        inlineBlock.margin = Margin.vertical("25px");

        return inlineBlock;
    }

    _applyChallengeState() {
        const challengeState = this.challengeState;

        switch (challengeState) {
            case BGChallengeListViewItemView.ChallengeState.assigned:
                this.acceptButton.isHidden = true;
                this.cancelButton.isHidden = false;
                this.finishButton.isHidden = false;
                this.deleteButton.isHidden = true;
                this.expiryTag.isHidden = false;
                break;
            case BGChallengeListViewItemView.ChallengeState.expired:
                this.acceptButton.isHidden = true;
                this.cancelButton.isHidden = false;
                this.finishButton.isHidden = true;
                this.deleteButton.isHidden = true;
                this.expiryTag.isHidden = false;
                break;
            case BGChallengeListViewItemView.ChallengeState.unassigned:
                this.acceptButton.isHidden = false;
                this.cancelButton.isHidden = true;
                this.finishButton.isHidden = true;
                this.deleteButton.isHidden = this._authorIsUser();
                this.expiryTag.isHidden = true;
                break;
            default:
                throw new Error(`Unsupported challenge state: ${challengeState}`);
        }
    }

    _authorIsUser() {
        const user = AppWriteAuthentication.sharedInstance.user;
        if (user === undefined) return false;
        return this.data.author !== user.$id;
    }

    _onDelete() {
        const event = new Event(BGChallengeListViewItemView.CHALLENGE_DELETE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onAccept() {
        const event = new Event(BGChallengeListViewItemView.CHALLENGE_ACCEPT_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onFinish() {
        const event = new Event(BGChallengeListViewItemView.CHALLENGE_FINISH_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onCancel() {
        const event = new Event(BGChallengeListViewItemView.CHALLENGE_CANCEL_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _applyData() {
        const data = this.data;

        this.title = data.title;
        this.text = data.description;
        this.duration = this._formatDuration(data.duration);
        const isExpiring = data.timestamp !== undefined;
        this.score = data.score;
        const expiresAt = data.timestamp + data.duration;
        const currentDate = (new Date()).getTime() / 1000;
        this.challengeState = isExpiring ? (expiresAt < currentDate) ? BGChallengeListViewItemView.ChallengeState.expired : BGChallengeListViewItemView.ChallengeState.assigned : BGChallengeListViewItemView.ChallengeState.unassigned;
        if (isExpiring === true) this.expiry = this._calculateRemainingTime(expiresAt);
    }

    _formatDuration(duration) {
        let resultString;
        switch (duration) {
            case 3600:
                resultString = "1 Std";
                break;
            case 43200:
                resultString = "12 Std";
                break;
            case 86400:
                resultString = "1 Tag";
                break;
            case 259200:
                resultString = "3 Tage";
                break;
            case 604800:
                resultString = "1 Woche";
                break;
            case 2628000:
                resultString = "1 Monat";
                break;
            default:
                break;
        }
        return resultString;
    }

    _calculateRemainingTime(timestamp) {
        let expDate = new Date(timestamp * 1000);
        let currDate = new Date();
        let days = 0;
        let diffInMillieSeconds = ((expDate - currDate) / (1000 * 60));
        let minutes = diffInMillieSeconds % 60;
        let cutMinutes = Math.trunc(minutes);
        let seconds = Math.trunc((Math.trunc((minutes % 1) * 100) * 60) / 100);
        let hours = Math.trunc(diffInMillieSeconds / 60);

        if (diffInMillieSeconds < 0) {
            return "abgelaufen";
        }
        if (minutes < 10) {
            cutMinutes = "0" + cutMinutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return this._formatRemainingTime(days, hours, cutMinutes, seconds);
    }

    _formatRemainingTime(days, hours, minutes, seconds) {
        let resultString;
        if (hours > 24) {
            days = Math.trunc(hours / 24);
            hours = hours % 24
            resultString = days + " d";
        } else if (days < 1 && hours > 1) {
            resultString = hours + " h";
        } else if (hours < 1) {
            resultString = minutes + " m" + " : " + seconds + " s";
        }

        return resultString;
    }
}