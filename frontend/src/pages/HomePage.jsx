import {Header} from "../components/Header.jsx"
import {Calendar} from "../components/Calendar.jsx";
import {useState} from "react";

export function HomePage({calendar, onResetMealPlans}) {
    const [resetError, setResetError] = useState("");

    async function handleReset() {
        const confirmed = window.confirm("Reset the week?");
        if (!confirmed) return;
        
        setResetError("");
        const res = await onResetMealPlans();
        if (!res?.ok) {
            setResetError(res?.message || "Could not reset meal plans.");
        }
    }

    return (
        <>
            <Calendar calendar={calendar}/>
            <div className="row-buttons">
                <button type="button" className="temp-btn" onClick={handleReset}>
                    Reset Meal Plans
                </button>
            </div>

            {resetError && (
                <p className="form-error" role="alert">
                    {resetError}
                </p>
            )}
        </>
    );
}