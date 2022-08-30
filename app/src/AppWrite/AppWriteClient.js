import { Client } from "appwrite";
import AppWriteConfig from "./AppWriteConfig.js";

/**
 * this class poses as a wrapper for the native appwrite client. It ensures one single root client can be used across multiple connections.
 */
export default class AppWriteClient {

    static _sharedInstance;

    /**
     * this singleton shared instance is the default client
     */
    static get sharedInstance() {
        if (AppWriteClient._sharedInstance === undefined) { AppWriteClient._sharedInstance = new AppWriteClient(); }

        return AppWriteClient._sharedInstance;
    }

    /**
     * getter to expose the appwrite-native client
     */
    get client() {
        return this._client;
    }

    constructor() {
        this._createClient();
    }

    /**
     * this method is used to setup the appwrite client
     */
    _createClient() {
        const client = new Client();
        client.setEndpoint(AppWriteConfig.ENDPOINT_URI).setProject(AppWriteConfig.PROJECT_ID);
        this._client = client;
    }
}