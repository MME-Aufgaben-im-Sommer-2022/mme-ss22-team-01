/*eslint no-magic-numbers: "off"*/
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGContactListViewTeamItemView from "../UI/Views/BGContactListViewTeamItemView.js";
import BGListViewTeamItemData from "../Data/Models/BGListViewTeamItemData.js";
import BGMemberCreationController from "./BGMemberCreationController.js";
import BGSectionedListViewSectionData from "../Data/Models/BGSectionedListViewSectionData.js";
import { Color } from "../UI/libs/WrappedUI.js";
import BGSearchableListViewController from "./BGSearchableListViewController.js";
import AppWriteMembershipManager from "../Data/Managers/AppWriteMembershipManager.js";
import BGListViewItemView from "../UI/Views/BGListViewItemView.js";

/**
 * this controller is used to manage members of a team, to delete, add and observe members
 */
export default class BGMembersListViewController extends BGSearchableListViewController {

    constructor(teamId, listMode = BGMembersListViewController.ListMode.default) {
        super(BGContactListViewTeamItemView, BGListViewItemView, listMode);

        this._teamId = teamId;
    }

    /**
     * this getter exposes access to the team id to manage members for
     */
    get teamId() {
        return this._teamId;
    }

    /**
     * this getter exposes access to the internal database manager
     */
    get membershipManager() {
        return this._membershipManager;
    }

    /**
     * this method is used to setup the api connections and load data to display the list
     */
    setup() {
        this._membershipManager = this._createMembershipManager();
        this.updateSections();
    }

    /**
     * this method is used to create a backend membership manager
     * @returns an instance of AppWriteMembershipManager
     */
    _createMembershipManager() {
        const membershipManager = new AppWriteMembershipManager(this.teamId);

        return membershipManager;
    }

    /**
     * this method is used to create a controller to create new members
     * @returns an instance of BGMemberCreationController
     */
    _createItemCreationController() {
        const controller = new BGMemberCreationController();

        return controller;
    }

    /**
     * this method is used to load data from the backend and update the list accordingly
     * @param {[]<string>} filter 
     */
    async updateSections(filter) {
        this.startLoading();

        const memberships = await this.membershipManager.loadResources(filter);

        this.sections = (memberships.length > 0) ? [new BGSectionedListViewSectionData("members", 0, 0, memberships.filter(membership => membership.userId !== AppWriteAuthentication.sharedInstance.user.$id).map(membership => new BGListViewTeamItemData(membership.$id, membership.$createdAt, membership.$updatedAt, membership.userName, 0)))] : [];

        this.stopLoading();
    }

    /**
     * this method is overridden from its superclass to do further setup on new item views. 
     * @param {Event} event 
     */
    _onItemViewCreated(event) {
        const itemView = event.data;

        itemView.backgroundColor = new Color(245, 245, 245);
        itemView.addEventListener(BGContactListViewTeamItemView.ITEM_DELETE_BUTTON_CLICKED_NOTIFICATION_TYPE, this._onItemViewDeleteClicked.bind(this));
    }

    /**
     * this method gets called after a text entry has been made and updates the list accordingly
     */
    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let filter = searchText;
        if (searchText.length < 1) { filter = undefined; }

        this.updateSections(filter);
    }

    /**
     * this method gets called if users press the submit button in the creation controller. A new api request is initiated.
     * @param {Event} event 
     */
    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);

        const mail = event.data;
        this.createMembership(mail);
    }

    /**
     * this method is used to create a new membership and update the list afterwards
     * @param {string} mail 
     */
    async createMembership(mail) {
        await this.membershipManager.createMembership(mail);
        await this.updateSections();
    }

    /**
     * this method is called if users press the delete button on list view items
     * @param {Event} event 
     */
    _onItemViewDeleteClicked(event) {
        const itemView = event.data;

        this.deleteMembership(itemView.data.id);
    }

    /**
     * this method is used to delete a member from a group and to update the list afterwards
     * @param {string} membershipId 
     */
    async deleteMembership(membershipId) {
        this.startLoading();
        await this.membershipManager.delete({ teamId: this.teamId, membershipId: membershipId });
        await this.updateSections();
    }
}