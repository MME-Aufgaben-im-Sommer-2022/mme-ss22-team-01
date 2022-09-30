import { Query } from "appwrite";
import AppWriteConfig from "../AppWrite/AppWriteConfig.js";
import BGChallengeCreationController from "./BGChallengeCreationController.js";
import BGChallengesListViewController from "./BGChallengesListViewController.js";
import BGSectionedListViewChallengeData from "../Data/Models/BGSectionedListViewChallengeData.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import BGSearchableListViewController from "./BGSearchableListViewController.js";
import BGChallengeListViewItemView from "../UI/Views/BGChallengeListViewItemView.js";
import BGSectionedListViewTextHeaderView from "../UI/Views/BGSectionedListViewTextHeaderView.js";
import AppWriteDocumentManager from "../Data/Managers/AppWriteDocumentManager.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import { Event } from "../utils/Observable.js";

/**
 * this class is used to display a list of all challenges assigned to a specific team and to interact with these items, including additions, assignments and deletions.
 */
export default class BGTeamChallengesListViewController extends BGSearchableListViewController {

    /**
     * event labels
     */
    static get SCORE_CHANGE_NOTIFICATION_TYPE() {
        return "scoreChanged";
    }

    static get CHALLENGE_CHANGE_NOTIFICATION_TYPE() {
        return "challengeChanged";
    }

    /**
     * this getter is used to access the id to which challenges can be assigned
     */
    get containerId() {
        return this._containerId;
    }

    /**
     * the getters/setters below expose access to backend managers
     */
    get assignmentsManager() {
        return this._assignmentsManager;
    }

    get challengesManager() {
        return this._challengesManager;
    }

    get previewManager() {
        return this._previewManager;
    }

    constructor(containerId, listMode = BGChallengesListViewController.ListMode.default) {
        super(BGChallengeListViewItemView, BGSectionedListViewTextHeaderView, listMode);

        this._containerId = containerId;
    }

    /**
     * this method is used to create a new controller for item creation
     * @returns an instance of BGChallengeCreationController
     */
    _createItemCreationController() {
        const controller = new BGChallengeCreationController();

        return controller;
    }

    /**
     * this method is called if a new challenge has been created by the user. The method initiates api requests to persist the challenge
     * @param {Event} event 
     */
    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);

        const challenge = event.data;
        challenge.author = AppWriteAuthentication.sharedInstance.user.$id;
        challenge.origin = this.containerId;

        this._createChallenge(challenge);
    }

    /**
     * this method is used to create a new challenge in the database and update the list afterwards
     * @param {object} challenge 
     */
    async _createChallenge(challenge) {
        await this.challengesManager.create(challenge);
        await this.updateSections();
    }

    /**
     * this method is used to establish api connections
     */
    setup() {
        this._assignmentsManager = this._createAssignmentsManger();
        this._challengesManager = this._createChallengesManager();
        this._previewManager = this._createPreviewManager();

        this.updateSections();
    }

    /**
     * this method is used to create a new database manager for assignment documents
     * @returns an instance of AppWriteDocumentManager
     */
    _createAssignmentsManger() {
        const assignmentsManager = new AppWriteDocumentManager(AppWriteConfig
            .DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID);

        return assignmentsManager;
    }

    /**
     * this method is used to create a new database manager for challenge documents
     * @returns an instance of AppWriteDocumentManager
     */
    _createChallengesManager() {
        const challengesManager = new AppWriteDocumentManager(AppWriteConfig
            .DATABASE_SHARED_COLLECTION_CHALLENGES_ID);

        return challengesManager;
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
     * this method is used to retrieve challenges from the backend and to update the list accordingly
     * @param {[]<string>} filter 
     */
    async updateSections(filter) {
        this.startLoading();

        const containerId = this.containerId, query = (filter === undefined || filter.length < 1) ? [] : [Query.search("title", filter)], assignmentsDocuments = await this.assignmentsManager.loadResources([Query.equal("assignee", containerId)]), challengesDocuments = await this.challengesManager.loadResources(query), assignedSection = new BGSectionedListViewTitledSectionData(containerId, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, [], "Aktiv"), availableSection = new BGSectionedListViewTitledSectionData(undefined, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, [], "Verfügbar");

        challengesDocuments.forEach(challengesDocument => {
            const assignmentsDocument = assignmentsDocuments.find(assignmentsDocument => assignmentsDocument.challenge === challengesDocument.$id);
            if (assignmentsDocument === undefined) { availableSection.addItem(this._itemFromObject(challengesDocument)); }
            else { assignedSection.addItem(this._itemFromObject(challengesDocument, assignmentsDocument.$createdAt)); }
        });

        this.sections = [assignedSection, availableSection].filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    /**
     * this method is used to create instances of BGSectionedListViewChallengeData from a database document
     * @param {object} object 
     * @param {number} timestamp 
     * @returns an instance of BGSectionedListViewChallengeData
     */
    _itemFromObject(object, timestamp) {
        return new BGSectionedListViewChallengeData(object.$id,
            object.$createdAt, object.$updatedAt, object.title,
            object.description, object.duration, object.score,
            object.origin, object.author, timestamp);
    }

    /**
     * this method fires upon itemview creation and is used to attach further listeners to the itemview
     * @param {Event} event 
     */
    _onItemViewCreated(event) {
        const itemView = event.data;

        itemView.addEventListener(BGChallengeListViewItemView
            .CHALLENGE_ACCEPT_NOTIFICATION_TYPE, this._onChallengeViewAccepted
                .bind(this));
        itemView.addEventListener(BGChallengeListViewItemView
            .CHALLENGE_FINISH_NOTIFICATION_TYPE, this._onChallengeViewFinished
                .bind(this));
        itemView.addEventListener(BGChallengeListViewItemView
            .CHALLENGE_CANCEL_NOTIFICATION_TYPE, this._onChallengeViewCancelled
                .bind(this));
        itemView.addEventListener(BGChallengeListViewItemView
            .CHALLENGE_DELETE_NOTIFICATION_TYPE, this._onChallengeViewDeleted
                .bind(this));
    }

    /**
     * this method is called to notify observers of score changes
     */
    _onScoreDidChange() {
        const event = new Event(BGTeamChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is called to notify observers of challenge changes such as deletions, assignments
     */
    _onChallengeDidChange() {
        const event = new Event(BGTeamChallengesListViewController.CHALLENGE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * this method is called if a user presses the assign button on an challenge view.
     * @param {Event} event 
     */
    _onChallengeViewAccepted(event) {
        const challengeView = event.data;

        this._assignChallenge(challengeView.data.id, this.containerId);
    }

    /**
     * this method is used assign a new challenge and updating the list view afterwards
     * @param {string} challengeId the id of the challenge to be assigned
     * @param {string} assigneeId the id of the assignee
     */
    async _assignChallenge(challengeId, assigneeId) {
        await this.assignmentsManager.create({ challenge: challengeId, assignee: assigneeId });
        await this.updateSections();

        this._onChallengeDidChange();
    }

    /**
     * this method is called if a user presses the finish button on an challenge item
     * @param {Event} event 
     */
    _onChallengeViewFinished(event) {
        const challengeView = event.data, challenge = challengeView.data;

        this._dismissChallenge(challenge, challenge.section.id);
    }

    /**
     * this method is used to resolve a assignment from an assignee and to update the score accordingly
     * @param {object} challenge the challenge to be released
     * @param {string} assigneeId the id of the assignee to be released
     * @param {string} multiplier a score multiplier
     */
    async _dismissChallenge(challenge, assigneeId, multiplier = 1.0) {
        const assignmentsManager = this.assignmentsManager, assignmentDocuments = await assignmentsManager.loadResources([Query.equal("challenge", challenge.id), Query.equal("assignee", assigneeId)]);
        if (assignmentDocuments.length > 0) { await assignmentsManager.delete(assignmentDocuments[0]); }

        await this.previewManager.updateScore(assigneeId, challenge.score * multiplier);
        await this.updateSections();

        this._onScoreDidChange();
        this._onChallengeDidChange();
    }

    /**
     * this method is called if users press the cancel challenge button
     * @param {Event} event 
     */
    _onChallengeViewCancelled(event) {
        const challengeView = event.data, challenge = challengeView.data;

        this._dismissChallenge(challenge, challenge.section.id, -1.0);
    }

    /**
     * this method is used to delete a challenge from the backend and update the list afterwards
     * @param {object} challenge a challenge to be deleted
     */
    async _deleteChallenge(challenge) {
        await this.assignmentsManager.deleteAllIfPresent({}, [Query.equal("challenge", challenge.id)]);

        await this.challengesManager.deleteAllIfPresent({ $id: challenge.id });
        await this.updateSections();

        this._onChallengeDidChange();
    }

    /**
     * this method is called if a user presses the delete button in item views
     * @param {Event} event 
     */
    _onChallengeViewDeleted(event) {
        const challengeView = event.data;

        this._deleteChallenge(challengeView.data);
    }

    /**
     * this method gets called if the timer resolves indicating a text entry has ended. It updates the list for the search term 
     */
    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let title = searchText;
        if (searchText.length < 1) { title = undefined; }

        this.updateSections(title);
    }
}