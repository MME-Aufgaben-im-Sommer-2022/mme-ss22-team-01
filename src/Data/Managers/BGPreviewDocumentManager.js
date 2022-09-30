import { Query } from "appwrite";
import AppWriteAuthentication from "../../AppWrite/AppWriteAuthentication.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteDocumentManager from "./AppWriteDocumentManager.js";
import AppWriteTeamManager from "./AppWriteTeamManager.js";

/**
 * this class encapsulates all api calls needed to manage preview database documents
 */
export default class BGPreviewDocumentManager extends AppWriteDocumentManager {
    constructor() {
        super(AppWriteConfig.DATABASE_SHARED_COLLECTION_PREVIEW_ID);
    }

    /**
     * this getter provides aliases for names of teams that have not been added as friends
     */
    static get aliases() {
        return ["Anonymer Hase", "Anonymer Hund", "Anonyme Katze", "Anonymer Krebs", "Anonymer Vogel", "Anonymer Apfel"];
    }

    get teamsManager() {
        return this._teamsManager;
    }

    /**
     * this method is used to initially set up the api connections
     */
    _configure() {
        super._configure();

        this._teamsManager = this._createTeamsManager();
    }

    /**
     * this method is used to create an instance of AppWriteTeamManager
     * @returns instance of AppWriteTeamManager
     */
    _createTeamsManager() {
        const teamsManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.full);

        return teamsManager;
    }

    /**
     * this method has been overridden to include team data on items
     * @param {[]<string>} filter 
     * @param {[]<string>} orderAttributes 
     * @param {[]<string>} orderTypes 
     * @param {number} limit 
     * @returns 
     */
    async loadResources(filter, orderAttributes, orderTypes, limit) {
        const teams = await this.teamsManager.loadResources(), previewDocuments = await super.loadResources(filter, orderAttributes, orderTypes, limit);

        teams.push(AppWriteAuthentication.sharedInstance.user);

        previewDocuments.forEach((document, index) => {
            const id = document.$id, team = teams.find(team => team.$id === id);
            document.rank = index + 1;
            document.name = (team === undefined) ? BGPreviewDocumentManager._deriveAliasFromId(id) : team.name;
        });

        return previewDocuments;
    }

    /**
     * this method is used to map an alias for a team id
     * @param {string} id 
     * @returns a string
     */
    static _deriveAliasFromId(id) {
        const aliases = BGPreviewDocumentManager.aliases, index = id.charCodeAt(id.length - 1) % aliases.length;

        return aliases[index];
    }

    /**
     * this method is used to update a users score in the preview database
     * @param {string} assigneeId 
     * @param {string} score 
     * @returns 
     */
    async updateScore(assigneeId, score) {
        const previewDocuments = await this.loadResources([Query.equal("$id", assigneeId)]);
        if (previewDocuments.length > 0) { return await this.update({ $id: assigneeId, score: Math.max(previewDocuments[0].score + score, 0) }); }
        return await this.create({ $id: assigneeId, score: Math.max(score, 0) });
    }
}