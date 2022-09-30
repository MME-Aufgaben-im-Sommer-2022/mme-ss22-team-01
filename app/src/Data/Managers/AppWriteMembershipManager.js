import { Teams } from "appwrite";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";

/**
 * this class encapsulates all api calls needed to manage team memberships
 */
export default class AppWriteMembershipManager extends AppWriteResourceManager {

    constructor(teamId) {
        super();

        this._teamId = teamId;
    }

    get teamId() {
        return this._teamId;
    }

    get api() {
        return this._api;
    }

    /**
     * this method is overridden to establish an new api connection
     */
    _configure() {
        this._api = new Teams(AppWriteClient.sharedInstance.client);
    }

    /**
     * this method is used to retrieve an array of memberships
     * @param {string} filter 
     * @returns 
     */
    async loadResources(filter) {
        const result = await this.api.getMemberships(this.teamId, filter);

        return result.memberships;
    }

    /**
     * this method adds a new member to a team 
     * @param {string} mail 
     * @returns 
     */
    async createMembership(mail) {
        return await this.api.createMembership(this.teamId, mail, ["admin"], `https://${AppWriteConfig.APPLICATION_URL}`);
    }

    /**
     * this method is used to delete a team member
     * @param {object} resource 
     * @returns 
     */
    async delete(resource) {
        return await this.api.deleteMembership(resource.teamId, resource.membershipId);
    }
}