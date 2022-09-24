"use strict";

import { Query } from "appwrite";
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication";
import AppWriteConfig from "../../AppWrite/AppWriteConfig";
import AppWriteDocumentManager from "./AppWriteDocumentManager.js";
import AppWriteTeamManager from "./AppWriteTeamManager";

export default class BGChallengeDocumentManager extends AppWriteDocumentManager {
    constructor() {
        super(AppWriteConfig.DATABASE_SHARED_COLLECTION_CHALLENGES_ID);
    }

    _configure() {
        super._configure();

        this._teamManager = this._createTeamManager();
        this._assignmentsManager = this._createAssignmentsManger();
    }

    get teamManager() {
        return this._teamManager;
    }

    get assignmentsManager() {
        return this._assignmentsManager;
    }

    _createTeamManager() {
        const teamManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.short);

        return teamManager;
    }

    _createAssignmentsManger() {
        const assignmentsManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID);

        return assignmentsManager;
    }

    async loadResources(filter) {
        const teams = await this.teamManager.loadResources();

        const user = AppWriteAuthentication.sharedInstance.user;
        teams.push({ $id: user.$id, $createdAt: Number.MAX_SAFE_INTEGER, $updatedAt: Number.MAX_SAFE_INTEGER, name: user.name });

        const assignmentsDocuments = await this.assignmentsManager.loadResources([Query.equal("assignee", teams.map(team => team.$id))]);
        const challengesDocuments = await super.loadResources(filter);

        return challengesDocuments.flatMap(document => {
            const assignments = assignmentsDocuments.filter(assignment => assignment.challenge === document.$id);
            if (assignments.length < 1) return document;
            return assignments.map(assignment => {
                const team = teams.find(team => team.$id === assignment.assignee);
                if (team !== undefined) document.name = team.name;
                document.assignee = assignment.assignee;
                document.timestamp = assignment.$createdAt;
                return document;
            });
        });
    }
}

/*
{
    const teamManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.short);
    const teams = await teamManager.loadResources();

    const userId = AppWriteAuthentication.sharedInstance.user.$id;

    const sections = teams.map(team => new BGSectionedListViewSectionData(team.$id, team.$createdAt, team.$updatedAt, [], team.name));
    sections.push(new BGSectionedListViewSectionData(userId, 0, Number.MAX_SAFE_INTEGER, [], "Aktiv"));
    const unassignedSection = new BGSectionedListViewSectionData("unassigned", 0, Number.MIN_SAFE_INTEGER, [], "Verfügbar");
    sections.push(unassignedSection);

    const assignmentsManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID);
    const assignmentsDocuments = await assignmentsManager.loadResources([Query.equal("assignee", sections.map(section => section.id))]);

    const query = (filter === undefined || filter.length < 1) ? [] : [Query.search("title", filter)];
    const challengesManager = new AppWriteDocumentManager(AppWriteConfig.DATABASE_SHARED_COLLECTION_CHALLENGES_ID);
    const challengesDocuments = await challengesManager.loadResources(query);

    challengesDocuments.forEach(document => {
        const assignment = assignmentsDocuments.find(assignment => assignment.challenge === document.$id);
        if (assignment !== undefined) {
            const section = sections.find(section => section.id === assignment.assignee);
            if (section !== undefined) section.addItem(new BGSectionedListViewChallengeData(document.$id, document.$createdAt, document.$updatedAt, document.title, document.description, document.duration, document.score, document.origin, document.author, assignment.$createdAt));
        } else unassignedSection.addItem(new BGSectionedListViewChallengeData(document.$id, document.$createdAt, document.$updatedAt, document.title, document.description, document.duration, document.score, document.origin, document.author));
    });

    this.sections = sections.filter(section => section.isEmpty === false).sort((sectionA, sectionB) => sectionA.updatedAt < sectionB.updatedAt);
}
*/