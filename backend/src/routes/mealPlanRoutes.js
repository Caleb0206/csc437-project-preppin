export function registerMealPlanRoutes(app, mealPlansProvider) {
    app.get("/api/meal-plans", async (req, res) => {
        try {
            const mealPlans = await mealPlansProvider.getAllMealPlans();
            res.json(mealPlans);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch meal plans" });
        }
    });

    app.post("/api/meal-plans", async (req, res) => {
        try {
            const { entries } = req.body;

            if (!Array.isArray(entries) || entries.length === 0) {
                res.status(400).json({ error: "Entries array is required" });
                return;
            }

            const created = await mealPlansProvider.createMealPlanEntries(entries);
            res.status(201).json(created);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create meal plan entries" });
        }
    });

    app.delete("/api/meal-plans", async (req, res) => {
        try {
            await mealPlansProvider.clearAllMealPlans();
            res.status(204).end();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to clear meal plans" });
        }
    });
}