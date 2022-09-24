"use strict";

import { Query } from "appwrite";
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication";
import AppWriteConfig from "../../AppWrite/AppWriteConfig";
import AppWriteDocumentManager from "./AppWriteDocumentManager.js";
import AppWriteTeamManager from "./AppWriteTeamManager.js";

export default class BGPreviewDocumentManager extends AppWriteDocumentManager {
    constructor() {
        super(AppWriteConfig.DATABASE_SHARED_COLLECTION_PREVIEW_ID);
    }

    static get aliases() {
        return ["Anonymer Hase", "Anonymer Hund", "Anonyme Katze", "Anonymer Krebs", "Anonymer Vogel", "Anonymer Apfel"];
    }

    _configure() {
        const client = AppWriteClient.sharedInstance.client;
        this._api = new Databases(client, AppWriteConfig.DATABASE_SHARED_ID);
    }

    _configure() {
        super._configure();

        this._teamsManager = this._createTeamsManager();
    }

    get teamsManager() {
        return this._teamsManager;
    }

    _createTeamsManager() {
        const teamsManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.full);

        return teamsManager;
    }

    async loadResources(filter, orderAttributes, orderTypes, limit) {
        const teams = await this.teamsManager.loadResources();

        const user = AppWriteAuthentication.sharedInstance.user;

        teams.push(user);
        const previewDocuments = await super.loadResources(filter, orderAttributes, orderTypes, limit);

        previewDocuments.forEach((document, index) => {
            const id = document.$id;
            const team = teams.find(team => team.$id === id);
            document.rank = index + 1;
            document.name = (team === undefined) ? BGPreviewDocumentManager._deriveAliasFromId(id) : team.name;
        });

        return previewDocuments;
    }

    static _deriveAliasFromId(id) {
        const aliases = BGPreviewDocumentManager.aliases;
        const index = id.charCodeAt(id.length - 1) % aliases.length;

        return aliases[index];
    }

    async _updateScore(assigneeId, score) {
        const previewDocuments = await this.loadResources([Query.equal("$id", assigneeId)]);
        if (previewDocuments.length > 0) return await this.update({ $id: assigneeId, score: Math.max(previewDocuments[0].score + score, 0) });
        else return await this.create({ $id: assigneeId, score: Math.max(score, 0) });
    }

    updateScore(challengeId, score) {
        return this._updateScore(challengeId, score).then(() => console.log("success"), error => { throw error });
    }
}