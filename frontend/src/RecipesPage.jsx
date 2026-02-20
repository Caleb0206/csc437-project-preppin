import { useState } from "react";
import { Header } from "./header.jsx";
import { EditRecipeModal } from "./EditRecipeModal.jsx";

export function RecipesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [activeRecipe, setActiveRecipe] = useState(null);

    const recipes = [
        {
            id: 1,
            name: "Braised Pork Rice",
            imgSrc: "https://placehold.co/500x200",
            alt: "placeholder-blank",
            ingredients: "Ground Pork, White Rice, Soy Sauce, Black Vinegar, Onions, Garlic, Sugar"
        },
        {
            id: 2,
            name: "Stir Fry Beef Udon",
            imgSrc: "https://placehold.co/500x200",
            alt: "placeholder-blank",
            ingredients: "Beef Rolls, Udon noodles, Onions, Garlic, Green Onion, Soy Sauce, Black Vinegar, Mirin, Sugar, Chili Flakes"
        },
        {
            id: 3,
            name: "Scallion Oil Noodles",
            imgSrc: "https://placehold.co/500x200",
            alt: "placeholder-blank",
            ingredients: "Noodles, Green Onions, Shallots, Neutral Oil, Soy Sauce, Oyster Sauce, White Pepper"
        }
    ];

    function openAdd() {
        setModalMode("add");
        setActiveRecipe(null);
        setIsModalOpen(true);
    }

    function openEdit(recipe) {
        setModalMode("edit");
        setActiveRecipe(recipe);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <>
            <Header leftSlot={<a href="/" className="back-link">Back</a>} />
            <main className="recipes-page">
                <div>
                    <div className="header-with-btn">
                        <h2>Recipes</h2>
                        <button className="temp-btn" onClick={openAdd}>
                            Add Recipe
                        </button>
                    </div>

                    <div className="card-list">
                        {recipes.map((r) => (
                            <article key={r.id} className="card">
                                <div className="header-with-btn">
                                    <h3>{r.name}</h3>
                                    <button onClick={() => openEdit(r)}>
                                        Edit
                                    </button>
                                </div>
                                <img className="pic" src={r.imgSrc} alt={r.alt} />
                                <p>{r.ingredients}</p>
                            </article>

                        ))}
                    </div>
                </div>
            </main>


            <EditRecipeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                mode={modalMode}
                recipe={activeRecipe}
            />
        </>

    )
}