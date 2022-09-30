/*eslint no-magic-numbers: "off"*/
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

/**
 * this controller is displays a list of teams, divided in a section of friends and another section groups
 */
export default class BGTeamsListViewController extends BGSearchableListViewController {
    /**
     * event labels
     */
    static get GROUP_SELECTED_NOTIFICATION_TYPE() {
        return "groupSelected";
    }

    static get CHAT_SELECTED_NOTIFICATION_TYPE() {
        return "chatSelected";
    }

    constructor(listMode = BGTeamsListViewController.ListMode.default) {
        super(BGContactListViewTeamItemView, BGSectionedListViewTextHeaderView, listMode);
    }

    /**
     * the getters below provide access to api-wrapper classes
     */
    get teamManager() {
        return this._teamManager;
    }

    get previewManager() {
        return this._previewManager;
    }

    get messagesManager() {
        return this._messagesManager;
    }

    /**
     * this method is used to create the creation controller to add chats or groups
     * @returns a instance of a subclass of BGItemCreationController
     */
    _createItemCreationController() {
        const controller = new BGTeamCreationController();

        return controller;
    }

    /**
     * this method is used to notify observers upon item selection
     * @param {Event} event 
     */
    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);
        const data = event.data;

        switch (data.type) {
            case AppWriteTeamManager.TeamType.chat:
                this.createChat(data.mail);
                break;
            case AppWriteTeamManager.TeamType.group:
                this.createGroup(data.name);
                break;
            default:
                throw new Error(`Unsupported type: ${event.type}`);
        }
    }

    /**
     * this method tells the api to create a new group and updates the list
     * @param {string} name 
     */
    async createGroup(name) {
        await this.teamManager.createGroup(name);
        await this.updateSections();
    }

    /**
    * this method tells the api to create a new group and updates the list
    * @param {string} name 
    */
    async createChat(mail) {
        await this.teamManager.createChat(mail);
        await this.updateSections();
    }

    /**
     * this method is called to establish api connections
     */
    setup() {
        this._teamManager = this._createTeamManager();
        this._previewManager = this._createPreviewManager();
        this._messagesManager = this._createMessagesManager();

        this.updateSections();
    }

    /**
     * this method is used to create a new backend team manager
     * @returns an instance of AppWriteTeamManager
     */
    _createTeamManager() {
        const teamManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.short);

        return teamManager;
    }

    /**
     * this method is used to create a new backend preview manager
     * @returns an instance of BGPreviewDocumentManager
     */
    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    /**
     * this method is used to create a new database manager for the messages collection
     * @returns an instance of AppWriteDocumentManager
     */
    _createMessagesManager() {
        const messagesManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_MESSAGES_ID);

        return messagesManager;
    }

    /**
     * this method is used to update the sections with team data retrieved from the backend
     * @param {[]<string>} filter 
     */
    async updateSections(filter) {
        this.startLoading();

        const teams = await this.teamManager.loadResources(filter), previewDocuments = await this.previewManager.loadResources([Query.equal("$id", teams.map(team => team.$id))]), messagesDocuments = await this.messagesManager.loadResources([Query.equal("$id", previewDocuments.map(previewDocument => previewDocument.message).filter(message => message !== null))]), groups = new BGSectionedListViewTitledSectionData("groups", 0, 0, [], "Gruppen"), chats = new BGSectionedListViewTitledSectionData("friends", 0, 0, [], "Freunde");

        teams.forEach(team => {
            const previewDocument = previewDocuments.find(previewDocument => previewDocument.$id === team.$id);
            let detail = "", item;
            if (previewDocument !== undefined) {
                let score = previewDocument.score;
                if (score === undefined) { score = 0; }
                detail = `${score} 🍀`;
                const message = messagesDocuments.find(messagesDocument => messagesDocument.$id === previewDocument.message);
                if (message !== undefined) { detail = message.text; }
            }
            item = new BGListViewTeamItemData(team.$id, team.$createdAt, team.$updatedAt, team.name, 0, detail);
            if (team.type === AppWriteTeamManager.TeamType.chat) { chats.addItem(item); }
            else if (team.type === AppWriteTeamManager.TeamType.group) { groups.addItem(item); }
        });

        this.sections = [groups, chats].filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    /**
     * this method is used to handle the creation of item views
     * @param {Event} event 
     */
    _onItemViewCreated(event) {
        const itemView = event.data;

        itemView.addEventListener(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this._onItemViewDeleteClicked.bind(this));
        itemView.backgroundColor = new Color(245, 245, 245);
    }

    /**
     * this method is used to initiate deletion of a team if clicked
     * @param {Event} event 
     */
    _onItemViewDeleteClicked(event) {
        const itemView = event.data;

        this._deleteTeam(itemView.data.id);
    }

    /**
     * this method is used to execute a deletion api request an update the list afterwards
     * @param {string} teamId 
     */
    async _deleteTeam(teamId) {
        this.startLoading();
        await this.teamManager.delete(teamId);
        await this.updateSections();
    }

    /**
     * this method is used to handle item view clicks and notify observers 
     * @param {Event} event 
     */
    _onItemViewClicked(event) {
        this.notifyAll(event);

        const teamView = event.data, sectionId = teamView.data.section.id;

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

    /**
     * this method gets called if the timer resolves indicating a text entry has ended. It updates the list for the search term 
     */
    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let filter = searchText;
        if (searchText.length < 1) { filter = undefined; }

        this.updateSections(filter);
    }
}