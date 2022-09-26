"use strict";

import { Teams } from "appwrite";
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication.js";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";

export default class AppWriteTeamManager extends AppWriteResourceManager {

    static get NamingScheme() {
        return Object.freeze({
            full: "full",
            short: "short"
        });
    }

    static get TeamType() {
        return Object.freeze({
            chat: "chat",
            group: "group"
        });
    }

    constructor(namingScheme = AppWriteTeamManager.NamingScheme.short) {
        super();

        this._namingScheme = namingScheme;
    }

    get namingScheme() {
        return this._namingScheme;
    }

    _configure() {
        const client = AppWriteClient.sharedInstance.client;
        this._api = new Teams(client);
    }

    get api() {
        return this._api;
    }

    async loadResources(filter) {
        const teamsResult = await this.api.list(filter);
        const teams = [];

        for (const result of teamsResult.teams) {
            const team = await this._prepareTeam(result);
            if (team !== undefined) teams.push(team);
        }
        return teams;
    }

    async _prepareTeam(team, join = " + ") {
        const namingScheme = this._namingScheme;

        if (team.name !== AppWriteTeamManager.TeamType.chat) {
            team.type = AppWriteTeamManager.TeamType.group;
            return team;
        }

        team.type = AppWriteTeamManager.TeamType.chat;
        const membershipsResult = await this.api.getMemberships(team.$id);
        const memberships = membershipsResult.memberships;
        if (memberships.length < 1) return undefined;

        switch (namingScheme) {
            case AppWriteTeamManager.NamingScheme.short:
                const userId = AppWriteAuthentication.sharedInstance.user.$id;
                if (userId === undefined) throw new Error("Cannot derive team names for unauthenticated users");

                const membership = memberships.find(membership => membership.userId !== userId);
                if (membership === undefined) return undefined;

                team.name = membership.userName;
                break;
            case AppWriteTeamManager.NamingScheme.full:
                team.name = memberships.map(membership => membership.userName).join(join);
                break;
            default:
                throw new Error(`Unsupported naming scheme: ${namingScheme}`);
        }

        return team;
    }

    observe(filter) {
        const client = AppWriteClient.sharedInstance.client;
        const observer = client.subscribe("memberships", (response) => {
            /*
            const team = response.payload;
            const prefix = "teams.*.memberships.*";
            if (response.events.includes(`${prefix}.create`)) this._didCreate(team); // todo checken ob das für alle user funktionier
            if (response.events.includes(`${prefix}.update`)) this._didUpdate(team);
            if (response.events.includes(`${prefix}.delete`)) this._didDelete(team);
            const team = 
*/
            console.log(response);

        });

        this.addObserver(observer);
    }

    async _crateGroup(name) {
        const team = await this.api.create(AppWriteConfig.UNIQUE_ID, name, ["owner"]);

        return team;
    }

    async _createChat(mail) {
        const api = this.api;

        const team = await api.create(AppWriteConfig.UNIQUE_ID, AppWriteTeamManager.TeamType.chat);
        await api.createMembership(team.$id, mail, ["owner"], `https://${AppWriteConfig.APPLICATION_URL}`); // todo https vielleicht in config aufnehemn! testen

        return team;
    }

    createGroup(name) {
        return this._crateGroup(name).then(this._didCreate.bind(this), error => { throw error }); // todo observers
    }

    createChat(mail) {
        return this._createChat(mail).then(this._didCreate.bind(this), error => { throw error });
    }

    async _delete(teamId) {
        return await this.api.delete(teamId);
    }

    delete(teamId) {
        return this._delete(teamId).then(this._didDelete.bind(this), error => { throw error });
    }
}