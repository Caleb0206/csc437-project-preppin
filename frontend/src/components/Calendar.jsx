import { NavButtons } from "./NavButtons.jsx";

const DAYS = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

function SlotContent({ cell }) {
    if (!cell) return null;
    if (cell.kind === "cooking") {
        return (
            <div className="meal-card meal-card--cooking">
                <strong>Cooking</strong>
                <p>{cell.recipe}</p>
            </div>);
    }
    if (cell.kind === "prepped") {
        return (
            <div className="meal-card meal-card--prepped">
                <strong>Prepped</strong>
                <p>{cell.recipe}</p>

            </div>);
    }
    return null;
}

export function Calendar({ calendar = null }) {
    if (!calendar) {
        return <div>Calendar not available</div>
    }

    return (
        <>
            <main className="calendar" aria-label="weekly meal calendar">
                <h2 className="breakfast ">Breakfast</h2>
                <h2 className="lunch ">Lunch</h2>
                <h2 className="dinner ">Dinner</h2>

                {DAYS.map((d) => (
                    <h2 key={d} className={d}>{d[0].toUpperCase()}</h2>
                ))}

                {DAYS.map((d) => (
                    <div key={`${d}-breakfast`} className={`slot slot--${d}-breakfast`}>
                        <SlotContent cell={calendar[d].breakfast} />
                    </div>
                ))}
                {DAYS.map((d) => (
                    <div key={`${d}-lunch`} className={`slot slot--${d}-lunch`}>
                        <SlotContent cell={calendar[d].lunch} />
                    </div>
                ))}
                {DAYS.map((d) => (
                    <div key={`${d}-dinner`} className={`slot slot--${d}-dinner`}>
                        <SlotContent cell={calendar[d].dinner} />
                    </div>
                ))}
            </main>
        </>
    )
}