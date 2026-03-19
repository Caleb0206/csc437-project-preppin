import {MongoClient} from "mongodb";
import {getEnvVar} from "../getEnvVar.js";

export class MealPlansProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("MEALPLANS_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async getAllMealPlans(ownerUsername) {
        return await this.collection.find({ownerUsername}).toArray();
    }

    async createMealPlanEntries(ownerUsername, entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
            return [];
        }

        const docs = entries.map((entry) => ({
            ...entry,
            ownerUsername,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await this.collection.insertMany(docs);
        return docs;
    }

    async clearAllMealPlans(ownerUsername) {
        return await this.collection.deleteMany({ownerUsername});
    }
}