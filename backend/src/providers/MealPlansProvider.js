export class MealPlansProvider {
    constructor(mongoClient) {
        this.collection = mongoClient.db("preppin").collection("mealPlans");
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