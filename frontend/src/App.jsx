import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.jsx"
import { Calendar } from "./pages/HomePage.jsx"
import { NavButtons } from "./components/NavButtons.jsx";
import { PrepPage } from "./pages/PrepPage.jsx";
import { RecipesPage } from "./pages/RecipesPage.jsx";
import { Form } from "react-router-dom";

function App() {

  return (
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
