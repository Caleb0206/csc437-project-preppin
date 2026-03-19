import {useState, useMemo} from "react";
import {EditRecipeModal} from "../components/modals/EditRecipeModal.jsx";

const PLACEHOLDER_IMG = "https://placehold.co/500x200";

export function RecipesPage({recipes, setRecipes, recipesLoading, recipesError}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [activeRecipeId, setActiveRecipeId] = useState(null);
    const [saveError, setSaveError] = useState("");

    const activeRecipe = useMemo(() => {
        if (activeRecipeId == null) return null;
        return recipes.find((r) => r._id === activeRecipeId) ?? null;
    }, [activeRecipeId, recipes]);

    function openAdd() {
        setSaveError("");
        setModalMode("add");
        setActiveRecipeId(null);
        setIsModalOpen(true);
    }

    function openEdit(recipe) {
        setSaveError("");
        setModalMode("edit");
        setActiveRecipeId(recipe._id);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    async function handleSave(values) {
        const name = values.name.trim();
        const ingredients = values.ingredients.trim();

        if (!name) return;

        try {
            setSaveError("");
            if (modalMode === "add") {
                const response = await fetch("/api/recipes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        ingredients,
                        imgSrc: PLACEHOLDER_IMG,
                        alt: "placeholder-blank",
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to create recipe");
                }
                const newRecipe = await response.json();
                setRecipes((prev) => [...prev, newRecipe]);
                closeModal();
                return;
            }
            const response = await fetch(`/api/recipes/${activeRecipeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    ingredients,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to update recipe");
            }
            const updatedRecipe = await response.json();
            setRecipes((prev) =>
                prev.map((r) => (r._id === activeRecipeId ? updatedRecipe : r))
            );
            closeModal();
        } catch (e) {
            console.error(e);
            setSaveError("Could not save recipe");
        }

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

                    {recipesLoading && <p>Loading recipes...</p>}
                    {recipesError && <p>{recipesError}</p>}
                    {saveError && <p>{saveError}</p>}

                    {!recipesLoading && !recipesError && (
                        <div className="card-list">
                            {recipes.map((r) => (
                                <article key={r._id} className="card">
                                    <div className="header-with-btn">
                                        <h3>{r.name}</h3>
                                        <button type="button" onClick={() => openEdit(r)}>
                                            Edit
                                        </button>
                                    </div>
                                    <img className="pic" src={r.imgSrc} alt={r.alt}/>
                                    <p>{r.ingredients}</p>
                                </article>

                            ))}
                        </div>
                    )}
                </div>
            </main>


            <EditRecipeModal
                key={`${modalMode}-${activeRecipeId ?? "new"}`}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                mode={modalMode}
                recipe={activeRecipe}
            />
        </>

    )
}