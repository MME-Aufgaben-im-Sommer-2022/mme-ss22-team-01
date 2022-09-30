import BGIndexController from "../../app/src/Controllers/BGIndexController.js";
import Logger from "./utils/Logger.js";

Logger.sharedInstance.isEnabled = false;
window.indexController = new BGIndexController();