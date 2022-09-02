"use strict";

import { Teams } from "appwrite";
import AppWriteClient from "../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../AppWrite/AppWriteConfig.js";
import BGMemberCreationController from "./BGMemberCreationController.js";
import BGTeamCreationSectionView from "../UI/Views/BGTeamCreationSectionView.js";

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

        (async () => {
            const client = AppWriteClient.sharedInstance.client;
            const teams = new Teams(client);
    
            const result = await teams.create("unique()", name);
            console.log(result);
            this._onConfigurationFinished(this);
        })();
    }

    _onFriendSubmit(event) {
        const mail = event.data.name;

        (async () => {
            const client = AppWriteClient.sharedInstance.client;
            const teams = new Teams(client);
    
            const team = await teams.create("unique()", "chat");
            const membership = await teams.createMembership(team.$id, mail, [], `https://${AppWriteConfig.APPLICATION_URL}`);

            console.log(membership);
            this._onConfigurationFinished(this);
        })();
    }
}