import {Outlet} from "react-router";
import {Header} from "./components/Header.jsx";

export function Layout({theme, setTheme, authToken, setAuthToken}) {
    return (
        <>
            <Header
                theme={theme}
                setTheme={setTheme}
                authToken={authToken}
                setAuthToken={setAuthToken}
            />
            <Outlet/>
        </>
    )
}