import {useState} from "react";
import {NavMenu} from "./NavMenu.jsx";
import {Link, useNavigate} from "react-router";

export function Header({theme, setTheme, authToken, setAuthToken}) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("authToken");
        setAuthToken("");
        navigate("/login");
    }

    return (
        <header className="site-header">
            <div className="header-left">
                <nav className="header-nav" aria-label="Primary navigation">
                    <div className="header-nav-links">
                        <Link className="header-nav-link" to="/">Home</Link>
                        <Link className="header-nav-link" to="/recipes">Recipes</Link>
                        <Link className="header-nav-link" to="/prep">Prep</Link>
                    </div>
                    <NavMenu/>
                </nav>
            </div>
            <h1 className="site-title">Preppin'</h1>
            <div className="header-right">
                <div className="theme-toggle">
                    <label htmlFor="toggle-theme" className="toggle-theme-label">
                        Dark Mode
                    </label>
                    <input
                        type="checkbox"
                        id="toggle-theme"
                        className="toggle-theme"
                        checked={theme === "dark"}
                        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                    />
                </div>


                {authToken && (
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                )}

            </div>
        </header>
    )
}