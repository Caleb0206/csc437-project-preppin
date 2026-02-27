import { Header } from "../components/Header.jsx";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

const DAYS = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

export function PrepPage({ recipes, onSubmit }) {
    const navigate = useNavigate();

    const [day, setDay] = useState("sun");
    const [time, setTime] = useState("breakfast");
    const [recipeId, setRecipeId] = useState(recipes[0]?.id ?? "");
    const [servings, setServings] = useState(2);
    const [breakfastOnly, setBreakfastOnly] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const selected = recipes.find((r) => String(r.id) === String(recipeId));
        const recipeLabel = selected?.name ?? "";

        const res = onSubmit({
            day,
            time,
            recipeName: recipeLabel,
            servings,
            fillBreakfastOnly: breakfastOnly,
        });

        if (!res?.ok) {
            alert(res?.message || "Slot is already filled.");
            return;
        }

        navigate("/");
    }

    return (
        <>
            <main className="preppin-page">
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="day">Select a day:</label>
                        <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
                            <option value="sun">Sunday</option>
                            <option value="mon">Monday</option>
                            <option value="tues">Tuesday</option>
                            <option value="wed">Wednesday</option>
                            <option value="thurs">Thursday</option>
                            <option value="fri">Friday</option>
                            <option value="sat">Saturday</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="time">Select a time of meal to prep:</label>
                        <select id="time" value={time} onChange={(e) => setTime(e.target.value)}>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="recipe">Select recipe:</label>
                        <select id="recipe" value={recipeId} onChange={(e) => setRecipeId(e.target.value)}>
                            {recipes.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="input-servings">Servings:</label>
                        <input
                            id="input-servings"
                            type="number"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            min="1"
                        />
                    </div>
                    <div className="form-field checkbox-field">
                        <label htmlFor="input-isBreakfast">Fill breakfast only</label>
                        <input
                            id="input-isBreakfast"
                            type="checkbox"
                            checked={breakfastOnly}
                            onChange={(e) => setBreakfastOnly(e.target.checked)}
                        />
                    </div>
                    <div className="row-buttons">
                        <Link to="/" className="temp-btn">Cancel</Link>
                        <button type="submit" className="temp-btn">Prep!</button>
                    </div>

                </form>
            </main>
        </>
    )
}