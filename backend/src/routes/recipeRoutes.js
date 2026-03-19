import {ObjectId} from "mongodb";
import {getEnvVar} from "../getEnvVar.js";
import {imageMiddlewareFactory, handleImageFileErrors} from "./imageUploadMiddleware.js";

export function registerRecipeRoutes(app, recipesProvider) {
    app.get("/api/recipes", async (req, res) => {
        try {
            const recipes = await recipesProvider.getAllRecipes(req.userInfo.username);
            res.json(recipes);
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Failed to fetch recipes"});
        }
    });

    app.post(
        "/api/recipes",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req, res) => {
            try {
                const {name, ingredients} = req.body;

                if (!name?.trim()) {
                    res.status(400).json({error: "Recipe name is required"});
                    return;
                }

                const imgSrc = req.file
                    ? `/uploads/${req.file.filename}`
                    : "https://placehold.co/500x200";

                const recipe = await recipesProvider.createRecipe({
                    name: name.trim(),
                    ingredients: ingredients?.trim() ?? "",
                    imgSrc,
                    alt: "recipe image",
                    ownerUsername: req.userInfo.username,
                });

                res.status(201).json(recipe);
            } catch (err) {
                console.error(err);
                res.status(500).json({error: "Failed to create recipe"});
            }
        });

    app.put(
        "/api/recipes/:id",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req, res) => {
            try {
                const id = new ObjectId(req.params.id);
                const {name, ingredients} = req.body;

                if (!name?.trim()) {
                    res.status(400).json({error: "Recipe name is required"});
                    return;
                }

                const updates = {
                    name: name.trim(),
                    ingredients: ingredients?.trim() ?? "",
                };

                if (req.file) {
                    updates.imgSrc = `/uploads/${req.file.filename}`;
                    updates.alt = "recipe image";
                }

                const recipe = await recipesProvider.updateRecipe(id, req.userInfo.username, updates);

                if (!recipe) {
                    res.status(404).json({error: "Recipe not found"});
                    return;
                }

                res.json(recipe);
            } catch (err) {
                console.error("PUT recipe failed:", err);
                res.status(500).json({error: "Failed to update recipe"});
            }
        });
}