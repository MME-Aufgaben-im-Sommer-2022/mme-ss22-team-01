/*eslint no-magic-numbers: "off"*/
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
import Logger from "../utils/Logger.js";

/**
 * this controller is the entrypoint for begreen. It manages all embedded controllers and presents the user with an authentication controller if necessary.
 */
export default class BGIndexController extends RootController {
    /**
     * this constant represents all available layouts for embedded controllers
     */
    static get ControllerPosition() {
        return Object.freeze({
            topLeft: new GridInset("1", "1", "2", "2"),
            bottomLeft: new GridInset("2", "1", "2", "3"),
            right: new GridInset("1", "2", "3", "3"),
        });
    }

    /**
     * this constant is used to distinguish between the two modes start and detail. Start is the state at the beginning of the lifecycle, the controller may switch to detail if a user decides focus on a group or a chat.
     */
    static get Mode() {
        return Object.freeze({
            start: "start",
            detail: "detail",
        });
    }

    constructor(mode = BGIndexController.Mode.start) {
        super();
        this.mode = mode;
    }

    /**
     * below is a variety of getters and setters to limit access to embedded controllers and ui elements
     */
    get embeddedControllers() {
        return this._embeddedControllers;
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;
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

    get previewManager() {
        return this._previewManager;
    }

    /**
     * this method is a overridden lifecycle function from its superclass to manage embedded controllers once the controllers own views have finished loading.
     */
    _onViewsCreated() {
        this._embeddedControllers = [];

        this._ensureAuthentication();
        this._createControllers();
    }

    /**
     * this method is a overridden lifecycle function to tell embedded controllers if the controller starts presenting and if an user has been logged in
     */
    _onPresentationStateChange() {
        if (this.presentationState === BGIndexController.PresentationState.presented && AppWriteAuthentication.sharedInstance.isAuthenticated === true) { this._setup(); }
    }

    /**
     * this method is used to load and display data from appwrite after the controller has appeared and an user has been logged in. It is also used for general setup.
     */
    _setup() {
        this._setupControllers();
        this._setIcon();
        this._previewManager = this._createPreviewManager();
        this.updateScore();
    }

    /**
     * this method is used to tell all embedded controllers to start fetching data, it may only be safe to be called after a user has been authenticated
     */
    _setupControllers() {
        this.embeddedControllers.forEach(embeddedController => embeddedController.setup());
    }

    /**
     * this method is used to check the authentication status and present an authentication screen to users. It ensures that appwrite may only be called after a successful authentication.
     */
    _ensureAuthentication() {
        const authentication = AppWriteAuthentication.sharedInstance;
        authentication.addEventListener(AppWriteAuthentication.APPWRITEAUTHENTICATION_DEAUTHENTICATED_NOTIFICATION_TYPE, this._presentAuthenticationController.bind(this));

        AppWriteAuthentication.sharedInstance.synchronize().then(() => {
            if (authentication.isAuthenticated === false) { this._presentAuthenticationController(); }
            else { this._setup(); }
        }, error => {
            Logger.sharedInstance.error(error);
            this._presentAuthenticationController();
        });
    }

    /**
     * this method is used to present the authenticationcontroller
     */
    _presentAuthenticationController() {
        const authController = new BGAuthenticationController();
        this.addController(authController);
    }

    /**
     * this method is used to display an logout icon if the user hovers over the navigation button in start mode
     */
    _onIconButtonMouseOver() {
        if (this.mode !== BGIndexController.Mode.start) { return; }

        this._addLogoutIcon();
    }

    /**
     * this method is used to switch back to the user icon once a user exits the navigation button in start mode
     */
    _onIconButtonMouseOut() {
        if (this.mode !== BGIndexController.Mode.start) { return; }

        this._setIcon();
    }

    /**
     * this method handles navigation button clicks
     */
    _onIconButtonPressed() {
        const mode = this.mode;

        switch (mode) {
            case BGIndexController.Mode.start:
                AppWriteAuthentication.sharedInstance.logout();
                break;
            case BGIndexController.Mode.detail:
                break;
            default:
                throw new Error(`Unsupported mode: ${mode}`);
        }

        this.removeStackedControllers();
        this._setupControllers();
    }

    /**
     * this method is used to set the navigation button to 'close' visually
     */
    _addCloseIcon() {
        const closeIcon = this._createCloseIcon();
        this.iconButton.innerHTML = closeIcon.htmlText;
    }

    /**
    * this method is used to set the navigation button to 'logout' visually
    */
    _addLogoutIcon() {
        const logoutIcon = this._createLogoutIcon();
        this.iconButton.innerHTML = logoutIcon.htmlText;
    }

    /**
     * this method is used to embed controllers, adding them either directly to the content view or stacking them on top of other controllers already present for one particular position
     * @param {BGController} controller 
     * @param {GridInset} position 
     */
    embedController(controller, position) {
        if (controller.parentController !== undefined) { throw new Error("Cannot add controller to more than one parent controller"); }

        const embeddedControllers = this.embeddedControllers,
            parentController = embeddedControllers.find(controller => position.equals(controller.view.gridInset) === true);

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

    /**
     * this method is used to remove all stacked controllers, ignoring the controllers directly added to the content view
     */
    removeStackedControllers() {
        this.mode = BGIndexController.Mode.start;
        this.embeddedControllers.forEach(controller => controller.removeControllers());

        this._setIcon();
        this.updateScore();

        this.title = "BeGreen";
    }

    /**
     * this method is used to update the score label to reflect the current value stored in appwrite
     * @param {string} containerId a string representing the appwrite preview container id
     */
    async updateScore(containerId = AppWriteAuthentication.sharedInstance.user.$id) {
        let score = 0;

        const previewDocuments = await this.previewManager.loadResources([Query.equal("$id", containerId)]);
        if (previewDocuments.length > 0) { score = `${previewDocuments[0].score} 🍀`; }

        this.score = score;
    }

    /**
     * this method is used to switch to detail mode and show groups if the user selects a group
     * @param {Event} event 
     */
    _onGroupSelected(event) {
        const teamView = event.data,
            team = teamView.data;

        this.presentGroup(team);
    }

    /**
     * this method is used to switch to detail mode and show chats if the user selects a chat
     * @param {Event} event 
     */
    _onChatSelected(event) {
        const teamView = event.data,
            team = teamView.data;

        this.presentChat(team);
    }

    /**
     * this method is used to display chat-controllers
     * @param {BGListViewItemData} team the data object of the selected listview item to represent a team
     */
    presentChat(team) {
        this.removeStackedControllers();
        this.mode = BGIndexController.Mode.detail;

        const id = team.id, challengesListViewController = this._createTeamChallengesListViewController(id), messagesListViewController = this._createMessagesListViewController(id);
        this.title = team.name;
        this._addCloseIcon();
        this.updateScore(id);

        challengesListViewController.addEventListener(BGTeamChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this._onScoreChanged.bind(this));
        challengesListViewController.setup();
        this.embedController(challengesListViewController, BGIndexController.ControllerPosition.right);

        messagesListViewController.setup();
        this.embedController(messagesListViewController, BGIndexController.ControllerPosition.bottomLeft);
    }

    /**
     * this method is used to display group-controllers
     * @param {BGListViewItemData} team the data object of the selected listview item to represent a team
     */
    presentGroup(team) {
        this.presentChat(team);

        const membersListViewController = this._createMembersListViewController(team.id);
        membersListViewController.setup();
        this.embedController(membersListViewController, BGIndexController.ControllerPosition.topLeft);
    }

    /**
     * this method is used to set the navigation button icon to the leading character of the users name
     */
    _setIcon() {
        const user = AppWriteAuthentication.sharedInstance.user;
        if (user === undefined) { return; }
        this.iconButton.text = user.name[0].toUpperCase();
    }

    /**
     * this method is used to handle score changes, it triggers an update of the score label and the leaderboard controller
     * @param {Event} event 
     */
    _onScoreChanged(event) {
        const controller = event.data;

        this.updateScore(controller.containerId);
        this._updateLeaderboardIfPossible();
    }

    /**
     * this method is used to update the leaderboard if a leaderboard controller exists
     */
    _updateLeaderboardIfPossible() {
        const leaderboardController = this.embeddedControllers.find(embeddedController => embeddedController instanceof BGLeaderboardController);
        if (leaderboardController !== undefined) { leaderboardController.updateSections(); }
    }

    /**
     * this method is used to create the embedded controllers suitable for the start state
     */
    _createControllers() {
        const teamsListViewController = this._createTeamsListViewController(), challengesViewController = this._createChallengesListViewController(), leaderboardViewController = this._createLeaderboardViewController();
        this.embedController(teamsListViewController, BGIndexController.ControllerPosition.topLeft);

        challengesViewController.addEventListener(BGChallengesListViewController.SCORE_CHANGE_NOTIFICATION_TYPE, this._onScoreChanged.bind(this));
        this.embedController(challengesViewController, BGIndexController.ControllerPosition.right);

        this.embedController(leaderboardViewController, BGIndexController.ControllerPosition.bottomLeft);
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

    /**
     * the methods below are used to create and setup embedded controllers to display on detail state
     */
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

    /**
    * below are several functions to create views an manage the controllers view hierarchy. 
    */
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

    _createTitleView() {
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px")), titleLabel = this._createTitleLabel();

        this._titleLabel = titleLabel;
        stackView.addView(titleLabel);

        return stackView;
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

    _createPreviewManager() {
        const previewManager = new BGPreviewDocumentManager();

        return previewManager;
    }

    _createNavigationView() {
        const navigation = new Navigation(), stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.spaceBetween, StackView.CrossAxisAlignment.center), titleView = this._createTitleView(), infoView = this._createInfoView();

        stackView.backgroundColor = Color.white;
        stackView.height = "75px";
        stackView.padding = Padding.horizontal("15px");
        stackView.borders = Borders.bottom(new Border(Color.darkGrey, "1px"));
        stackView.shadow = new BoxShadow("0px", "5px", new Color(0, 0, 0, 0.25), "5px", "3px");

        stackView.addView(titleView);

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
        const stackView = new StackView(StackView.Axis.horizontal, StackView.MainAxisAlignment.flexStart, StackView.CrossAxisAlignment.center, Gap.all("10px")), scoreLabel = this._createScoreLabel(), iconButton = this._createIconButton();

        this._scoreLabel = scoreLabel;
        stackView.addView(scoreLabel);

        this._iconButton = iconButton;
        stackView.addView(iconButton);

        return stackView;
    }

    _createView() {
        const view = super._createView(), navigationView = this._createNavigationView(), contentView = this._createContentView();
        view.backgroundColor = Color.darkGreen;
        view.backgroundSize = "cover";
        view.backgroundImage = `url(${image})`;

        navigationView.zIndex = "1";
        this._navigationView = navigationView;
        view.addView(navigationView);

        contentView.grow = "1";

        this._contentView = contentView;
        view.addView(contentView);
    }
}