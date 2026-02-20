import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import { Header } from "./header.jsx"
import { Calendar } from "./HomePage.jsx"
import { NavButtons } from "./NavButtons.jsx";
import { PrepPage } from "./PrepPage.jsx";
import { RecipesPage } from "./RecipesPage.jsx";
import { Form } from "react-router-dom";

function App() {

  return (
    // <RecipesPage />
    <>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/prep" element={<PrepPage />} />
      </Routes>
    </>
  );
}

export default App
