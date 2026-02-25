import { useState } from "react";

export function Header({ leftSlot = null, rightSlot = null, theme, setTheme }) {
    return (
        <header className="site-header">
            <div className="header-left">
                {leftSlot}
            </div>
            <h1 className="site-title">Preppin'</h1>
            <div className="header-right" >
                {rightSlot}
                <label htmlFor="toggle-theme" className="toggle-theme-label">
                    Dark Mode
                </label>
                <input
                    type="checkbox"
                    id="toggle-theme"
                    className="toggle-theme"
                    checked={theme === "dark"}
                    onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />

            </div>
        </header >
    )
}