import BGItemCreationSectionView from "./BGItemCreationSectionView.js";
import BGIconLabel from "./BGIconLabel.js";

/**
 * this view is used to visually resemble a list view section with one item, thus being editable 
 */
export default class BGTeamCreationSectionView extends BGItemCreationSectionView {

    /**
     * getters and setters expose access to the contact label and its text
     */
    get contactLabel() {
        return this._contactLabel;
    }

    set name(value) {
        super.name = value;
        this.contactLabel.text = value[0].toUpperCase();
    }

    get name() {
        return super.name;
    }

    /**
     * this method is overridden from its superclass and manipulates the icon to respond to text entry
     */
    _onNameChange() {
        const name = this.name;
        let character = "";
        if (name.length > 0) { character = name[0].toUpperCase(); }
        this.contactLabel.text = character;
    }

    /**
     * this method gets overridden to add the label to the view hierarchy
     * @returns an instance of StackView to hold the icon label
     */
    _createLeadingContainer() {
        const leadingContainer = super._createLeadingContainer(), contactLabel = new BGIconLabel();
        this._contactLabel = contactLabel;
        leadingContainer.addViewBefore(contactLabel, this.nameTextField);

        return leadingContainer;
    }
}