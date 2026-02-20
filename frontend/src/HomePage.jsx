import { Header } from "./header.jsx"
import { NavButtons } from "./NavButtons.jsx";

export function Calendar() {
    return (
        <>
            <Header />
            <main className="calendar">
                <h2 className="breakfast ">Breakfast</h2>
                <h2 className="lunch ">Lunch</h2>
                <h2 className="dinner ">Dinner</h2>

                <h2 className="sun">S</h2>
                <h2 className="mon">M</h2>
                <h2 className="tues ">T</h2>
                <h2 className="wed ">W</h2>
                <h2 className="thurs ">T</h2>
                <h2 className="fri ">F</h2>
                <h2 className="sat ">S</h2>

                {/* <!-- 21 Cells Slots --> */}
                <div className="slot slot--sun-breakfast "></div>
                <div className="slot slot--sun-lunch "></div>
                <div className="slot slot--sun-dinner "></div>

                <div className="slot slot--mon-breakfast "></div>
                <div className="slot slot--mon-lunch "></div>
                <div className="slot slot--mon-dinner "></div>

                <div className="slot slot--tues-breakfast "></div>
                <div className="slot slot--tues-lunch "></div>
                <div className="slot slot--tues-dinner ">
                    <div className="meal-card meal-card--cooking">Cooking</div>
                </div>

                <div className="slot slot--wed-breakfast "></div>
                <div className="slot slot--wed-lunch ">
                    <div className="meal-card meal-card--prepped">Prepped!</div>
                </div>
                <div className="slot slot--wed-dinner ">
                    <div className="meal-card meal-card--prepped">Prepped!</div>
                </div>

                <div className="slot slot--thurs-breakfast "></div>
                <div className="slot slot--thurs-lunch "></div>
                <div className="slot slot--thurs-dinner "></div>

                <div className="slot slot--fri-breakfast "></div>
                <div className="slot slot--fri-lunch "></div>
                <div className="slot slot--fri-dinner "></div>

                <div className="slot slot--sat-breakfast "></div>
                <div className="slot slot--sat-lunch "></div>
                <div className="slot slot--sat-dinner "></div>
            </main>
            <footer>
                <NavButtons />
            </footer>
        </>

    )
}