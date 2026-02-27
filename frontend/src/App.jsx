import { useState, useEffect, useMemo } from "react";

import { Routes, Route, Link, useLocation } from "react-router";
import { Layout } from "./Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx"
import { PrepPage } from "./pages/PrepPage.jsx";
import { RecipesPage } from "./pages/RecipesPage.jsx";

const DAYS = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

const PLACEHOLDER_IMG = "https://placehold.co/500x200";

const INITIAL_RECIPES = [
  {
    id: 1,
    name: "Braised Pork Rice",
    imgSrc: PLACEHOLDER_IMG,
    alt: "placeholder-blank",
    ingredients: "Ground Pork, White Rice, Soy Sauce, Black Vinegar, Onions, Garlic, Sugar"
  },
  {
    id: 2,
    name: "Stir Fry Beef Udon",
    imgSrc: PLACEHOLDER_IMG,
    alt: "placeholder-blank",
    ingredients: "Beef Rolls, Udon noodles, Onions, Garlic, Green Onion, Soy Sauce, Black Vinegar, Mirin, Sugar, Chili Flakes"
  },
  {
    id: 3,
    name: "Scallion Oil Noodles",
    imgSrc: PLACEHOLDER_IMG,
    alt: "placeholder-blank",
    ingredients: "Noodles, Green Onions, Shallots, Neutral Oil, Soy Sauce, Oyster Sauce, White Pepper"
  }
];

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

// mock data
function seededWeek() {
  const week = emptyWeek();

  week.tues.dinner = { kind: "cooking", recipe: "Braised Pork Rice" };
  week.wed.lunch = { kind: "prepped", recipe: "Braised Pork Rice" };
  week.wed.dinner = { kind: "prepped", recipe: "Braised Pork Rice" };

  return week;
}

function App() {
  const [theme, setTheme] = useState("light");
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const showBack = location.pathname === "/recipes" || location.pathname === "/prep";

  // calendar state keyed by day
  const [calendar, setCalendar] = useState(() => seededWeek()); // emptyWeek());

  // function prepSubmit passed to PrepPage to populate calendar
  function prepSubmit({ day, time, recipeName, servings, eatOneServing, fillBreakfastOnly }) {
    const servingsNum = Number(servings) || 0;

    // if eat 1 on cooking day, only (servings - 1) are left. otherwise schedule all servings
    const leftovers = Math.max(0, servingsNum - (eatOneServing ? 1 : 0));

    const dayIndex = DAYS.indexOf(day);
    const mealOrder = { breakfast: 0, lunch: 1, dinner: 2 };

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
        slots.push({ day: dayKey, meal });
      }
    }
    const targets = [
      { day, meal: time },
      ...slots.slice(0, leftovers).map((s) => ({ day: s.day, meal: s.meal })),
    ];
    // returns to PrepPage
    let result = { ok: true, message: "" };

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
      copy[day][time] = { kind: "cooking", recipe: recipeName, ateOne: eatOneServing };

      // Fill in leftovers
      for (let i = 0; i < leftovers && i < slots.length; i++) {
        const { day: d, meal: m } = slots[i];
        copy[d][m] = { kind: "prepped", recipe: recipeName, servings: 1 };
      }

      result = { ok: true, message: "" };
      return copy;
    });
    return result;
  }




  return (
    <>
      <Routes>
        <Route element={<Layout theme={theme} setTheme={setTheme} />}>
          <Route path="/" element={<HomePage calendar={calendar} />} />
          <Route
            path="/recipes"
            element={<RecipesPage recipes={recipes} setRecipes={setRecipes} />} />
          <Route
            path="/prep"
            element={<PrepPage recipes={recipes} onSubmit={prepSubmit} />} />
        </Route>

      </Routes>
    </>
  );
}

export default App
