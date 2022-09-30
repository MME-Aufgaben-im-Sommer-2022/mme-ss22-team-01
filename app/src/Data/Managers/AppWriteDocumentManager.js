import { Databases, Query } from "appwrite";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";

/**
 * this class encapsulates all api calls needed to manage entries for a specific database
 */
export default class AppWriteDocumentManager extends AppWriteResourceManager {
    constructor(collectionId) {
        super();

        this._collectionId = collectionId;
    }

    get collectionId() {
        return this._collectionId;
    }

    /**
     * this method establishes a new database api connection
     */
    _configure() {
        const client = AppWriteClient.sharedInstance.client;
        this._api = new Databases(client, AppWriteConfig.DATABASE_SHARED_ID);
    }

    get api() {
        return this._api;
    }

    /**
     * this method is used to load documents from the database, considering filters, orders and a maximum limit of results
     * @param {[]<string>} filter 
     * @param {[]<string>} orderAttributes 
     * @param {[]<string>} orderTypes 
     * @param {number} limit 
     * @returns 
     */
    async loadResources(filter, orderAttributes, orderTypes, limit) {
        const result = await this.api.listDocuments(this.collectionId, filter, limit, undefined, undefined, undefined, orderAttributes, orderTypes);

        return result.documents;
    }

    /**
     * this method is used to delete an entry from the database
     * @param {object} resource 
     */
    async delete(resource) {
        return await this.api.deleteDocument(this.collectionId, resource.$id);
    }

    /**
     * this method is used to store a document in the database
     * @param {object} resource 
     * @returns 
     */
    async create(resource) {
        let id = resource.$id;
        if (id === undefined) { id = AppWriteConfig.UNIQUE_ID; }
        delete resource.$id;
        return await this.api.createDocument(this.collectionId, id, resource);
    }

    /**
     * this method is used to update properties of a database property
     * @param {object} resource 
     */
    async update(resource) {
        return await this.api.updateDocument(this._collectionId, resource.$id, resource);
    }

    /**
     * this method is used to delete all elements that either match the id of a given resource or match a given filter from the database
     * @param {object} resource 
     * @param {[]<string>} filter 
     */
    async deleteAllIfPresent(resource, filter = [Query.equal("$id", resource.$id)]) {
        const documents = await this.loadResources(filter);
        return await Promise.all(documents.map(this.delete.bind(this)));
    }
}