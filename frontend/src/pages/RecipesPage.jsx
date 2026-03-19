import {useState, useMemo} from "react";
import {EditRecipeModal} from "../components/modals/EditRecipeModal.jsx";

const PLACEHOLDER_IMG = "https://placehold.co/500x200";

export function RecipesPage({recipes, setRecipes, recipesLoading, recipesError, authToken}) {
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

            const formData = new FormData();
            formData.set("name", name);
            formData.set("ingredients", ingredients);

            if (values.imageFile) {
                formData.set("image", values.imageFile);
            }

            if (modalMode === "add") {
                const response = await fetch("/api/recipes", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: formData,
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
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to update recipe");
            }
            const updatedRecipe = await response.json();
            setRecipes((prev) =>
                prev.map((r) => (r._id === activeRecipeId ? updatedRecipe : r))
            );
            closeModal();
            return true;
        } catch (e) {
            console.error(e);
            setSaveError("Could not save recipe");
            return false;
        }
    }

    async function handleDelete(recipeId) {
        const confirmed = window.confirm("Delete this recipe?");
        if (!confirmed) return;
        try {
            setSaveError("");

            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete recipe");
            }

            setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
        } catch (e) {
            console.error(e);
            setSaveError("Could not delete recipe");
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
                    {recipesError && recipesError === "Could not load recipes" && (
                        <div>
                            <p>Add recipes!</p>
                        </div>
                    )}
                    {recipesError && <p>{recipesError}</p>}
                    {saveError && <p>{saveError}</p>}

                    {!recipesLoading && !recipesError && (
                        <div className="card-list">
                            {recipes.map((r) => (
                                <article key={r._id} className="card">
                                    <div className="recipe-card-actions">
                                        <h3>{r.name}</h3>
                                        <div className="recipe-card-buttons">
                                            <button type="button" onClick={() => openEdit(r)}>
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => handleDelete(r._id)}>
                                                Delete
                                            </button>
                                        </div>

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