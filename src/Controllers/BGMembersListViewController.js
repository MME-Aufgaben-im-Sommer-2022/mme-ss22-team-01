"use strict";

import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGContactListViewTeamItemView from "../UI/Views/BGContactListViewTeamItemView.js";
import BGListViewTeamItemData from "../Data/Models/BGListViewTeamItemData.js";
import BGMemberCreationController from "./BGMemberCreationController.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Color } from "../UI/libs/WrappedUI.js";
import BGSearchableListViewController from "./BGSearchableListViewController.js";
import AppWriteMembershipManager from "../Data/Managers/AppWriteMembershipManager.js";
import BGListViewItemView from "../UI/Views/BGListViewItemView.js";

export default class BGMembersListViewController extends BGSearchableListViewController {

    get teamId() {
        return this._teamId;
    }

    constructor(teamId, listMode = BGMembersListViewController.ListMode.default) {
        super(BGContactListViewTeamItemView, BGListViewItemView, listMode); //Todo die classes noch in statische getter umwandeln, falls gewünscht. Ändern sich ja nie

        this._teamId = teamId;
    }

    get membershipManager() {
        return this._membershipManager;
    }

    setup() {
        this._membershipManager = this._createMembershipManager(); // Todo: in function oder in superklasse gleich rein!
        this.updateSections();
    }

    _createMembershipManager() {
        const membershipManager = new AppWriteMembershipManager(this.teamId);

        return membershipManager;
    }

    _createItemCreationController() {
        const controller = new BGMemberCreationController();

        return controller;
    }

    async updateSections(filter) {
        this.startLoading();

        const memberships = await this.membershipManager.loadResources(filter);

        const userId = AppWriteAuthentication.sharedInstance.user.$id;
        this.sections = (memberships.length > 0) ? [new BGSectionedListViewTitledSectionData("members", 0, 0, memberships.filter(membership => membership.userId !== userId).map(membership => new BGListViewTeamItemData(membership.userId, membership.$createdAt, membership.$updatedAt, membership.userName, 0, "")))] : [];

        this.stopLoading();
    }

    _onItemViewCreated(event) {
        const itemView = event.data;

        itemView.backgroundColor = new Color(245, 245, 245);
        itemView.addEventListener(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this._onItemViewDeleteClicked.bind(this));
    }

    _onItemViewClicked(event) {
        const itemView = event.data;
        const item = itemView.data;
    }

    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let filter = searchText;
        if (searchText.length < 1) filter = undefined;

        console.log("ended");

        (async () => {
            await this.updateSections(filter);
        })()
    }

    _onSearchStart() {
        this.searchBar.focus();
    }

    _onSearchEnd() {
        this.searchBar.clear();
        this.updateSections();
    }

    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);

        const mail = event.data;
        this._createMembership(mail).then(() => console.log("success"), error => { throw error })
    }

    async _createMembership(mail) {
        await this.membershipManager.createMembership(mail);
        await this.updateSections();
    }

    _onItemViewDeleteClicked(event) {
        const itemView = event.data;

        this.deleteMembership(itemView.data.id).then(() => { console.log("success"); }, error => { throw error });
    }

    async deleteMembership(membershipId) {
        this.startLoading();
        await this.membershipManager.delete({ membershipId: membershipId, teamId: this.teamId });
        await this.updateSections();
    }
}