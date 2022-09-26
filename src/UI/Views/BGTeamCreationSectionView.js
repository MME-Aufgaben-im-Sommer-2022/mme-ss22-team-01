"use strict";

import BGItemCreationSectionView from "./BGItemCreationSectionView.js";
import BGIconLabel from "./BGIconLabel.js";

export default class BGTeamCreationSectionView extends BGItemCreationSectionView {

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

    _onNameChange(event) {
        const name = this.name;
        let character = "";
        if (name.length > 0) character = name[0].toUpperCase();
        this.contactLabel.text = character;
    }

    _createLeadingContainer() {
        const leadingContainer = super._createLeadingContainer(); 

        const contactLabel = new BGIconLabel();
        this._contactLabel = contactLabel;
        leadingContainer.addViewBefore(contactLabel, this.nameTextField);

        return leadingContainer;
    }
}