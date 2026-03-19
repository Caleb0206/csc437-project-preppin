import {MongoClient} from "mongodb";
import {getEnvVar} from "../getEnvVar.js";

export class MealPlansProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("MEALPLANS_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async getAllMealPlans() {
        return await this.collection.find({}).toArray();
    }

    async createMealPlanEntries(entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
            return [];
        }

        const docs = entries.map((entry) => ({
            ...entry,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await this.collection.insertMany(docs);
        return docs;
    }

    async clearAllMealPlans() {
        return await this.collection.deleteMany({});
    }
}