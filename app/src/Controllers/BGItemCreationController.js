import { Color, Controller, Padding } from "../UI/libs/WrappedUI.js";
import { Event } from "../utils/Observable.js";

/**
 * this controller is the base controller for the creation of new items.
 */
export default class BGItemCreationController extends Controller {

    /**
     * a constant to label an event to signify that a new item has been created
     */
    static get ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE() {
        return "finish";
    }

    /**
     * this method is called to notify observers if an item has been created and to supply them with its data 
     * @param {object} data an object to pass through to observers
     */
    _onConfigurationFinished(data) {
        const event = new Event(BGItemCreationController.ITEM_CONFIGURATION_FINISHED_NOTIFICATION_TYPE, data);
        this.notifyAll(event);
    }

    /**
     * this method is overridden to setup the main view of the controller
     * @returns the main view of the controller
     */
    _createView() {
        const view = super._createView();
        view.backgroundColor = Color.white;
        view.padding = Padding.all("10px");

        return view;
    }
}