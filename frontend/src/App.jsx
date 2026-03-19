import {useState, useEffect} from "react";

import {Routes, Route, Link} from "react-router";
import {Layout} from "./Layout.jsx";
import {HomePage} from "./pages/HomePage.jsx"
import {PrepPage} from "./pages/PrepPage.jsx";
import {RecipesPage} from "./pages/RecipesPage.jsx";

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


function App() {
    const [theme, setTheme] = useState("light");
    const [recipes, setRecipes] = useState([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [recipesError, setRecipesError] = useState("");

    useEffect(() => {
        async function loadRecipes() {
            try {
                setRecipesLoading(true);
                setRecipesError("");

                const response = await fetch("/api/recipes");
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
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);


    // calendar state keyed by day
    const [calendar, setCalendar] = useState(() => emptyWeek()); // seededWeek();

    // function prepSubmit passed to PrepPage to populate calendar
    function prepSubmit({day, time, recipeName, servings, eatOneServing, fillBreakfastOnly}) {
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
                if (offset === 0) {
                    // meal occurs <= cooking time, skip it, start after cooking slot
                    if (mealOrder[meal] <= mealOrder[time]) continue;
                }
                slots.push({day: dayKey, meal});
            }
        }
        const targets = [
            {day, meal: time},
            ...slots.slice(0, leftovers).map((s) => ({day: s.day, meal: s.meal})),
        ];
        // returns to PrepPage
        let result = {ok: true, message: ""};

        setCalendar((prev) => {
            const conflicts = targets.filter(t => prev[t.day]?.[t.meal] != null);

            if (conflicts.length > 0) {
                const first = conflicts[0];
                result = {
                    ok: false,
                    message: `Slot filled already (${first.day} ${first.meal}). Try another time`
                };
                return prev;
            }

            const copy = JSON.parse(JSON.stringify(prev));

            // mark cooking slot
            copy[day][time] = {kind: "cooking", recipe: recipeName, ateOne: eatOneServing};

            // Fill in leftovers
            for (let i = 0; i < leftovers && i < slots.length; i++) {
                const {day: d, meal: m} = slots[i];
                copy[d][m] = {kind: "prepped", recipe: recipeName, servings: 1};
            }

            result = {ok: true, message: ""};
            return copy;
        });
        return result;
    }


    return (
        <>
            <Routes>
                <Route element={<Layout theme={theme} setTheme={setTheme}/>}>
                    <Route path="/" element={<HomePage calendar={calendar}/>}/>
                    <Route
                        path="/recipes"
                        element={
                            <RecipesPage
                                recipes={recipes}
                                setRecipes={setRecipes}
                                recipesLoading={recipesLoading}
                                recipesError={recipesError}
                            />}
                    />
                    <Route
                        path="/prep"
                        element={
                            <PrepPage
                                recipes={recipes}
                                recipesLoading={recipesLoading}
                                recipesError={recipesError}
                                onSubmit={prepSubmit}
                            />
                        }
                    />
                </Route>

            </Routes>
        </>
    );
}

export default App
