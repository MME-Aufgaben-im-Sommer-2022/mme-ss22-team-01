"use strict";

import BGItemCreationController from "./BGItemCreationController.js";
import BGTeamCreationSectionView from "../UI/Views/BGTeamCreationSectionView.js";
import { Gap, TextField, View } from "../UI/libs/WrappedUI.js";


export default class BGMemberCreationController extends BGItemCreationController {

    get cancelButton() {
        return this._cancelButton;
    }

    get friendView() {
        return this._friendView;
    }

    _createView() {
        const view = super._createView();

        view.gap = Gap.all("10px");
        view.overflow = View.Overflow.hidden;

        const friendView = this._createFriendView();
        this._friendView = friendView;
        view.addView(friendView);

        return view;
    }

    _createFriendView() {
        const sectionView = new BGTeamCreationSectionView();
        sectionView.title = "Freund hinzufügen";
        sectionView.hint = "hinzufügen";
        sectionView.placeholder = "E-Mail";
        sectionView.textInputType = TextField.TextInputType.email;
        sectionView.addEventListener(BGTeamCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onFriendSubmit.bind(this));

        return sectionView;
    }

    _onFriendSubmit(event) {
        const mail = event.data.name;
        this._onConfigurationFinished(mail);
    }
}