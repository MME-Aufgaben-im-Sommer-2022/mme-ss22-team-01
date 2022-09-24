"use strict";

import BGIndexController from "../../app/src/Controllers/BGIndexController.js";

const controller = new BGIndexController();


/*

import { Client } from "appwrite";
import AppWriteConfig from "./AppWrite/AppWriteConfig";



const client = new Client();

client.setEndpoint(AppWriteConfig.ENDPOINT_URI).setProject(AppWriteConfig.PROJECT_ID);
//database.collections.${this.collectionId}.documents.*
//`database.${AppWriteConfig.DATABASE_SHARED_ID}.collections.*`
AppWriteConfig.DATABASE_SHARED_ID
client.subscribe(`database.${AppWriteConfig.DATABASE_SHARED_ID}.collections.*`, response => {
    console.log(response);
});
*/

/*
AppWriteAuthentication.sharedInstance.synchronize().then(() => {
    console.log("successfully authenticated"); // Success

    const teamManager = new AppWriteTeamManager(AppWriteTeamManager.NamingScheme.short);
    teamManager.loadResources().then(resources => console.table(resources), error => console.log(error));
}, error => {
    console.log(error);
});
*/