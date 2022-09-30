/**
 * this class holds all the necessary constants to configure appwrite and access databases
 */
export default class AppWriteConfig {

    /**
     * this constant represents the default uid to be used for creating new database elements
     */
    static get UNIQUE_ID() {
        return "unique()";
    }

    /**
     * this constant represents the identifier for the root database
     */
    static get DATABASE_SHARED_ID() {
        return "6303a7f5ae6470c89176";
    }

    /**
     * this constant represents the identifier for the 'preview' collection
     */
    static get DATABASE_SHARED_COLLECTION_PREVIEW_ID() {
        return "6303a800e31a51463d4e";
    }

    /**
     * this constant represents the identifier for the 'challenges' collection
     */
    static get DATABASE_SHARED_COLLECTION_CHALLENGES_ID() {
        return "630ba3012294963e2eeb";
    }

    /**
     * this constant represents the identifier for the 'assignments' collection
     */
    static get DATABASE_SHARED_COLLECTION_ASSIGNMENTS_ID() {
        return "630cb593eb653313d7d4";
    }

    /**
     * this constant represents the identifier for the 'messages' collection
     */
    static get DATABASE_SHARED_COLLECTION_MESSAGES_ID() {
        return "6303a8bddd2b9d43cb9e";
    }

    /**
     * this constant represents the appwrite endpoint uri
     */
    static get ENDPOINT_URI() {
        return "https://appwrite.software-engineering.education/v1";
    }

    /**
     * this constant represents the identifier for the appwrite-project
     */
    static get PROJECT_ID() {
        return "62f0c619418bdbe12e04";
    }

    /**
     * this constant represents the identifier for the appwrite-application-url
     */
    static get APPLICATION_URL() {
        return "begreen.software-engineering.education";
    }
}