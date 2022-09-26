"use strict";

import { Event } from "../../utils/Observable.js";
import { Border, Borders, Button, Color, Corners, Gap, Icon, Label, Padding, RoundedCorner, StackView } from "../libs/WrappedUI.js";
import BGContactListViewItemView from "./BGContactListViewItemView.js";

export default class BGContactListViewTeamItemView extends BGContactListViewItemView {
    static get ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE() {
        return "itemDeleteButtonClicked";
    }

    _applyData() {
        const data = this._data;

        this.name = data.name;
        this.detail = data.message;
    }

    _createView() {
        const view = super._createView();

        const actionContainerView = this._createActionContainerView();
        this._actionContainerView = actionContainerView;
        view.addView(actionContainerView);

        return view;
    }

    get actionContainerView() {
        return this._actionContainerView;
    }

    _createActionContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.center, StackView.CrossAxisAlignment.center, Gap.all("5px"));
        stackView.padding = Padding.all("10px");

        const deleteButton = this._createDeleteButton();
        deleteButton.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onDeleteButtonClicked.bind(this));
        this._deleteButton = deleteButton;
        stackView.addView(deleteButton);

        return stackView;
    }

    _createDeleteIcon() {
        const icon = new Icon();
        icon.textAlignment = Icon.TextAlignment.center;
        icon.color = Color.darkGreen;
        icon.pointerEvents = Icon.PointerEvents.none;
        icon.classList.add("fa-solid", "fa-close");
        icon.fontSize = "15px";

        return icon;
    }

    _createDetailLabel() {
        const detailLabel = super._createDetailLabel();
        detailLabel.maxWidth = "200px";
        detailLabel.overflow = Label.Overflow.hidden;
        detailLabel.textOverflow = Label.TextOverflow.ellipsis;

        return detailLabel;
    }

    get deleteButton() {
        return this._deleteButton;
    }

    get deleteIcon() {
        return this._deleteIcon;
    }

    _createDeleteButton() {
        const button = new Button();
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(Border.none);
        button.height = "26px";
        button.width = "26px";
        button.backgroundColor = Color.transparent;
        button.corners = Corners.all(new RoundedCorner("13px"));
        button.padding = Padding.axes("2px", "5px");
       
        const deleteIcon = this._createDeleteIcon();
        this._deleteIcon = deleteIcon;
        button.addView(deleteIcon);

        button.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onDeleteButtonMouseOut.bind(this));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onDeleteButtonMouseOut.bind(this));
        button.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onDeleteButtonMouseOver.bind(this));
   
        return button;
    }

    _onDeleteButtonMouseOut(event) {
        this.deleteButton.backgroundColor = Color.transparent;
        this.deleteIcon.color = Color.darkGreen;
    }

    _onDeleteButtonMouseOver(event) {
        this.deleteButton.backgroundColor = Color.darkGreen;
        this.deleteIcon.color = Color.white;
    }

    _onDeleteButtonClicked(event) {
        const e = new Event(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this);
        this.notifyAll(e);
    }
}