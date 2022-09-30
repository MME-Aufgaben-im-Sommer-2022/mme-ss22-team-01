import BGItemCreationController from "./BGItemCreationController.js";
import BGChallengeCreationSectionView from "../UI/Views/BGChallengeCreationSectionView.js";
import { Gap, View } from "../UI/libs/WrappedUI.js";

/**
 * this class is used to present the user with an controller to create new challenges and report new items back to its presenting controller if applicable
 */
export default class BGChallengeCreationController extends BGItemCreationController {

    /**
     * getters to access ui elements
     */
    get cancelButton() {
        return this._cancelButton;
    }

    get challengeView() {
        return this._challengeView;
    }

    /*
    * below are two functions to create views an manage the controllers view hierarchy. 
     */
    _createView() {
        const view = super._createView(), challengeView = this._createChallengeView();
        view.gap = Gap.all("10px");
        view.overflow = View.Overflow.hidden;

        this._challengeView = challengeView;
        view.addView(challengeView);

        return view;
    }

    _createChallengeView() {
        const challengeView = new BGChallengeCreationSectionView();
        challengeView.title = "Challenge erstellen";
        challengeView.hint = "erstellen";
        challengeView.placeholder = "Titel";
        challengeView.addEventListener(BGChallengeCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onChallengeSubmit.bind(this));

        return challengeView;
    }

    /**
     * this method is used to notify observers if a new item has been created and the user decided to submit
     * @param {Event} event an event to represent a label and challenge data
     */
    _onChallengeSubmit(event) {
        const challengeView = event.data, data = { duration: challengeView.duration, score: challengeView.score, title: challengeView.name, description: challengeView.description };

        this._onConfigurationFinished(data);
    }
}