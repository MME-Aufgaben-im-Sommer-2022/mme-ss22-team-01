/*eslint no-magic-numbers: "off"*/
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication.js";
import { Event } from "../../utils/Observable.js";
import { Border, Borders, Button, Color, Corners, Gap, InlineBlock, Icon, Label, Margin, Padding, RoundedCorner, StackView, TextView } from "../libs/WrappedUI.js";
import BGListViewItemView from "./BGListViewItemView.js";

/**
 * this view is used to create item views suitable to display challenges based on the default list view
 */
export default class BGChallengeListViewItemView extends BGListViewItemView {

    /**
     * this constant is used to define challenge states
     */
    static get ChallengeState() {
        return Object.freeze({
            assigned: "assigned",
            unassigned: "unassigned",
            expired: "expired",
        });
    }

    /**
     * the constants below are used as event labels
     */
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

    constructor(data) {
        super(data);

        this.corners = Corners.all(new RoundedCorner("10px"));
    }

    /**
     * this getter is used to access the internal challenge state and to initiate ui updates upon state change
     */
    get challengeState() {
        return this._challengeState;
    }

    set challengeState(value) {
        this._challengeState = value;

        this._applyChallengeState();
    }

    /**
     * the getters/setters below are used to manage access to ui elements and their properties
     */
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

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createView() {
        const view = super._createView(), dividerView = this._createDividerView(), buttonContainerView = this._createButtonContainerView();
        view.backgroundColor = new Color(245, 245, 245);

        view.addView(dividerView);

        view.addView(buttonContainerView);

        return view;
    }

    _createContentView() {
        const contentView = super._createContentView(), titleLabel = this._createTitleLabel(), textView = this._createTextView(), tagContainerView = this._createTagContainerView();
        contentView.axis = StackView.Axis.vertical;
        contentView.crossAxisAlignment = StackView.MainAxisAlignment.flexStart;
        contentView.padding = Padding.all("10px");
        contentView.gap = Gap.all("5px");

        contentView.addView(titleLabel);
        this._titleLabel = titleLabel;

        contentView.addView(textView);
        this._textView = textView;

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

    _createTagContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("5px")), durationTag = this._createDurationTag(), scoreTag = this._createScoreTag(), expiryTag = this._createExpiryTag();
        stackView.margin = Margin.top("15px");

        this._durationTag = durationTag;
        stackView.addView(durationTag);

        this._scoreTag = scoreTag;
        stackView.addView(scoreTag);

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

    _createButtonContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceAround, StackView.CrossAxisAlignment.center, Gap.all("20px")), acceptButton = this._createAcceptButton(), deleteButton = this._createDeleteButton(), finishButton = this._createFinishButton(), cancelButton = this._createCancelButton();
        stackView.padding = Padding.axes("30px", "10px");

        stackView.addView(acceptButton);
        this._acceptButton = acceptButton;

        stackView.addView(deleteButton);
        this._deleteButton = deleteButton;

        stackView.addView(finishButton);
        this._finishButton = finishButton;

        stackView.addView(cancelButton);
        this._cancelButton = cancelButton;

        return stackView;
    }

    _createButton() {
        const button = new Button();
        button.borders = Borders.all(new Border(Color.darkGrey, "1px"));
        button.padding = Padding.zero;
        button.corners = Corners.all(new RoundedCorner("100%"));

        return button;
    }

    _createAcceptButton() {
        const button = this._createButton(), acceptIcon = this._createAcceptIcon();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onAccept.bind(this));
        button.addView(acceptIcon);

        return button;
    }

    _createDeleteButton() {
        const button = this._createButton(), deleteIcon = this._createDeleteIcon();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onDelete.bind(this));
        button.addView(deleteIcon);

        return button;
    }

    _createFinishButton() {
        const button = this._createButton(), finishIcon = this._createFinishIcon();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onFinish.bind(this));
        button.addView(finishIcon);

        return button;
    }

    _createCancelButton() {
        const button = this._createButton(), cancelIcon = this._createCancelIcon();
        button.backgroundColor = Color.transparent;
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onCancel.bind(this));
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
        inlineBlock.corners = Corners.all(new RoundedCorner("1px"));
        inlineBlock.backgroundColor = Color.lightGrey;
        inlineBlock.margin = Margin.vertical("25px");

        return inlineBlock;
    }

    /**
     * this method is called after the internal state has been modified. it manages the ui to match the state.
     */
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

    /**
     * this method returns a flag indicating wether the current data object has been created by the current user or not
     * @returns a boolean flag
     */
    _authorIsUser() {
        const user = AppWriteAuthentication.sharedInstance.user;
        if (user === undefined) { return false; }
        return this.data.author !== user.$id;
    }

    /**
     * this methods are used to notify observers of button clicks
     */
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

    /**
     * this method is used to assign properties from the data source to ui elements
     */
    _applyData() {
        const data = this.data, isExpiring = data.timestamp !== undefined, expiresAt = data.timestamp + data.duration, currentDate = (new Date()).getTime() / 1000;

        this.title = data.title;
        this.text = data.description;
        this.duration = this._formatDuration(data.duration);
        this.score = data.score;
        this.challengeState = isExpiring ? (expiresAt < currentDate) ? BGChallengeListViewItemView.ChallengeState.expired : BGChallengeListViewItemView.ChallengeState.assigned : BGChallengeListViewItemView.ChallengeState.unassigned;
        if (isExpiring === true) { this.expiry = this._calculateRemainingTime(expiresAt); }
    }

    /**
     * this method is used to convert seconds into a human readable format
     * @param {number} duration 
     * @returns 
     */
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

    /**
     * this method is used to calculate the remaining time for a challenge and return a human readable string
     * @param {number} timestamp timestamp in seconds 
     * @returns 
     */
    _calculateRemainingTime(timestamp) {
        let expDate = new Date(timestamp * 1000), currDate = new Date(), days = 0, diffInMillieSeconds = ((expDate - currDate) / (1000 * 60)), minutes = diffInMillieSeconds % 60, cutMinutes = Math.trunc(minutes), seconds = Math.trunc((Math.trunc((minutes % 1) * 100) * 60) / 100), hours = Math.trunc(diffInMillieSeconds / 60);

        if (diffInMillieSeconds < 0) { return "abgelaufen"; }
        if (minutes < 10) { cutMinutes = "0" + cutMinutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return this._formatRemainingTime(days, hours, cutMinutes, seconds);
    }

    /**
     * this method is used to create a human readable string from a time
     * @param {number} days 
     * @param {number} hours 
     * @param {number} minutes 
     * @param {number} seconds 
     * @returns 
     */
    _formatRemainingTime(days, hours, minutes, seconds) {
        let resultString, d = days, h = hours;
        if (h > 24) {
            d = Math.trunc(h / 24);
            h = h % 24;
            resultString = d + " d";
        }
        else if (d < 1 && h > 1) { resultString = h + " h"; }
        else if (h < 1) { resultString = minutes + " m : " + seconds + " s"; }

        return resultString;
    }
}