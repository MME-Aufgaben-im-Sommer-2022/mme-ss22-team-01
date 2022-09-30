/*eslint no-magic-numbers: "off"*/
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGListViewLeaderboardData from "../Data/Models/BGContactListViewLeaderboardData.js";
import BGContactListViewLeaderboardView from "../UI/Views/BGContactListViewLeaderboardView.js";
import BGSectionedListViewTextHeaderView from "../UI/Views/BGSectionedListViewTextHeaderView.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Color } from "../UI/libs/WrappedUI.js";
import BGRemoteSectionedListViewController from "./BGRemoteSectionedListViewController.js";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";

export default class BGLeaderboardController extends BGRemoteSectionedListViewController {

    /**
     * this getter is used to define the highlighting badge colors for the first three ranks
     */
    get iconColors() {
        return [Color.gold, Color.lightGrey, Color.brown];
    }

    /**
     * this getter exposes access to the document manager for loading data
     */
    get previewDocumentManager() {
        return this._previewDocumentManager;
    }

    constructor() {
        super(BGContactListViewLeaderboardView, BGSectionedListViewTextHeaderView);
    }

    /**
     * this method creates an instance of BGPreviewDocumentManager for loading data
     * @returns an instance of BGPreviewDocumentManager
     */
    _createPreviewDocumentManager() {
        const previewDocumentManager = new BGPreviewDocumentManager();

        return previewDocumentManager;
    }

    /**
     * this method is used for general setup and connecting to the backend, it may only be called if a user has been logged in
     */
    setup() {
        this._previewDocumentManager = this._createPreviewDocumentManager();
        this.updateSections();
    }

    /**
     * this method is called to fetch data from appwrite and update the list view sections accordingly
     * @param {*} filter filters to be passed to database managers
     */
    async updateSections(filter) {
        this.startLoading();

        const previewDocuments = await this.previewDocumentManager.loadResources(filter, ["score"], ["DESC"]), rankedSection = new BGSectionedListViewTitledSectionData("ranked", 0, 0, previewDocuments.slice(0, 3).map(document => new BGListViewLeaderboardData(document.$id, document.$createdAt, document.$updatedAt, document.name, document.score, document.rank)), "Top 3"), sections = [rankedSection], personalDocument = previewDocuments.find(document => document.$id === AppWriteAuthentication.sharedInstance.user.$id);
        if (personalDocument !== undefined) { sections.push(new BGSectionedListViewTitledSectionData("personal", personalDocument.$createdAt, personalDocument.$updatedAt, [new BGListViewLeaderboardData(personalDocument.$id, personalDocument.$createdAt, personalDocument.$updatedAt, personalDocument.name, personalDocument.score, personalDocument.rank)], "Platzierung")); }

        this.sections = sections.filter(section => section.isEmpty === false);

        this.stopLoading();
    }

    /**
     * this method is overridden from its superclass and invoked every time an item view is created. Here its used to manipulate the appearance of the item view.
     * @param {Event} event an event to contain the item view
     */
    _onItemViewCreated(event) {
        const itemView = event.data, item = itemView.data, section = item.section, index = section.items.indexOf(item), iconColors = this.iconColors;
        itemView.backgroundColor = (index % 2 === 0) ? new Color(245, 245, 245) : Color.transparent;

        itemView.contactLabel.backgroundColor = (index < iconColors.length && section.id !== "personal") ? iconColors[index] : Color.darkGreen;
    }
}