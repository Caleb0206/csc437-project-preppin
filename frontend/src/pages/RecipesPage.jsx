import { useState, useMemo } from "react";
import { EditRecipeModal } from "../components/modals/EditRecipeModal.jsx";

const PLACEHOLDER_IMG = "https://placehold.co/500x200";

export function RecipesPage({ recipes, setRecipes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [activeRecipeId, setActiveRecipeId] = useState(null);

    const activeRecipe = useMemo(() => {
        if (activeRecipeId == null) return null;
        return recipes.find((r) => r.id === activeRecipeId) ?? null;
    }, [activeRecipeId, recipes]);

    function openAdd() {
        setModalMode("add");
        setActiveRecipeId(null);
        setIsModalOpen(true);
    }

    function openEdit(recipe) {
        setModalMode("edit");
        setActiveRecipeId(recipe.id);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleSave(values) {
        const name = values.name.trim();
        const ingredients = values.ingredients.trim();

        if (!name) {
            alert("Recipe name is required.");
            return;
        }
        if (modalMode === "add") {
            const newRecipe = {
                id: crypto.randomUUID(),
                name,
                ingredients,
                imgSrc: PLACEHOLDER_IMG,
                alt: "placeholder-blank",
            };

            setRecipes((prev) => [...prev, newRecipe]);
            closeModal();
            return;
        }

        // edit mode
        setRecipes((prev) =>
            prev.map((r) =>
                r.id === activeRecipeId ? { ...r, name, ingredients } : r
            )
        );
        closeModal();
    }

    return (
        <>
            <main className="recipes-page">
                <div>
                    <div className="header-with-btn">
                        <h2>Recipes</h2>
                        <button type="button" onClick={openAdd}>
                            Add Recipe
                        </button>
                    </div>

                    <div className="card-list">
                        {recipes.map((r) => (
                            <article key={r.id} className="card">
                                <div className="header-with-btn">
                                    <h3>{r.name}</h3>
                                    <button type="button" onClick={() => openEdit(r)}>
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
                onSave={handleSave}
                mode={modalMode}
                recipe={activeRecipe}
            />
        </>

    )
}