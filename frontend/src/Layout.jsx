import { Outlet, Link, useLocation } from "react-router";
import { Header } from "./components/Header.jsx";

export function Layout({ theme, setTheme }) {
    const { pathname } = useLocation();
    const showBack = pathname !== "/";

    return (
        <>
            <Header
                theme={theme}
                setTheme={setTheme}
                leftSlot={showBack ? <Link to="/" className="back-link">Back</Link> : null}
            />
            <Outlet />
        </>
    )
}