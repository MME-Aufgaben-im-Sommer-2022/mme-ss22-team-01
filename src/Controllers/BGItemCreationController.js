"use strict";

import { Color, Controller, Padding } from "../UI/libs/WrappedUI.js";
import { Event } from "../utils/Observable.js";

export default class BGItemCreationController extends Controller {
    
    constructor(containerId) { // todo containerid kann raus
        super();

        this._containerId = containerId;
    }

    get containerId() {
        return this._containerId;
    }

    static get ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE() {
        return "finish";
    } //TODO remove classnames from other classes

    _onConfigurationFinished(data) {
        const event = new Event(BGItemCreationController.ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE, data);
        this.notifyAll(event);
    }

    _createView() {
        const view = super._createView();
        view.backgroundColor = Color.white;
        view.padding = Padding.all("10px");

        return view;
    }
}