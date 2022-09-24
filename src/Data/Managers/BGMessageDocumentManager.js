"use strict";

import AppWriteConfig from "../../AppWrite/AppWriteConfig";
import AppWriteDocumentManager from "./AppWriteDocumentManager";
import AppWriteMembershipManager from "./AppWriteMembershipManager";

export default class BGMessageDocumentManager extends AppWriteDocumentManager {
    constructor(teamId) {
        super(AppWriteConfig.DATABASE_SHARED_COLLECTION_MESSAGES_ID);

        this._teamId = teamId;
        this._membershipsManager = this._createMembershipsManager();
    }

    get teamId() {
        return this._teamId;
    }

    get membershipsManager() {
        return this._membershipsManager;
    }

    _createMembershipsManager() {
        const membershipsManager = new AppWriteMembershipManager(this.teamId);

        return membershipsManager;
    }

    async loadResources(filter) {
        const memberships = await this.membershipsManager.loadResources();

        const messageDocuments = await super.loadResources(filter);

        return messageDocuments.map(document => {
            const membership = memberships.find(membership => membership.userId === document.author);
            if (membership !== undefined) document.name = membership.userName;

            return document;
        });
    }
}