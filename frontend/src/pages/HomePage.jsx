import { Header } from "../components/Header.jsx"
import { Calendar } from "../components/Calendar.jsx";

export function HomePage({ calendar }) {
    return (
        <>
            <Calendar calendar={calendar} />

        </>
    );
}