import { Header } from "../components/Header.jsx"
import { NavButtons } from "../components/NavButtons.jsx";
import { Calendar } from "../components/Calendar.jsx";

export function HomePage({ calendar }) {
    return (
        <>
            <Calendar calendar={calendar} />
            <footer>
                <NavButtons />
            </footer>
        </>
    );
}