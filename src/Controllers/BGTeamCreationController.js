"use strict";

import { Teams } from "appwrite";
import AppWriteClient from "../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../AppWrite/AppWriteConfig.js";
import BGMemberCreationController from "./BGMemberCreationController.js";
import BGTeamCreationSectionView from "../UI/Views/BGTeamCreationSectionView.js";
import AppWriteTeamManager from "../Data/Managers/AppWriteTeamManager.js";

export default class BGTeamCreationController extends BGMemberCreationController {

    get groupView() {
        return this._groupView;
    }

    _createView() {
        const view = super._createView();

        const groupView = this._createGroupView();
        this._groupView = groupView;
        view.addViewBefore(groupView, this.friendView);

        return view;
    }

    _createGroupView() {
        const sectionView = new BGTeamCreationSectionView(); //todo umbennen
        sectionView.title = "Gruppe erstellen";
        sectionView.hint = "erstellen";
        sectionView.placeholder = "Gruppenname";
        sectionView.addEventListener(BGTeamCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onGroupSubmit.bind(this));

        return sectionView;
    }


    _onGroupSubmit(event) {
        const name = event.data.name;
        const type = AppWriteTeamManager.TeamType.group;

        this._onConfigurationFinished({name: name, type: type});
    }

    _onFriendSubmit(event) {
        const mail = event.data.name;
        const type = AppWriteTeamManager.TeamType.chat;

        this._onConfigurationFinished({mail: mail, type: type});
    }
}