"use strict";

import {  Query } from "appwrite";
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

export default class BGTeamChallengesListViewController extends BGSearchableListViewController {

    static get SCORE_CHANGE_NOTIFICATION_TYPE() {
        return "scoreChanged";
    }

    static get CHALLENGE_CHANGE_NOTIFICATION_TYPE() {
        return "challengeChanged";
    }

    constructor(containerId, listMode = BGChallengesListViewController.ListMode.default) {
        super(BGChallengeListViewItemView, BGSectionedListViewTextHeaderView, listMode); //Todo die classes noch in statische getter umwandeln, falls gewünscht. Ändern sich ja nie

        this._containerId = containerId;
    }

    get containerId() {
        return this._containerId;
    }

    _createItemCreationController() {
        const controller = new BGChallengeCreationController();

        return controller;
    }

    _onItemConfigurationFinished(event) {
        super._onItemConfigurationFinished(event);

        const challenge = event.data;
        challenge.author = AppWriteAuthentication.sharedInstance.user.$id;
        challenge.origin = this.containerId;

        this._createChallenge(challenge).then(() => { console.log("success") },
            error => { throw error });
    }

    async _createChallenge(challenge) {
        await this.challengesManager.create(challenge);
        await this.updateSections();
    }

    setup() {
        this._assignmentsManager = this._createAssignmentsManger();
        this._challengesManager = this._createChallengesManager();
        this._previewManager = this._createPreviewManager();

        this.updateSections();
    }

    get assignmentsManager() {
        return this._assignmentsManager;
    }

    get challengesManager() {
        return this._challengesManager;
    }

    get previewManager() {
        return this._previewManager;
    }

    _createAssignmentsManger() {
        const assignmentsManager = new AppWriteDocumentManager(AppWriteConfig
            .DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID);

        return assignmentsManager;
    }

    _createChallengesManager() {
        const challengesManager = new AppWriteDocumentManager(AppWriteConfig
            .DATABASE_SHARED_COLLECTION_CHALLENGES_ID);

        return challengesManager;
    }

    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    async updateSections(filter) {
        this.startLoading();

        const containerId = this.containerId;
        const query = (filter === undefined || filter.length < 1) ? [] : [Query.search("title", filter)];

        const assignmentsDocuments = await this.assignmentsManager.loadResources([Query.equal("assignee", containerId)]);
        const challengesDocuments = await this.challengesManager.loadResources(query);

        const assignedSection = new BGSectionedListViewTitledSectionData(containerId, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, [], "Aktiv");
        const availableSection = new BGSectionedListViewTitledSectionData(undefined, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, [], "Verfügbar");

        challengesDocuments.forEach(challengesDocument => {
            const assignmentsDocument = assignmentsDocuments.find(assignmentsDocument => assignmentsDocument.challenge === challengesDocument.$id);
            if (assignmentsDocument === undefined) availableSection.addItem(this._itemFromObject(challengesDocument));
            else assignedSection.addItem(this._itemFromObject(challengesDocument, assignmentsDocument.$createdAt));
        });

        this.sections = [assignedSection, availableSection].filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    _itemFromObject(object, timestamp) {
        return new BGSectionedListViewChallengeData(object.$id,
            object.$createdAt, object.$updatedAt, object.title,
            object.description, object.duration, object.score,
            object.origin, object.author, timestamp);
    }

    _onItemViewCreated(event) {
        const itemView = event.data;
        //const index = this.items.length;
        //console.log(index);
        //itemView.backgroundColor = (index % 2 === 0) ? new Color(245, 245, 245) : Color.white;
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

    _onScoreDidChange() {
        const event = new Event(BGTeamChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onChallengeDidChange() {
        const event = new Event(BGTeamChallengesListViewController.CHALLENGE_CHANGE_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _onChallengeViewAccepted(event) {
        const challengeView = event.data;
        const challengeId = challengeView.data.id;

        this._assignChallenge(challengeId, this.containerId).then(() => console.log(
            "success"), error => { throw error });
    }

    async _assignChallenge(challengeId, assigneeId) {
        await this.assignmentsManager.create({ challenge: challengeId, assignee: assigneeId });
        await this.updateSections();

        this._onChallengeDidChange();
    }

    _onChallengeViewFinished(event) {
        const challengeView = event.data;
        const challenge = challengeView.data;
        const assigneeId = challenge.section.id;

        this._dismissChallenge(challenge, assigneeId).then(() => console.log(
            "success"), error => { throw error });
    }

    async _dismissChallenge(challenge, assigneeId, multiplier = 1.0) {
        const assignmentsManager = this.assignmentsManager;
        const assignmentDocuments = await assignmentsManager.loadResources([Query.equal("challenge", challenge.id), Query.equal("assignee", assigneeId)]);
        if (assignmentDocuments.length > 0) await assignmentsManager.delete(assignmentDocuments[0]);

        await this.previewManager.updateScore(assigneeId, challenge.score * multiplier);
        await this.updateSections();

        this._onScoreDidChange();
        this._onChallengeDidChange();
    }

    _onChallengeViewCancelled(event) {
        const challengeView = event.data;

        const challenge = challengeView.data;
        const assigneeId = challenge.section.id;

        this._dismissChallenge(challenge, assigneeId, -1.0).then(() => console
            .log("success"), error => { throw error });
    }

    async _deleteChallenge(challenge) {
        await this.assignmentsManager.deleteAllIfPresent({}, [Query.equal("challenge", challenge.id)]);

        await this.challengesManager.deleteAllIfPresent({ $id: challenge.id });
        await this.updateSections();

        this._onChallengeDidChange();
    }

    _onChallengeViewDeleted(event) {
        const challengeView = event.data;

        const challenge = challengeView.data;
        this._deleteChallenge(challenge).then(() => console.log("success"), error => { throw error });
    }

    _onSearchTextChangeEnd() {
        const searchText = this.searchText;

        let title = searchText;
        if (searchText.length < 1) title = undefined;

        this.updateSections(title);
    }

    _onSearchStart() {
        this.searchBar.focus();
    }

    _onSearchEnd() {
        this.searchBar.clear();
        this.updateSections();
    }



    /*
        async updateSections(title) {
            this.startLoading();
            const containerId = this.containerId;
    
            const client = AppWriteClient.sharedInstance.client;
            const databases = new Databases(client, AppWriteConfig.DATABASE_SHARED_ID);
    
            const unassignedSection = new BGSectionedListViewTitledSectionData("unassigned", 0, Number.MIN_SAFE_INTEGER, [], "Verfügbar");
            const sections = [new BGSectionedListViewTitledSectionData(containerId, 0, Number.MAX_SAFE_INTEGER, [], "Aktiv"), unassignedSection];
    
            const assignmentsResult = await databases.listDocuments(AppWriteConfig.DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID, [Query.equal("assignee", containerId)]); // Todo checken ob des basd oder statt id einfach reference verwenden
            const filters = (title === undefined || title.length < 1) ? [] : [Query.search("title", title)]
            const challengesResult = await databases.listDocuments(AppWriteConfig.DATABASE_SHARED_COLLECTION_CHALLENGES_ID, filters); // Todo auch description durchsuchen
            challengesResult.documents.map(document => {
                const assignment = assignmentsResult.documents.find(assignment => assignment.challenge === document.$id);
                if (assignment !== undefined) {
                    const section = sections.find(section => section.id === assignment.assignee);
                    if (section === undefined) return;
                    section.addItem(new BGSectionedListViewChallengeData(document.$id, document.$createdAt, document.$updatedAt, document.title, document.description, document.duration, document.score, document.origin, document.author, assignment.$createdAt));
                } else {
                    unassignedSection.addItem(new BGSectionedListViewChallengeData(document.$id, document.$createdAt, document.$updatedAt, document.title, document.description, document.duration, document.score, document.origin, document.author));
                }
            });
    
            this.sections = sections.filter(section => section.isEmpty === false).sort((sectionA, sectionB) => sectionA.updatedAt < sectionB.updatedAt);
    
            this.stopLoading();
        }
        */
}