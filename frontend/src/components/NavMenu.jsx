import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

export function NavMenu() {
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!open) return;

        function onMouseDown(e) {
            const btn = btnRef.current;
            const menu = menuRef.current;
            if (!btn || !menu) return;
            const clickedInside = btn.contains(e.target) || menu.contains(e.target);
            if (!clickedInside) setOpen(false);
        }
        function onKeyDown(e) {
            if (e.key === "Escape") setOpen(false);
        }

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <nav className="navmenu">
            <button
                ref={btnRef}
                type="button"
                className="navmenu-button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                Menu <span aria-hidden="true">▾</span>
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="navmenu-panel"
                    role="menu"
                    aria-label="Site navigation"
                >
                    <Link className="navmenu-item" role="menuitem" to="/" >
                        Home
                    </Link>
                    <Link className="navmenu-item" role="menuitem" to="/recipes" >
                        Recipes
                    </Link>
                    <Link className="navmenu-item" role="menuitem" to="/prep" >
                        Prep
                    </Link>
                </div>
            )}
        </nav>
    )
}