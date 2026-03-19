import {MongoClient} from "mongodb";
import {getEnvVar} from "../getEnvVar.js";

export class RecipesProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("RECIPES_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async getAllRecipes() {
        return await this.collection.find({}).sort({createdAt: 1}).toArray();
    }

    async createRecipe(recipe) {
        const doc = {
            name: recipe.name,
            ingredients: recipe.ingredients ?? "",
            imgSrc: recipe.imgSrc ?? "https://placehold.co/500x200",
            alt: recipe.alt ?? "placeholder-blank",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await this.collection.insertOne(doc);
        return {...doc, _id: result.insertedId};
    }

    async updateRecipe(id, updates) {
        const updateDoc = {
            $set: {
                name: updates.name,
                ingredients: updates.ingredients ?? "",
                updatedAt: new Date(),
            },
        };

        if (updates.imgSrc) {
            updateDoc.$set.imgSrc = updates.imgSrc;
        }

        if (updates.alt) {
            updateDoc.$set.alt = updates.alt;
        }

        await this.collection.updateOne(
            {_id: id},
            updateDoc,
        );

        return await this.collection.findOne({_id: id});
    }
}