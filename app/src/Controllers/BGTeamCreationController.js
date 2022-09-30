import BGMemberCreationController from "./BGMemberCreationController.js";
import BGTeamCreationSectionView from "../UI/Views/BGTeamCreationSectionView.js";
import AppWriteTeamManager from "../Data/Managers/AppWriteTeamManager.js";

/**
 * this class is used to resemble a controller for team creation.
 */
export default class BGTeamCreationController extends BGMemberCreationController {

    get groupView() {
        return this._groupView;
    }

    /**
     * this method is used to notify observers of a new group
     * @param {Event} event 
     */
    _onGroupSubmit(event) {
        const name = event.data.name, type = AppWriteTeamManager.TeamType.group;

        this._onConfigurationFinished({name: name, type: type});
    }

    /**
     * this method is used to notify observers of a new chat
     * @param {Event} event 
     */
    _onFriendSubmit(event) {
        const mail = event.data.name, type = AppWriteTeamManager.TeamType.chat;

        this._onConfigurationFinished({mail: mail, type: type});
    }

    /**
     * the methods below are used to create/manage the view hierarchy
     */
    _createView() {
        const view = super._createView(), groupView = this._createGroupView();

        this._groupView = groupView;
        view.addViewBefore(groupView, this.friendView);

        return view;
    }

    _createGroupView() {
        const sectionView = new BGTeamCreationSectionView();
        sectionView.title = "Gruppe erstellen";
        sectionView.hint = "erstellen";
        sectionView.placeholder = "Gruppenname";
        sectionView.addEventListener(BGTeamCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onGroupSubmit.bind(this));

        return sectionView;
    }
}