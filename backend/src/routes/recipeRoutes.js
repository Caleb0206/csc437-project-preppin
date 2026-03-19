import { ObjectId } from "mongodb";

export function registerRecipeRoutes(app, recipesProvider) {
    app.get("/api/recipes", async (req, res) => {
        try {
            const recipes = await recipesProvider.getAllRecipes();
            res.json(recipes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch recipes" });
        }
    });

    app.post("/api/recipes", async (req, res) => {
        try {
            const { name, ingredients, imgSrc, alt } = req.body;

            if (!name?.trim()) {
                res.status(400).json({ error: "Recipe name is required" });
                return;
            }

            const recipe = await recipesProvider.createRecipe({
                name: name.trim(),
                ingredients: ingredients?.trim() ?? "",
                imgSrc,
                alt,
            });

            res.status(201).json(recipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create recipe" });
        }
    });

    app.put("/api/recipes/:id", async (req, res) => {
        try {
            const id = new ObjectId(req.params.id);
            const { name, ingredients } = req.body;

            if (!name?.trim()) {
                res.status(400).json({ error: "Recipe name is required" });
                return;
            }

            const recipe = await recipesProvider.updateRecipe(id, {
                name: name.trim(),
                ingredients: ingredients?.trim() ?? "",
            });

            if (!recipe) {
                res.status(404).json({ error: "Recipe not found" });
                return;
            }

            res.json(recipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update recipe" });
        }
    });
}