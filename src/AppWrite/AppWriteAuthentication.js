"use strict";

import AppWriteClient from "./AppWriteClient.js";
import { Account } from "appwrite";
import Observable from "../utils/Observable.js";

export default class AppWriteAuthentication extends Observable { // Todo email verification, password reset

    static get APPWRITEAUTHENTICATION_AUTHENTICATED_NOTIFICATION_TYPE() {
        return "authenticated";
    }

    static get APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE() {
        return "deauthenticated";
    }

    static _sharedInstance;

    static get sharedInstance() {
        if (AppWriteAuthentication._sharedInstance === undefined) AppWriteAuthentication._sharedInstance = new AppWriteAuthentication();
        return AppWriteAuthentication._sharedInstance;
    }

    get account() {
        return this._account;
    }

    constructor() {
        super();
        
        this._createAccount();
    }

    async synchronize() { // Todo checken ob man sich session sparen kann
        const account = this.account;
        
        this._user = await account.get();
        this._session = await account.getSession("current");
    }

    get user() {
        return this._user;
    }

    get session() {
        return this._session;
    }

    get isAuthenticated() {
        return this.user !== undefined && this.session !== undefined; // Todo checken ob man sich session sparen kann
    }

    _createAccount() {
        const client = AppWriteClient.sharedInstance.client;
        this._account = new Account(client);
    }

    async register(email, password, name) { // Todo direkt statisch machen, keine sharedinstance
        const user = await this.account.create("unique()", email, password, name);
        await this.login(email, password);

        return user;
    }

    async login(email, password) {
        await this.logout(false); // Todo evaluieren, ob account.get mit deleSession (logout) resettet wird, wahrscheinlich nicht!
        const account = this.account;

        this._session = await account.createEmailSession(email, password);
        const user = await account.get();
        this._user = user;

        this._didAuthenticate();

        return user;
    }

    async logout(notify = true) {
        const session = this.session; //Todo passed by reference also auch kürzer schreibbar

        if (session !== undefined) await this.account.deleteSession(session.$id);

        this._user = undefined;
        this._session = undefined;

        if (notify === true) this._didDeauthenticate();
    }

    _didAuthenticate() {
        const event = new Event(AppWriteAuthentication.APPWRITEAUTHENTICATION_AUTHENTICATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    _didDeauthenticate() {
        const event = new Event(AppWriteAuthentication.APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }
}