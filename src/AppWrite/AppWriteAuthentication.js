import AppWriteClient from "./AppWriteClient.js";
import { Account } from "appwrite";
import Observable from "../utils/Observable.js";

/**
 * This class is used to manage authentication for users, including session storage, logging-in, logging-out and signing up using appwrite 
 */
export default class AppWriteAuthentication extends Observable {

    /**
     * a constant to label de-authentication events
     */
    static get APPWRITEAUTHENTICATION_AUTHENTICATED_NOTIFICATION_TYPE() {
        return "authenticated";
    }

    /**
     * a constant to label authentication events
     */
    static get APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE() {
        return "deauthenticated";
    }

    static _sharedInstance;

    /**
     * this static instance is used to access authentication management through a shared instance. Custom instances can be created if necessary.
     */
    static get sharedInstance() {
        if (AppWriteAuthentication._sharedInstance === undefined) { AppWriteAuthentication._sharedInstance = new AppWriteAuthentication(); }
        return AppWriteAuthentication._sharedInstance;
    }

    /**
     * getter to expose the appwrite account
     */
    get account() {
        return this._account;
    }

    constructor() {
        super();

        this._createAccount();
    }

    /**
     * this method is used to load relevant user data from the appwrite backend during setup
     */
    async synchronize() {
        const account = this.account;

        this._user = await account.get();
        this._session = await account.getSession("current");
    }

    /**
     * a getter to expose the appwirte user object
     */
    get user() {
        return this._user;
    }

    /**
     * a getter to expose the appwirte session object
     */
    get session() {
        return this._session;
    }

    /**
     * a boolean getter to indicate determine if a user has been logged in using the current instance
     */
    get isAuthenticated() {
        return this.user !== undefined && this.session !== undefined;
    }

    /**
     * used to setup and access the appwrite api
     */
    _createAccount() {
        const client = AppWriteClient.sharedInstance.client;
        this._account = new Account(client);
    }

    /**
     * this method is used to sign up new users
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     * @returns 
     */
    async register(email, password, name) {
        const user = await this.account.create("unique()", email, password, name);
        await this.login(email, password);

        return user;
    }

    /**
     * this method is used to log-in existing users
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    async login(email, password) {
        await this.logout(false);
        const account = this.account;

        this._session = await account.createEmailSession(email, password);
        this._user = await account.get();

        this._didAuthenticate();

        return this._user;
    }

    /**
     * this method is used to log-out users, the notify tag should be used for silent logouts on cleanup processes such as before logging in new users.
     * @param {boolean} notify a boolean indicating wether observers should be notified of the logout
     */
    async logout(notify = true) {
        const session = this.session;

        if (session !== undefined) { await this.account.deleteSession(session.$id); }

        this._user = undefined;
        this._session = undefined;

        if (notify === true) { this._didDeauthenticate(); }
    }

    /**
     * a helper method to notify observes of de-authentication events
     */
    _didAuthenticate() {
        const event = new Event(AppWriteAuthentication.APPWRITEAUTHENTICATION_AUTHENTICATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }

    /**
     * a helper method to notify observes of authentication events
     */
    _didDeauthenticate() {
        const event = new Event(AppWriteAuthentication.APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE, this);
        this.notifyAll(event);
    }
}