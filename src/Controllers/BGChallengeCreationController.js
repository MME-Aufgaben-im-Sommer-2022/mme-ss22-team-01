"use strict";


import BGItemCreationController from "./BGItemCreationController.js";
import BGChallengeCreationSectionView from "../UI/Views/BGChallengeCreationSectionView.js";
import { Gap, View } from "../UI/libs/WrappedUI.js";

export default class BGChallengeCreationController extends BGItemCreationController {

    get cancelButton() {
        return this._cancelButton;
    }

    get challengeView() {
        return this._challengeView;
    }

    _createView() {
        const view = super._createView();

        view.gap = Gap.all("10px");
        view.overflow = View.Overflow.hidden;

        const challengeView = this._createChallengeView();
        this._challengeView = challengeView;
        view.addView(challengeView);

        return view;
    }

    _createChallengeView() {
        const challengeView = new BGChallengeCreationSectionView(); //TODO erstellen; 
        challengeView.title = "Challenge erstellen";
        challengeView.hint = "erstellen";
        challengeView.placeholder = "Titel";
        challengeView.addEventListener(BGChallengeCreationSectionView.ENTRY_COMPLETE_NOTIFICATION_TYPE, this._onChallengeSubmit.bind(this));

        return challengeView;
    }

    _onChallengeSubmit(event) {
        const challengeView = event.data;
        const data = { duration: challengeView.duration, score: challengeView.score, title: challengeView.name, description: challengeView.description };

        this._onConfigurationFinished(data);
    }
}