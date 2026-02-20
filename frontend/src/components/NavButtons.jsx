import { Link } from "react-router-dom";

export function NavButtons() {
    return (
        <nav className="row-buttons">
            <Link to="/recipes" className="temp-btn">Recipes</Link>
            <Link to="/prep" className="temp-btn">Prep!</Link>
        </nav>
    )
}