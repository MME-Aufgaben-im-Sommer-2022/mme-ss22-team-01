import Observable, { Event } from "../../utils/Observable.js";

/**
 * this generic class encapsulates all api calls needed to access one type of resource. It must be subclassed
 */
export default class AppWriteResourceManager extends Observable {

    /**
     * event label to notify observers
     */
    static get RESOURCES_DID_LOAD() {
        return "load";
    }

    constructor() {
        super();

        this._configure();
    }

    /**
     * this is a base method to set up api connections once
     */
    _configure() {
        // do nothing.
    }

    /**
     * this method must be overridden to fetch resources from the backend
     * @returns an array of items stored in the database 
     */
    async loadResources() {
        return [];
    }

    /**
     * this method is called to notify observers that data has been loaded successfully from the backend
     * @param {[]<object>} resources 
     */
    _didLoadResources(resources) {
        const event = new Event(AppWriteResourceManager.RESOURCES_DID_LOAD, resources);
        this.notifyAll(event);
    }

    /**
     * below are base methods to manipulate data stored in the backend
     */
    update() {
        // do nothing.
    }

    delete() {
        // do nothing.
    }

    create() {
        // do nothing.
    }
}