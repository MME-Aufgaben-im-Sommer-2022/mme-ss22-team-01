"use strict";

import { Color, Controller, Padding } from "../UI/libs/WrappedUI.js";
import { Event } from "../utils/Observable.js";

export default class BGItemCreationController extends Controller {

    static get ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE() {
        return "finish";
    }

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