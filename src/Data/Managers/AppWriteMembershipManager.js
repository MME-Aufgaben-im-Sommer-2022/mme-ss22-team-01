"use strict";

import { Teams } from "appwrite";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";

export default class AppWriteMembershipManager extends AppWriteResourceManager {

    constructor(teamId) {
        super();

        this._teamId = teamId;
    }

    get teamId() {
        return this._teamId;
    }

    _configure() {
        this._api = new Teams(AppWriteClient.sharedInstance.client);
    }

    get api() {
        return this._api;
    }

    async loadResources(filter) {
        const result = await this.api.getMemberships(this.teamId, filter);

        return result.memberships;
    }

    async _createMembership(mail) {
        return await this.api.createMembership(this.teamId, mail, [], `https://${AppWriteConfig.APPLICATION_URL}`);
    }

    createMembership(mail) {
        return this._createMembership(mail).then(this._didCreate.bind(this), error => { throw error });
    }

    async _delete(resource) {
        return await this.api.deleteMembership(resource.teamId, resource.membershipId);
    }

    delete(resource) {
        this._delete(resource).then(this._didDelete.bind(this), error => { throw error });
    }
}