import { useState } from "react";

import { Header } from "./header.jsx"
import { Calendar } from "./Calendar.jsx"
import { NavButtons } from "./NavButtons.jsx";
import { PrepPage } from "./PrepPage.jsx";
import { RecipesPage } from "./RecipesPage.jsx";

function App() {

  return (
    // <RecipesPage />
    <>
      <Header />
      <main>
        <Calendar />
      </main>
      <footer>
        <NavButtons />
      </footer>
    </>
  );
}

export default App
