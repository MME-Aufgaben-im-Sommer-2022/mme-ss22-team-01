import BGListViewItemView from "./BGListViewItemView.js";
import BGIconLabel from "./BGIconLabel.js";
import { Label, Color, Padding, Corners, RoundedCorner, StackView } from "../libs/WrappedUI.js";

/**
 * this view is used to extend the default list view item for two labels to display text.
 */
export default class BGContactListViewItemView extends BGListViewItemView {

    constructor(data) {
        super(data);

        this.corners = Corners.all(new RoundedCorner("10px"));
        this.contentPadding = Padding.all("7px");
    }

    /**
     * this getter/setter pairs are used to access ui elements and their properties
     */
    get infoView() {
        return this._infoView;
    }

    get infoInset() {
        return this.infoView.inset;
    }

    set infoInset(value) {
        this.infoView.inset = value;
    }

    get contactLabel() {
        return this._contactLabel;
    }

    get nameLabel() {
        return this._nameLabel;
    }

    get name() {
        return this.nameLabel.text;
    }

    set name(value) {
        this.nameLabel.text = value;
        this.contactLabel.text = value[0].toUpperCase();
    }

    get detailLabel() {
        return this._detailLabel;
    }

    get detail() {
        return this.detailLabel.text;
    }

    set detail(value) {
        this.detailLabel.text = value;
    }

    /**
     * this method is used to assign properties from the data object to the ui
     */
    _applyData() {
        const data = this._data;

        this.name = data.name;
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createDetailLabel() {
        const label = new Label();

        label.color = Color.darkGrey;
        label.text = "Lorem ipsum dolor";
        label.fontSize = "12px";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.padding = Padding.zero;

        return label;
    }

    _createContentView() {
        const contentView = super._createContentView(), contactLabel = new BGIconLabel(), infoView = this._createInfoView();

        this._contactLabel = contactLabel;
        contentView.addView(contactLabel);

        this._infoView = infoView;
        contentView.addView(infoView);

        return contentView;
    }

    _createInfoView() {
        const stackView = new StackView(StackView.Axis.vertical), nameLabel = this._createNameLabel(), detailLabel = this._createDetailLabel();

        this._nameLabel = nameLabel;
        stackView.addView(nameLabel);

        this._detailLabel = detailLabel;
        stackView.addView(detailLabel);

        return stackView;
    }

    _createNameLabel() {
        const label = new Label();

        label.text = "Natalie";
        label.fontFamily = Label.FontFamily.sansSerif;
        label.padding = Padding.zero;

        return label;
    }
}