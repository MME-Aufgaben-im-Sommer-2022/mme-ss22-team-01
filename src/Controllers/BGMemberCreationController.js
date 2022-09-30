import BGItemCreationController from "./BGItemCreationController.js";
import BGTeamCreationSectionView from "../UI/Views/BGTeamCreationSectionView.js";
import { Gap, TextField, View } from "../UI/libs/WrappedUI.js";

/**
 * this controller is used to create new members an pass them to observers
 */
export default class BGMemberCreationController extends BGItemCreationController {

    /**
     * below getters are to expose access to ui elements
     */
    get cancelButton() {
        return this._cancelButton;
    }

    get friendView() {
        return this._friendView;
    }

    /**
     * the two methods below are used to manage the controllers view hierarchy and create views
     */
    _createView() {
        const view = super._createView(), friendView = this._createFriendView();

        view.gap = Gap.all("10px");
        view.overflow = View.Overflow.hidden;

        this._friendView = friendView;
        view.addView(friendView);

        return view;
    }

    _createFriendView() {
        const sectionView = new BGTeamCreationSectionView();
        sectionView.title = "Freund hinzufügen";
        sectionView.hint = "hinzufügen";
        sectionView.placeholder = "E-Mail";
        sectionView.textInputType = TextField.TextInputType.email;
        sectionView.addEventListener(BGTeamCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onFriendSubmit.bind(this));

        return sectionView;
    }

    /**
     * this method is used to notify observers that a new member has been created and pass through the mail via an event
     * @param {Event} event 
     */
    _onFriendSubmit(event) {
        const mail = event.data.name;
        this._onConfigurationFinished(mail);
    }
}