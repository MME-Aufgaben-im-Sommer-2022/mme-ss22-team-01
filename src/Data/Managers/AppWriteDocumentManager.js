"use strict";

import { Databases, Query } from "appwrite";
import AppWriteClient from "../../AppWrite/AppWriteClient.js";
import AppWriteConfig from "../../AppWrite/AppWriteConfig.js";
import AppWriteResourceManager from "./AppWriteResourceManager.js";


export default class AppWriteDocumentManager extends AppWriteResourceManager {
    constructor(collectionId) {
        super();

        this._collectionId = collectionId;
    }

    get collectionId() {
        return this._collectionId;
    }

    _configure() {
        const client = AppWriteClient.sharedInstance.client;
        this._api = new Databases(client, AppWriteConfig.DATABASE_SHARED_ID);
    }

    get api() {
        return this._api;
    }

    async loadResources(filter, orderAttributes, orderTypes, limit) {
        const result = await this.api.listDocuments(this.collectionId, filter, limit, undefined, undefined, undefined, orderAttributes, orderTypes);

        return result.documents;
    }

    observe(filter) {
        const client = AppWriteClient.sharedInstance.client;
        //collections.${this.collectionId}.documents.*
        const observer = client.subscribe(`database.${AppWriteConfig.DATABASE_SHARED_ID}.collections.${this.collectionId}.documents.*`, (response) => {
            
            const team = response.payload;
            const prefix = "teams.*.memberships.*";
            if (response.events.includes(`${prefix}.create`)) this._didCreate(team); // todo checken ob das für alle user funktionier
            if (response.events.includes(`${prefix}.update`)) this._didUpdate(team);
            if (response.events.includes(`${prefix}.delete`)) this._didDelete(team);
            //const team = 

            console.log(response);
        
        });

        this.addObserver(observer);
    }

    async _delete(resource) {
        return await this.api.deleteDocument(this.collectionId, resource.$id);
    }

    delete(resource) {
        return this._delete(resource).then(this._didDelete.bind(this), error => { throw error })
    }

    async _create(resource) {
        let id = resource.$id;
        if (id === undefined) id = AppWriteConfig.UNIQUE_ID;
        delete resource.$id;
        return await this.api.createDocument(this.collectionId, id, resource);
    }

    create(resource) {
        return this._create(resource).then(this._didCreate.bind(this), error => { throw error });
    }

    async _update(resource) {
        return await this.api.updateDocument(this._collectionId, resource.$id, resource);
    }

    update(resource) {
        return this._update(resource).then(this._didUpdate.bind(this), error => { throw error })
    }

    async _deleteAllIfPresent(resource, filter = [Query.equal("$id", resource.$id)]) {
        const documents = await this.loadResources(filter);
        return await Promise.all(documents.map(this.delete.bind(this)));
    }

    deleteAllIfPresent(resource) {
        return this._deleteAllIfPresent(resource).then(() => console.log("success"), error => { throw error })
    }
}