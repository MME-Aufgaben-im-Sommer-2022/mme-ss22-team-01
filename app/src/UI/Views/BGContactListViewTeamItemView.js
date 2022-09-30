import { Event } from "../../utils/Observable.js";
import { Border, Borders, Button, Color, Corners, Gap, Icon, Label, Padding, RoundedCorner, StackView } from "../libs/WrappedUI.js";
import BGContactListViewItemView from "./BGContactListViewItemView.js";

/**
 * this class is used to create an item view that can display a contact, such as teams or memberships.
 */
export default class BGContactListViewTeamItemView extends BGContactListViewItemView {

    /**
     * event label
     */
    static get ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE() {
        return "itemDeleteButtonClicked";
    }

    /**
     * the getters below are used to restrict access to ui-elements as read only
     */
    get actionContainerView() {
        return this._actionContainerView;
    }

    get deleteButton() {
        return this._deleteButton;
    }

    get deleteIcon() {
        return this._deleteIcon;
    }

    /**
     * this method is used to assign data properties to ui elements
     */
    _applyData() {
        const data = this._data;

        this.name = data.name;
        this.detail = data.message;
    }

    /**
     * this method is used to reset the mouse button to its default appearance ofter hovering ends
     */
    _onDeleteButtonMouseOut() {
        this.deleteButton.backgroundColor = Color.transparent;
        this.deleteIcon.color = Color.darkGreen;
    }

    /**
     * this method is called if a user hovers above the delete button, it results in the button being highlighted
     */
    _onDeleteButtonMouseOver() {
        this.deleteButton.backgroundColor = Color.darkGreen;
        this.deleteIcon.color = Color.white;
    }

    /**
     * this method notifies observers after the delete button has been pressed
     */
    _onDeleteButtonClicked() {
        this.notifyAll(new Event(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this));
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createView() {
        const view = super._createView(), actionContainerView = this._createActionContainerView();

        this._actionContainerView = actionContainerView;
        view.addView(actionContainerView);

        return view;
    }

    _createActionContainerView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.center, StackView.CrossAxisAlignment.center, Gap.all("5px")), deleteButton = this._createDeleteButton();
        stackView.padding = Padding.all("10px");

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

    _createDeleteButton() {
        const button = new Button(), deleteIcon = this._createDeleteIcon();
        button.backgroundColor = Color.transparent;
        button.borders = Borders.all(Border.none);
        button.height = "26px";
        button.width = "26px";
        button.backgroundColor = Color.transparent;
        button.corners = Corners.all(new RoundedCorner("13px"));
        button.padding = Padding.axes("2px", "5px");

        this._deleteIcon = deleteIcon;
        button.addView(deleteIcon);

        button.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onDeleteButtonMouseOut.bind(this));
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onDeleteButtonMouseOut.bind(this));
        button.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onDeleteButtonMouseOver.bind(this));

        return button;
    }
}