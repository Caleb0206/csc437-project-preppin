import { Header } from "./header.jsx";

export function PrepPage() {
    return (
        <>
            <Header leftSlot={<a href="/" className="back-link">Back</a>} />
            <main className="preppin-page">
                <div className="form-container">
                    <div className="form-field">
                        <label for="day">Select a day:</label>
                        <select id="day" name="day">
                            <option value="sunday">Sunday</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label for="time">Select a time of meal to prep:</label>
                        <select id="time" name="time">
                            <option value="morning">Breakfast</option>
                            <option value="noon">Lunch</option>
                            <option value="evening">Dinner</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label for="recipe">Select recipe:</label>
                        <select id="recipe" name="recipe">
                            <option value="braised-pork-rice">Braised Pork Rice</option>
                            <option value="stir-fry-beef-udon">Stir Fry Beef Udon</option>
                            <option value="scallion-oil-noodles">Scallion Oil Noodles</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label for="input-servings">Servings:</label>
                        <input id="input-servings" type="number" />
                    </div>
                    <div className="form-field checkbox-field">
                        <label for="input-isBreakfast">Breakfast</label>
                        <input id="input-isBreakfast" type="checkbox" />
                    </div>
                    <div className="row-buttons">
                        <a href="index.html" className="temp-btn">Cancel</a>
                        <a href="index.html" className="temp-btn">Prep!</a>
                    </div>

                </div>
            </main>
        </>
    )
}