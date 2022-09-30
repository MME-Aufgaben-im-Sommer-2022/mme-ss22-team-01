import { View, Color, StackView, Label, Padding, Borders, Border, Gap, Controller, Corners, RoundedCorner } from "../UI/libs/WrappedUI.js";

/**
 * this controller represents the base for all embedded controllers setting base behavior and properties. It also sets the base appearance.
 */
export default class BGController extends Controller {

    /**
     * below are getters to access ui elements and their properties
     */
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

    /**
    * below are several functions to create views an manage the controllers view hierarchy. 
     */
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
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center, Gap.all("5px")), titleLabel = this._createTitleLabel();

        stackView.shrink = "0";
        stackView.backgroundColor = Color.white;
        stackView.padding = Padding.axes("15px", "10px");
        stackView.borders = Borders.bottom(new Border(Color.darkGreen, "1px"));

        this._titleLabel = titleLabel;
        stackView.addView(titleLabel);

        return stackView;
    }

    _createView() {
        const view = super._createView(), headerView = this._createHeaderView(), contentView = this._createContentView();
        view.backgroundColor = Color.white;
        view.corners = Corners.all(new RoundedCorner("15px"));
        view.overflow = View.Overflow.hidden;
        view.position = View.Position.relative;

        view.addView(headerView);
        this._headerView = headerView;

        this._contentView = contentView;
        view.addView(contentView);

        return view;
    }

    _createContentView() {
        const stackView = new StackView(StackView.Axis.vertical, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.stretch);

        return stackView;
    }
}