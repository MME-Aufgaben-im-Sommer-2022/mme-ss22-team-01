"use strict";

import AppWriteTeamManager from "../Data/Managers/AppWriteTeamManager.js";
import BGContactListViewTeamItemView from "../UI/Views/BGContactListViewTeamItemView.js";
import BGListViewTeamItemData from "../Data/Models/BGListViewTeamItemData.js";
import BGSectionedListViewTextHeaderView from "../UI/Views/BGSectionedListViewTextHeaderView.js";
import BGTeamCreationController from "./BGTeamCreationController.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Color } from "../UI/libs/WrappedUI.js";
import BGSearchableListViewController from "./BGSearchableListViewController.js";
import { Event } from "../utils/Observable.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";
import AppWriteDocumentManager from "../Data/Managers/AppWriteDocumentManager.js";
import AppWriteConfig from "../AppWrite/AppWriteConfig.js";
import { Query } from "appwrite";

export default class BGTeamsListViewController extends BGSearchableListViewController { // extends BGListViewController+ // BGSearchableListViewController

    static get GROUP_SELECTED_NOTIFICATION_TYPE() {
        return "groupSelected";
    }

    static get CHAT_SELECTED_NOTIFICATION_TYPE() {
        return "chatSelected";
    }

    constructor(listMode = BGTeamsListViewController.ListMode.default) {
        super(BGContactListViewTeamItemView, BGSectionedListViewTextHeaderView, listMode); //Todo die classes noch in statische getter umwandeln, falls gewünscht. Ändern sich ja nie
    }

    get teamManager() {
        return this._teamManager;
    }

    get previewManager() {
        return this._previewManager;
    }

    get messagesManager() {
        return this._messagesManager;
    }

    _createItemCreationController() {
        const controller = new BGTeamCreationController();

        return controller;
    }

    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);
        const data = event.data;

        switch (data.type) {
            case AppWriteTeamManager.TeamType.chat:
                this._createChat(data.mail).then(() => console.log("success"), error => { throw error });
                break;
            case AppWriteTeamManager.TeamType.group:
                this._createGroup(data.name).then(() => console.log("success"), error => { throw error });
                break;
            default:
                throw new Error(`Unsupported type: ${event.type}`);
        }
    }

    async _createGroup(name) {
        await this.teamManager.createGroup(name);
        await this.updateSections();
    }

    async _createChat(mail) {
        await this.teamManager.createChat(mail);
        await this.updateSections();
    }

    setup() {
        this._teamManager = this._createTeamManager();
        this._previewManager = this._createPreviewManager();
        this._messagesManager = this._createMessagesManager();

        this.updateSections();
    }

    _createTeamManager() {
        const teamManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.short);

        return teamManager;
    }

    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    _createMessagesManager() {
        const messagesManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_MESSAGES_ID);

        return messagesManager;
    }

    async updateSections(filter) {
        this.startLoading();

        const teams = await this.teamManager.loadResources(filter);
        const previewDocuments = await this.previewManager.loadResources([Query.equal("$id", teams.map(team => team.$id))]);
        const messagesDocuments = await this.messagesManager.loadResources([Query.equal("$id", previewDocuments.map(previewDocument => previewDocument.message).filter(message => message !== null))]);

        const groups = new BGSectionedListViewTitledSectionData("groups", 0, 0, [], "Gruppen");
        const chats = new BGSectionedListViewTitledSectionData("friends", 0, 0, [], "Freunde");

        teams.forEach(team => {
            const previewDocument = previewDocuments.find(previewDocument => previewDocument.$id === team.$id);
            let detail = "";
            if (previewDocument !== undefined) {
                let score = previewDocument.score;
                if (score === undefined) score = 0;
                detail = `${score} 🍀`;
                const message = messagesDocuments.find(messagesDocument => messagesDocument.$id === previewDocument.message);
                if (message !== undefined) detail = message.text;
            }
            const item = new BGListViewTeamItemData(team.$id, team.$createdAt, team.$updatedAt, team.name, 0, detail);
            if (team.type === AppWriteTeamManager.TeamType.chat) chats.addItem(item);
            else if (team.type === AppWriteTeamManager.TeamType.group) groups.addItem(item);
        });

        this.sections = [groups, chats].filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    _onItemViewCreated(event) {
        const itemView = event.data;

        itemView.addEventListener(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this._onItemViewDeleteClicked.bind(this));
        itemView.backgroundColor = new Color(245, 245, 245);
    }

    _onItemViewDeleteClicked(event) {
        const itemView = event.data;

        this.deleteTeam(itemView.data.id).then(() => { console.log("success"); }, error => { throw error });
    }

    async deleteTeam(teamId) {
        this.startLoading();
        await this.teamManager.delete(teamId);
        await this.updateSections();
    }

    _onItemViewClicked(event) {
        this.notifyAll(event);

        const teamView = event.data;
        const sectionId = teamView.data.section.id;

        switch (sectionId) {
            case "groups":
                this.notifyAll(new Event(BGTeamsListViewController.GROUP_SELECTED_NOTIFICATION_TYPE, teamView));
                break;
            case "friends":
                this.notifyAll(new Event(BGTeamsListViewController.CHAT_SELECTED_NOTIFICATION_TYPE, teamView));
                break;
            default:
                break;
        }
    }

    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let filter = searchText;
        if (searchText.length < 1) filter = undefined;

        this.updateSections(filter);
    }

    _onSearchStart() {
        this.searchBar.focus();
    }

    _onSearchEnd() {
        this.searchBar.clear();
        this.updateSections();
    }
}