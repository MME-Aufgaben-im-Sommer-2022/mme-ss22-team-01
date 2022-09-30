/* eslint-disable no-console */

/**
 * this class is used to resemble a rudimentary logger that can be deactivated.
 */
export default class Logger {

    constructor(name, isEnabled = true) {
        this._name = name;

        this.isEnabled = isEnabled;
    }

    get name() {
        return this._name;
    }

    static _sharedInstance;

    /**
     * this property is used to expose a static instance to be used in the default case. Custom loggers can be created if necessary
     */
    static get sharedInstance() {
        if (Logger._sharedInstance === undefined) {
            const sharedInstance = new Logger("shared");
            Logger._sharedInstance = sharedInstance;
            window.Logger = sharedInstance;
        }

        return Logger._sharedInstance;
    }

    /**
     * a proxy for the console.error method
     * @param {*} args arguments to be logged
     */
    error(args) {
        if (this.isEnabled === false) { return; }
        console.error(args);
    }

    /**
     * a proxy for the console.log method
     * @param {*} args arguments to be logged
     */
    log(args) {
        if (this.isEnabled === false) { return; }
        console.log(args);
    }

    /**
     * a proxy for the console.table method
     * @param {*} args the iterable to be printed
     */
    table(args) {
        if (this.isEnabled === false) { return; }
        console.table(args);
    }
}