import {useState, useEffect} from "react";

import {BrowserRouter, Routes, Route} from "react-router";
import {Layout} from "./Layout.jsx";
import {HomePage} from "./pages/HomePage.jsx"
import {PrepPage} from "./pages/PrepPage.jsx";
import {RecipesPage} from "./pages/RecipesPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {ProtectedRoute} from "./pages/ProtectedRoute.jsx";

const DAYS = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

const PLACEHOLDER_IMG = "https://placehold.co/500x200";


function emptyWeek() {
    const week = {};
    for (const day of DAYS) {
        week[day] = {
            breakfast: null,
            lunch: null,
            dinner: null,
        }
    }
    return week;
}

function mealPlansToCalendar(mealPlans) {
    const week = emptyWeek();

    for (const entry of mealPlans) {
        if (!week[entry.day]) continue;

        week[entry.day][entry.meal] = {
            kind: entry.kind,
            recipe: entry.recipe,
            ateOne: entry.ateOne ?? false,
            servings: entry.servings ?? null,
        };
    }

    return week;
}


function App() {
    const [theme, setTheme] = useState("light");
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ?? "");

    const [recipes, setRecipes] = useState([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [recipesError, setRecipesError] = useState("");

    // calendar state keyed by day
    const [calendar, setCalendar] = useState(() => emptyWeek());
    const [mealPlansLoading, setMealPlansLoading] = useState(true);
    const [mealPlansError, setMealPlansError] = useState("");

    useEffect(() => {
        async function loadRecipes() {
            try {
                setRecipesLoading(true);
                setRecipesError("");

                const response = await fetch("/api/recipes", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to load recipes");
                }
                const data = await response.json();
                setRecipes(data);
            } catch (err) {
                console.error(err);
                setRecipesError("Could not load recipes");
            } finally {
                setRecipesLoading(false);
            }
        }

        loadRecipes();
    }, [authToken]);

    useEffect(() => {
        async function loadMealPlans() {
            try {
                setMealPlansLoading(true);
                setMealPlansError("");

                const response = await fetch("/api/meal-plans", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to load meal plans");
                }
                const data = await response.json();
                setCalendar(mealPlansToCalendar(data));
            } catch (err) {
                console.error(err);
                setMealPlansError("Could not load meal plans");
            } finally {
                setMealPlansLoading(false);
            }
        }

        loadMealPlans();
    }, [authToken]);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);


    // function prepSubmit passed to PrepPage to populate calendar from Database
    async function prepSubmit({day, time, recipeName, servings, eatOneServing, fillBreakfastOnly}) {
        const servingsNum = Number(servings) || 0;

        // if eat 1 on cooking day, only (servings - 1) are left. otherwise schedule all servings
        const leftovers = Math.max(0, servingsNum - (eatOneServing ? 1 : 0));

        const dayIndex = DAYS.indexOf(day);
        const mealOrder = {breakfast: 0, lunch: 1, dinner: 2};
        const allowedMeals = fillBreakfastOnly ? ["breakfast"] : ["lunch", "dinner"];

        const slots = [];

        for (let offset = 0; offset < DAYS.length; offset++) {
            const idx = dayIndex + offset;
            if (idx >= DAYS.length) break; // do not wrap past saturday
            const dayKey = DAYS[idx];

            for (const meal of allowedMeals) {
                if (offset === 0 && mealOrder[meal] <= mealOrder[time]) continue;
                slots.push({day: dayKey, meal});
            }
        }
        const targets = [
            {day, meal: time},
            ...slots.slice(0, leftovers).map((s) => ({day: s.day, meal: s.meal})),
        ];

        const conflicts = targets.filter((t) => calendar[t.day]?.[t.meal] != null);
        if (conflicts.length > 0) {
            const first = conflicts[0];
            return {
                ok: false,
                message: `Slot filled already (${first.day} ${first.meal}). Try another time`,
            };
        }

        const entries = [
            {
                day,
                meal: time,
                kind: "cooking",
                recipe: recipeName,
                ateOne: eatOneServing,
                servings: null,
            },
            ...slots.slice(0, leftovers).map((s) => ({
                day: s.day,
                meal: s.meal,
                kind: "prepped",
                recipe: recipeName,
                ateOne: false,
                servings: 1,
            }))
        ];
        try {
            const response = await fetch("/api/meal-plans", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({entries}),
            });
            if (!response.ok) {
                throw new Error("Failed to save meal plans");
            }
            setCalendar((prev) => {
                const copy = JSON.parse(JSON.stringify(prev));

                copy[day][time] = {
                    kind: "cooking",
                    recipe: recipeName,
                    ateOne: eatOneServing,
                };
                for (let i = 0; i < leftovers && i < slots.length; i++) {
                    const {day: d, meal: m} = slots[i];
                    copy[d][m] = {
                        kind: "prepped",
                        recipe: recipeName,
                        servings: 1,
                    };
                }

                return copy;
            });
            return {ok: true, message: ""};
        } catch (err) {
            console.error(err);
            return {ok: false, message: "Could not save meal plan."};
        }
    }


    return (

        <>
            <Routes>
                <Route path="/" element={
                    <Layout
                        theme={theme}
                        setTheme={setTheme}
                        authToken={authToken}
                        setAuthToken={setAuthToken}
                    />
                }>
                    <Route
                        index
                        element={
                            <ProtectedRoute authToken={authToken}>
                                <HomePage calendar={calendar}/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipes"
                        element={
                            <ProtectedRoute authToken={authToken}>
                                <RecipesPage
                                    recipes={recipes}
                                    setRecipes={setRecipes}
                                    recipesLoading={recipesLoading}
                                    recipesError={recipesError}
                                    authToken={authToken}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/prep"
                        element={
                            <ProtectedRoute authToken={authToken}>
                                <PrepPage
                                    recipes={recipes}
                                    recipesLoading={recipesLoading}
                                    recipesError={recipesError}
                                    onSubmit={prepSubmit}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login"
                           element={<LoginPage key={"login"} isRegistering={false} onAuthToken={setAuthToken}/>}/>
                    <Route path="/register"
                           element={<LoginPage key={"register"} isRegistering={true} onAuthToken={setAuthToken}/>}/>
                </Route>
            </Routes>
        </>

    );
}

export default App
