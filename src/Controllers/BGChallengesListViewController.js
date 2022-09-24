"use strict";

import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Query } from "appwrite";
import AppWriteTeamManager from "../Data/Managers/AppWriteTeamManager.js";
import BGTeamChallengesListViewController from "./BGTeamChallengesListViewController.js";

export default class BGChallengesListViewController extends BGTeamChallengesListViewController {

    constructor(listMode = BGChallengesListViewController.ListMode.default) {
        super(undefined, listMode); //Todo die classes noch in statische getter umwandeln, falls gewünscht. Ändern sich ja nie
    }

    get containerId() {
        return AppWriteAuthentication.sharedInstance.user.$id;
    }

    setup() {
        this._teamManager = this._createTeamManager();
        super.setup();
    }

    get teamManager() {
        return this._teamManager;
    }

    _createTeamManager() {
        const teamManager = new AppWriteTeamManager(AppWriteTeamManager
            .NamingScheme.short);

        return teamManager;
    }

    async updateSections(filter) {
        this.startLoading();

        const query = (filter === undefined || filter.length < 1) ? [] : [Query.search("title", filter)];

        const teams = await this.teamManager.loadResources();

        const user = AppWriteAuthentication.sharedInstance.user;
        teams.push({ $id: user.$id, $createdAt: Number.MAX_SAFE_INTEGER, $updatedAt: Number.MAX_SAFE_INTEGER, name: user.name });

        const assignmentsDocuments = await this.assignmentsManager.loadResources([Query.equal("assignee", teams.map(team => team.$id))]);
        const challengesDocuments = await this.challengesManager.loadResources(query);

        const availableSection = new BGSectionedListViewTitledSectionData(undefined, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, [], "Verfügbar");
        this.sections = challengesDocuments.reduce((sections, challengeDocument) => {
            const matchingAssignmentsDocuments = assignmentsDocuments.filter(assignmentDocument => assignmentDocument.challenge === challengeDocument.$id);
            if (matchingAssignmentsDocuments.length < 1) availableSection.addItem(this._itemFromObject(challengeDocument));
            else {
                matchingAssignmentsDocuments.forEach(assignmentsDocument => {
                    const assignee = assignmentsDocument.assignee;
                    let section = sections.find(section => section.id === assignee);
                    if (section === undefined) {
                        const team = teams.find(team => team.$id === assignee);
                        section = new BGSectionedListViewTitledSectionData(assignee, assignmentsDocument.$createdAt, assignmentsDocument.$updatedAt, [], team.name);
                        sections.push(section);
                    }
                    section.addItem(this._itemFromObject(challengeDocument, assignmentsDocument.$createdAt));
                });
            }
            return sections;
        }, [new BGSectionedListViewTitledSectionData(user.$id, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, [], "Aktiv"), availableSection]).filter(section => section.isEmpty === false).sort((sectionA, sectionB) => sectionA.updatedAt < sectionB.updatedAt);

        this.stopLoading();
    }
}