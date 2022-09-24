"use strict";

import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGListViewLeaderboardData from "../Data/Models/BGContactListViewLeaderboardData.js";
import BGContactListViewLeaderboardView from "../UI/Views/BGContactListViewLeaderboardView.js";
import BGSectionedListViewTextHeaderView from "../UI/Views/BGSectionedListViewTextHeaderView.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Color } from "../UI/libs/WrappedUI.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";

export default class BGLeaderboardController extends BGRemoteSectionedListViewController {

    get iconColors() {
        return [Color.gold, Color.lightGrey, Color.brown];
    }

    constructor() {
        super(BGContactListViewLeaderboardView, BGSectionedListViewTextHeaderView);
    }

    _createPreviewDocumentManager() {
        const previewDocumentManager = new BGPreviewDocumentManager();

        return previewDocumentManager;
    }

    get previewDocumentManager() {
        return this._previewDocumentManager;
    }

    setup() {
        this._previewDocumentManager = this._createPreviewDocumentManager();
        this.updateSections();
    }

    async updateSections(filter) {
        this.startLoading();

        const previewDocuments = await this.previewDocumentManager.loadResources(filter, ["score"], ["DESC"]);
        const rankedSection = new BGSectionedListViewTitledSectionData("ranked", 0, 0, previewDocuments.slice(0, 3).map(document => new BGListViewLeaderboardData(document.$id, document.$createdAt, document.$updatedAt, document.name, document.score, document.rank)), "Top 3");
        const sections = [rankedSection];

        const personalDocument = previewDocuments.find(document => document.$id === AppWriteAuthentication.sharedInstance.user.$id);
        if (personalDocument !== undefined) sections.push(new BGSectionedListViewTitledSectionData("personal", personalDocument.$createdAt, personalDocument.$updatedAt, [new BGListViewLeaderboardData(personalDocument.$id, personalDocument.$createdAt, personalDocument.$updatedAt, personalDocument.name, personalDocument.score, personalDocument.rank)], "Platzierung"));

        this.sections = sections.filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    _onItemViewCreated(event) {
        const itemView = event.data;
        const item = itemView.data;
        const section = item.section;

        const index = section.items.indexOf(item);
        itemView.backgroundColor = (index % 2 === 0) ? new Color(245, 245, 245) : Color.transparent;

        const iconColors = this.iconColors;
        itemView.contactLabel.backgroundColor = (index < iconColors.length && section.id !== "personal") ? iconColors[index] : Color.darkGreen;
    }
}