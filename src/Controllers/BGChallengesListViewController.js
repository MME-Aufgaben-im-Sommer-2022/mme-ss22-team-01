import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGSectionedListViewTitledSectionData from "../Data/Models/BGSectionedListViewTitledSectionData.js";
import { Query } from "appwrite";
import AppWriteTeamManager from "../Data/Managers/AppWriteTeamManager.js";
import BGTeamChallengesListViewController from "./BGTeamChallengesListViewController.js";

/**
 * this class is used to display a sectioned collection of all challenges available and assigned to any team (including personal challenges)
 */
export default class BGChallengesListViewController extends BGTeamChallengesListViewController {

    constructor(listMode = BGChallengesListViewController.ListMode.default) {
        super(undefined, listMode);
    }

    /**
     * this getter is overridden from its superclass to mark challenges assigned to the user itself as active
     */
    get containerId() {
        return AppWriteAuthentication.sharedInstance.user.$id;
    }

    get teamManager() {
        return this._teamManager;
    }

    setup() {
        this._teamManager = this._createTeamManager();
        super.setup();
    }

    /**
     * this method is used to create and setup a new teamManager to fetch team data
     * @returns an instance of AppWriteTeamManager
     */
    _createTeamManager() {
        const teamManager = new AppWriteTeamManager(AppWriteTeamManager
            .NamingScheme.short);

        return teamManager;
    }

    /**
     * this method is used to fetch new data and update sections accordingly
     * @param {string} filter a search query to filter titles
     */
    async updateSections(filter) {
        this.startLoading();

        const query = (filter === undefined || filter.length < 1) ? [] : [Query.search("title", filter)], user = AppWriteAuthentication.sharedInstance.user, teams = (await this.teamManager.loadResources()).concat([{ $id: user.$id, $createdAt: Number.MAX_SAFE_INTEGER, $updatedAt: Number.MAX_SAFE_INTEGER, name: user.name }]), assignmentsDocuments = await this.assignmentsManager.loadResources([Query.equal("assignee", teams.map(team => team.$id))]), challengesDocuments = await this.challengesManager.loadResources(query), availableSection = new BGSectionedListViewTitledSectionData(undefined, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, [], "Verfügbar");

        this.sections = challengesDocuments.reduce((sections, challengeDocument) => {
            const matchingAssignmentsDocuments = assignmentsDocuments.filter(assignmentDocument => assignmentDocument.challenge === challengeDocument.$id);
            if (matchingAssignmentsDocuments.length < 1) { availableSection.addItem(this._itemFromObject(challengeDocument)); }
            else {
                matchingAssignmentsDocuments.forEach(assignmentsDocument => {
                    const assignee = assignmentsDocument.assignee;
                    let section = sections.find(section => section.id === assignee);
                    if (section === undefined) {
                        const team = teams.find(team => team.$id === assignee);
                        section = new BGSectionedListViewTitledSectionData(assignee, assignmentsDocument.$createdAt, assignmentsDocument.$updatedAt, [], team.name);
                        sections.push(section);
                    }
                    section.addItem(this._itemFromObject(challengeDocument, assignmentsDocument.$createdAt));
                });
            }
            return sections;
        }, [new BGSectionedListViewTitledSectionData(user.$id, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, [], "Aktiv"), availableSection]).filter(section => section.isEmpty === false).sort((sectionA, sectionB) => sectionA.updatedAt < sectionB.updatedAt);

        this.stopLoading();
    }
}