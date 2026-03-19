import express from "express";
import {getEnvVar} from "./getEnvVar.js";
import {connectMongo} from "./connectMongo.js";
import {VALID_ROUTES} from "../../shared/ValidRoutes.js";
import {CredentialsProvider} from "./CredentialsProvider.js";
import {RecipesProvider} from "./providers/RecipesProvider.js";
import {MealPlansProvider} from "./providers/MealPlansProvider.js";
import {registerRecipeRoutes} from "./routes/recipeRoutes.js";
import {registerMealPlanRoutes} from "./routes/mealPlanRoutes.js";
import {registerAuthRoutes} from "./routes/authRoutes.js";
import {verifyAuthToken} from "./routes/verifyAuthToken.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR", false) || "public";
const IMAGE_UPLOAD_DIR = getEnvVar("IMAGE_UPLOAD_DIR", false) || "uploads";

const app = express();


const mongoClient = connectMongo();
await mongoClient.connect();
const recipesProvider = new RecipesProvider(mongoClient);
const mealPlansProvider = new MealPlansProvider(mongoClient);
const credentialsProvider = new CredentialsProvider(mongoClient);

app.use(express.static(STATIC_DIR));
app.use(express.json());
app.use("/uploads", express.static(IMAGE_UPLOAD_DIR));

registerAuthRoutes(app, credentialsProvider);

app.use("/api/recipes", verifyAuthToken);
app.use("/api/meal-plans", verifyAuthToken);

registerRecipeRoutes(app, recipesProvider);
registerMealPlanRoutes(app, mealPlansProvider);

app.get(Object.values(VALID_ROUTES), (req, res) => {
    res.sendFile("index.html", {root: STATIC_DIR});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});