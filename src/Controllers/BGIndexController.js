"use strict";

import BGAuthenticationController from "./BGAuthenticationController.js";
import AppWriteAuthentication from "../AppWrite/AppWriteAuthentication.js";
import BGTeamsListViewController from "./BGTeamsListViewController.js";
import BGChallengesListViewController from "./BGChallengesListViewController.js";
import BGMembersListViewController from "./BGMembersListViewController.js";
import BGTeamChallengesListViewController from "./BGTeamChallengesListViewController.js";
import BGLeaderboardController from "./BGLeaderboardController.js";
import { Border, Borders, BoxShadow, Button, Color, Corners, Gap, Grid, GridInset, Icon, Label, Navigation, Padding, RootController, RoundedCorner, StackView, View } from "../UI/libs/WrappedUI.js";
import { Query } from "appwrite";
import BGMessagesListViewController from "./BGMessagesListViewController.js";
import image from "../../public/muneeb-syed-x9NfeD3FpsE-unsplash.jpg";
import BGPreviewDocumentManager from "../Data/Managers/BGPreviewDocumentManager.js";

export default class BGIndexController extends RootController {
    static get ControllerPosition() {
        return Object.freeze({
            topLeft: new GridInset("1", "1", "2", "2"),
            bottomLeft: new GridInset("2", "1", "2", "3"),
            right: new GridInset("1", "2", "3", "3")
        });
    }

    static get Mode() {
        return Object.freeze({
            start: "start",
            detail: "detail"
        });
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;

        // this._applyMode();
    }

    _createIconButton() {
        const button = new Button();

        button.minWidth = "50px";
        button.minHeight = "50px";
        button.textAlignment = Label.TextAlignment.center;
        button.color = Color.white;
        button.fontFamily = Label.FontFamily.sansSerif;
        button.padding = Padding.all("15px");
        button.backgroundColor = Color.darkGreen;
        button.borders = Borders.all(Border.none);
        button.corners = Corners.all(new RoundedCorner("25px"));
        button.fontWeight = Label.FontWeight.bold;
        button.fontSize = "17px";
        button.addEventListener(Button.BUTTON_CLICK_NOTIFICATION_TYPE, this._onIconButtonPressed.bind(this));
        button.addEventListener(Button.BUTTON_MOUSE_OVER_NOTIFICATION_TYPE, this._onIconButtonMouseOver.bind(this));
        button.addEventListener(Button.BUTTON_MOUSE_OUT_NOTIFICATION_TYPE, this._onIconButtonMouseOut.bind(this));

        return button;
    }

    _onIconButtonMouseOver(event) {
        if (this.mode !== BGIndexController.Mode.start) return;

        this._addLogoutIcon();
    }

    _onIconButtonMouseOut(event) {
        if (this.mode !== BGIndexController.Mode.start) return;

        this._setIcon();
    }

    _onIconButtonPressed(event) {
        const mode = this.mode;

        switch (mode) {
            case BGIndexController.Mode.start:
                (async () => {
                    await AppWriteAuthentication.sharedInstance.logout();
                })()
                break;
            case BGIndexController.Mode.detail:
                break;
            default:
                throw new Error(`Unsupported mode: ${mode}`);
        }

        this.removeStackedControllers();
        this._setupControllers();
    }

    _addCloseIcon() {
        const closeIcon = this._createCloseIcon();
        this.iconButton.innerHTML = closeIcon.htmlText;
    }

    _addLogoutIcon() {
        const logoutIcon = this._createLogoutIcon();
        this.iconButton.innerHTML = logoutIcon.htmlText;
    }

    _createIcon() {
        const icon = new Icon();
        icon.color = Color.white;
        icon.fontSize = "17px";
        icon.pointerEvents = Icon.PointerEvents.none;
        icon.classList.add("fa-solid");

        return icon;
    }

    _createCloseIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-close");

        return icon;
    }

    _createLogoutIcon() {
        const icon = this._createIcon();
        icon.classList.add("fa-sign-out");

        return icon;
    }

    get previewManager() {
        return this._previewManager;
    }

    /*
    _applyMode() {
        const mode = this.mode;

        switch (mode) {
            case BGIndexController.Mode.start:
                this.controllers.forEach(parentController => parentController.controllers.forEach(controller => controller.removeFromParentController())); //todo removeStacked
                break;
            case BGIndexController.Mode.group:
                const memberListViewController = new BGMembersListViewController
            case BGIndexController.Mode.chat:
                break;
            default:
                throw new Error(`Unsupported mode: ${mode}`);
        }
    }*/

    embedController(controller, position) {
        if (controller.parentController !== undefined) throw new Error("Cannot add controller to more than one parent controller");

        const embeddedControllers = this.embeddedControllers;
        const parentController = embeddedControllers.find(controller => position.equals(controller.view.gridInset) === true);

        embeddedControllers.push(controller);

        if (parentController !== undefined) {
            controller.view.position = View.Position.absolute;

            controller.view.top = "0px";
            controller.view.bottom = "0px";
            controller.view.left = "0px";
            controller.view.right = "0px";

            parentController.addController(controller);
        }
        else {
            controller.parentController = this;
            controller.view.gridInset = position;

            this.contentView.addView(controller.view);
        }
    }

    removeStackedControllers() {
        this.mode = BGIndexController.Mode.start;
        this.embeddedControllers.forEach(controller => controller.removeControllers()); // todo da wieder slice oder splice
        //this._embeddedControllers = []; // todo des noch elegantter des noch checken
        this._setIcon();
        this._updateScore();

        this.title = "BeGreen";
    }

    _createTitleView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px"));

        const titleLabel = this._createTitleLabel();
        this._titleLabel = titleLabel;
        stackView.addView(titleLabel);

        return stackView;
    }

    get embeddedControllers() {
        return this._embeddedControllers;
    }

    constructor(mode = BGIndexController.Mode.start) {
        super();
        this.mode = mode;
    }

    async _updateScore(containerId = AppWriteAuthentication.sharedInstance.user.$id) {
        let score = 0;

        const previewDocuments = await this.previewManager.loadResources([Query.equal("$id", containerId)]);
        if (previewDocuments.length > 0) score = `${previewDocuments[0].score} 🍀`;

        this.score = score;
    }

    _onGroupSelected(event) {
        const teamView = event.data;
        const team = teamView.data;

        this.presentGroup(team);
    }

    _onChatSelected(event) {
        const teamView = event.data;
        const team = teamView.data;

        this.presentChat(team);
    }

    presentChat(team) {
        //if (this.embeddedControllers.length > 3) return;
        this.removeStackedControllers(); // todo braucht man nicht
        this.mode = BGIndexController.Mode.detail;

        const id = team.id;
        this.title = team.name;
        this._addCloseIcon();
        this._updateScore(id);

        //this.mode = BGIndexController.Mode.group;

        const challengesListViewController = this._createTeamChallengesListViewController(id);
        challengesListViewController.addEventListener(BGTeamChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this._onScoreChanged.bind(this));
        challengesListViewController.setup();
        this.embedController(challengesListViewController, BGIndexController.ControllerPosition.right);

        const messagesListViewController = this._createMessagesListViewController(id);
        messagesListViewController.setup();
        this.embedController(messagesListViewController, BGIndexController.ControllerPosition.bottomLeft);
    }

    presentGroup(team) {
        //if (this.embeddedControllers.length > 3) return;
        this.presentChat(team);

        const membersListViewController = this._createMembersListViewController(team.id);
        membersListViewController.setup();
        this.embedController(membersListViewController, BGIndexController.ControllerPosition.topLeft);
    }

    _createMembersListViewController(id) {
        const membersListViewController = new BGMembersListViewController(id);
        membersListViewController.view.minWidth = "350px";
        membersListViewController.title = "Mitglieder";

        return membersListViewController;
    }

    _createMessagesListViewController(id) {
        const messagesListViewController = new BGMessagesListViewController(id);
        messagesListViewController.title = "Chat";
        messagesListViewController.view.minWidth = "350px";

        return messagesListViewController;
    }

    _createTeamChallengesListViewController(id) {
        const challengesListViewController = new BGTeamChallengesListViewController(id);
        challengesListViewController.title = "Challenges";

        return challengesListViewController;
    }

    _onStateChange() { // todo kann vermutlich raus
        //todo den controllern hier sagen, dass sie updaten können, wenn authenticated
    }

    _setIcon() {
        const user = AppWriteAuthentication.sharedInstance.user;
        if (user === undefined) return;
        this.iconButton.text = user.name[0].toUpperCase();
    }

    _createControllers() {
        const teamsListViewController = this._createTeamsListViewController();
        this.embedController(teamsListViewController, BGIndexController.ControllerPosition.topLeft);

        const challengesViewController = this._createChallengesListViewController();
        challengesViewController.addEventListener(BGChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this._onScoreChanged.bind(this));
        this.embedController(challengesViewController, BGIndexController.ControllerPosition.right);

        const leaderboardViewController = this._createLeaderboardViewController();
        this.embedController(leaderboardViewController, BGIndexController.ControllerPosition.bottomLeft);
    }

    _onScoreChanged(event) {
        const controller = event.data;
        const containerId = controller.containerId;

        this._updateScore(containerId);
        this._updateLeaderboardIfPossible();
    }

    _updateLeaderboardIfPossible() {
        const leaderboardController = this.embeddedControllers.find(embeddedController => embeddedController instanceof BGLeaderboardController);
        if (leaderboardController !== undefined) leaderboardController.updateSections();
    }

    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    _createTeamsListViewController() {
        const teamsListViewController = new BGTeamsListViewController();
        teamsListViewController.title = "Kontakte";
        teamsListViewController.addEventListener(BGTeamsListViewController.GROUP_SELECTED_NOTIFICATION_TYPE, this._onGroupSelected.bind(this));
        teamsListViewController.addEventListener(BGTeamsListViewController.CHAT_SELECTED_NOTIFICATION_TYPE, this._onChatSelected.bind(this));

        teamsListViewController.view.minWidth = "350px";

        return teamsListViewController;
    }

    _createChallengesListViewController() {
        const challengesViewController = new BGChallengesListViewController();
        challengesViewController.title = "Challenges";

        return challengesViewController;
    }

    _createLeaderboardViewController() {
        const leaderboardViewController = new BGLeaderboardController();
        leaderboardViewController.title = "Leaderboard";

        return leaderboardViewController;
    }

    _onViewsCreated() {
        this._embeddedControllers = [];

        this._ensureAuthentication(); // in onViewloaded 

        this._createControllers();
    }

    _onPresentationStateChange() {
        const presentationState = this.presentationState;

        switch (presentationState) {
            case BGIndexController.PresentationState.presented:
                if (AppWriteAuthentication.sharedInstance.isAuthenticated === true) this._setup();
            case BGIndexController.PresentationState.presenting:
                //this.embeddedControllers.forEach(embeddedController => embeddedController.disable());
                break;
            default:
                throw new Error(`Unsupported presentation state: ${presentationState}`);
        }
    }

    _setup() {
        this._setupControllers();
        this._setIcon();
        this._previewManager = this._createPreviewManager();
        this._updateScore();
    }

    _setupControllers() {
        this.embeddedControllers.forEach(embeddedController => embeddedController.setup());
    }

    _ensureAuthentication() {
        const authentication = AppWriteAuthentication.sharedInstance;
        authentication.addEventListener(AppWriteAuthentication.APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE, this._presentAuthenticationController.bind(this));

        AppWriteAuthentication.sharedInstance.synchronize().then(() => {
            if (authentication.isAuthenticated === false) this._presentAuthenticationController();
            else this._setup();
        }, error => {
            console.log(error);
            this._presentAuthenticationController();
        });
    }

    _presentAuthenticationController() {
        const authController = new BGAuthenticationController();
        this.addController(authController);
    }

    get navigationView() {
        return this._navigationView;
    }

    get titleLabel() {
        return this._titleLabel;
    }

    get title() {
        return this.titleLabel.text;
    }

    set title(value) {
        this.titleLabel.text = value;
    }

    get scoreLabel() {
        return this._scoreLabel;
    }

    get score() {
        return parseInt(this.scoreLabel.text);
    }

    set score(value) {
        this.scoreLabel.text = value.toString();
    }

    get iconButton() {
        return this._iconButton;
    }

    get contact() {
        return this.iconButton.text;
    }

    set contact(value) {
        this.iconButton.text = value;
    }

    get contentView() {
        return this._contentView;
    }

    _createNavigationView() {
        const navigation = new Navigation();
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center);

        stackView.backgroundColor = Color.white;
        stackView.height = "75px";
        stackView.padding = Padding.horizontal("15px");
        stackView.borders = Borders.bottom(new Border(Color.darkGrey, "1px"));
        stackView.shadow = new BoxShadow("0px", "5px", new Color(0, 0, 0, 0.25), "5px", "3px");

        const titleView = this._createTitleView();
        stackView.addView(titleView);

        const infoView = this._createInfoView();
        stackView.addView(infoView);
        navigation.addView(stackView);

        return navigation;
    }

    _createContentView() {
        const grid = new Grid();

        grid.columns = "1fr 4fr";
        grid.rows = "1fr 1fr";
        grid.gap = Gap.all("15px");
        grid.padding = Padding.all("15px");
        grid.minHeight = "0";

        return grid;
    }


    _createTitleLabel() {
        const label = new Label();

        label.text = "BeGreen";
        label.color = Color.darkGreen;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.fontWeight = Label.FontWeight.bold;
        label.fontSize = "20px";
        this._titleLabel = label;

        return label;
    }

    _createScoreLabel() {
        const label = new Label();

        label.textAlignment = Label.TextAlignment.center;
        label.color = Color.darkGreen;
        label.fontFamily = Label.FontFamily.sansSerif;
        label.padding = Padding.axes("20px", "10px");
        label.backgroundColor = Color.lightGrey;
        label.corners = Corners.all(new RoundedCorner("10px"));
        label.fontSize = "22px";

        return label;
    }

    _createInfoView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px"));

        const scoreLabel = this._createScoreLabel();
        this._scoreLabel = scoreLabel;
        stackView.addView(scoreLabel);

        const iconButton = this._createIconButton();
        this._iconButton = iconButton;
        stackView.addView(iconButton);

        return stackView;
    }

    _createView() {
        const view = super._createView();
        view.backgroundColor = Color.darkGreen;
        view.backgroundSize = "cover";
        view.backgroundImage = `url(${image})`;

        const navigationView = this._createNavigationView();
        navigationView.zIndex = "1";
        this._navigationView = navigationView;
        view.addView(navigationView);

        const contentView = this._createContentView();
        contentView.grow = "1";

        this._contentView = contentView;
        view.addView(contentView);
    }
}