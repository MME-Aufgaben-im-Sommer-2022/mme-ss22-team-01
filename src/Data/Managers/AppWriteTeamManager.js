import { Teams } from "appwrite";
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication.js";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";

/**
 * this class encapsulates all api calls needed to manage teams
 */
export default class AppWriteTeamManager extends AppWriteResourceManager {

    /**
     * this constant is used to define naming schemes for team names
     */
    static get NamingScheme() {
        return Object.freeze({
            full: "full",
            short: "short",
        });
    }

    /**
     * this constant is used to discriminate between chats and groups
     */
    static get TeamType() {
        return Object.freeze({
            chat: "chat",
            group: "group",
        });
    }

    constructor(namingScheme = AppWriteTeamManager.NamingScheme.short) {
        super();

        this._namingScheme = namingScheme;
    }

    get namingScheme() {
        return this._namingScheme;
    }

    get api() {
        return this._api;
    }

    /**
     * this method is overridden to create a new api connection
     */
    _configure() {
        const client = AppWriteClient.sharedInstance.client;
        this._api = new Teams(client);
    }

    /**
     * this method is used to fetch all teams that match a given filter
     * @param {filter} filter team names
     * @returns 
     */
    async loadResources(filter) {
        const teamsResult = await this.api.list(filter), teams = [];

        for (const result of teamsResult.teams) {
            const team = await this._prepareTeam(result);
            if (team !== undefined) { teams.push(team); }
        }
        return teams;
    }

    /**
     * this method is used to compute the name of a team
     * @param {Team} team an instance of Team
     * @param {string} join a string to be used as a delimiter for the resulting team name
     * @returns 
     */
    async _prepareTeam(team, join = " + ") {
        if (team.name !== AppWriteTeamManager.TeamType.chat) {
            team.type = AppWriteTeamManager.TeamType.group;
            return team;
        }

        team.type = AppWriteTeamManager.TeamType.chat;
        const namingScheme = this._namingScheme, membershipsResult = await this.api.getMemberships(team.$id), memberships = membershipsResult.memberships;
        if (memberships.length < 1) { return undefined; }

        switch (namingScheme) {
            case AppWriteTeamManager.NamingScheme.short: {
                const membership = memberships.find(membership => membership.userId !== AppWriteAuthentication.sharedInstance.user.$id);
                if (membership === undefined) { return undefined; }

                team.name = membership.userName;
                break;
            }
            case AppWriteTeamManager.NamingScheme.full:
                team.name = memberships.map(membership => membership.userName).join(join);
                break;
            default:
                throw new Error(`Unsupported naming scheme: ${namingScheme}`);
        }

        return team;
    }

    /**
     * this method is used to create a new team in the backend
     * @param {string} name a string to indicate the name of a group
     * @returns an instance of Team
     */
    async createGroup(name) {
        const team = await this.api.create(AppWriteConfig.UNIQUE_ID, name, ["owner"]);

        return team;
    }

    /**
     * this method is used to create a new team to store a chat in the backend
     * @param {string} mail the mail of another user
     * @returns an instance of Team
     */
    async createChat(mail) {
        const api = this.api, team = await api.create(AppWriteConfig.UNIQUE_ID, AppWriteTeamManager.TeamType.chat);

        await api.createMembership(team.$id, mail, ["admin"], `https://${AppWriteConfig.APPLICATION_URL}`); // todo https vielleicht in config aufnehemn! testen

        return team;
    }

    /**
     * this method is used to delete a team in the backend
     * @param {string} teamId a string to identify the team
     */
    async delete(teamId) {
        return await this.api.delete(teamId);
    }
}