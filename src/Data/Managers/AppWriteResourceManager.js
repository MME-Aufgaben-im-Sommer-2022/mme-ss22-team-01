"use strict";

import Observable, { Event } from "../../utils/Observable";

export default class AppWriteResourceManager extends Observable {
    static get RESOURCE_DID_UPDATE() {
        return "update";
    }

    static get RESOURCE_DID_DELETE() {
        return "delete";
    }

    static get RESOURCE_DID_CREATE() {
        return "create";
    }

    static get RESOURCES_DID_LOAD() {
        return "load";
    }

    constructor() {
        super();

        this._observers = [];

        this._configure();
    }

    get observers() {
        return this._observers;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObservers() {
        const observers = this.observers;
        observers.splice(0, observers.length).forEach(unsubscribe => unsubscribe());
    }

    _configure() {

    }

    synchronize(filter) {
        this.loadResources(filter).then(resources => {
            this._didLoadResources(resources);
            this.observe(filter);
        }, error => { throw error });
    }

    invalidate() {
        this.removeObservers();
    }

    async loadResources(filter) {
        return [];
    }

    observe(filter) {

    }

    _didLoadResources(resources) {
        this._emitEvent(AppWriteResourceManager.RESOURCES_DID_LOAD, resources);
        //resources.forEach(this._didCreate.bind(this));
    }

    _didCreate(resource) {
        console.log("created: ");
        console.log(resource);
        this._emitEvent(AppWriteResourceManager.RESOURCE_DID_CREATE, resource);
    }

    _didUpdate(resource) {
        console.log("updated: ");
        console.log(resource);
        this._emitEvent(AppWriteResourceManager.RESOURCE_DID_UPDATE, resource);
    }

    _didDelete(resource) {
        console.log("deleted: ");
        console.log(resource);
        this._emitEvent(AppWriteResourceManager.RESOURCE_DID_DELETE, resource);
    }

    update(resource, newResource) {

    }

    delete(resource) {

    }

    create(resource) {

    }

    _emitEvent(notification, data) {
        const event = new Event(notification, data);
        this.notifyAll(event);
    }
}