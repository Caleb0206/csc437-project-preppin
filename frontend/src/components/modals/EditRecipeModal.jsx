import { useEffect, useState } from "react";

export function EditRecipeModal({
    isOpen,
    onClose,
    onSave,
    mode,
    recipe,
}) {
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && recipe) {
            setName(recipe.name ?? "");
            setIngredients(recipe.ingredients ?? "");
        } else {
            setName("");
            setIngredients("");
        }
    }, [isOpen, mode, recipe]);

    useEffect(() => {
        if (!isOpen) return;

        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const title = mode === "add" ? "Add Recipe" : "Edit Recipe";

    function handleSubmit(e) {
        e.preventDefault();
        onSave({ name, ingredients });
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-labelledby="Edit Recipe Modal"
            id="edit-recipe-dialog"
        >

            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
            >
                <form className="edit-recipe-form" onSubmit={handleSubmit}>
                    <header className="dialog-header">
                        <h2 id="edit-recipe-title">{title}</h2>
                        <button
                            type="button"
                            value="cancel"
                            aria-label="Close"
                            onClick={onClose}>
                            ✕
                        </button>
                    </header>
                    <div className="form-field">
                        <label htmlFor="recipe-name">Recipe name</label>
                        <input
                            id="recipe-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="recipe-img">Image</label>
                        <input id="recipe-img" type="file" accept="image/*" />
                    </div>


                    <div className="form-field">
                        <label htmlFor="ingredients">Ingredients</label>
                        <textarea
                            id="ingredients"
                            rows="4"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="List ingredients..."
                        />
                    </div>
                    <footer className="dialog-actions">
                        <button type="button" value="cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" value="confirm" className="primary">
                            Save
                        </button>
                    </footer>
                </form>

            </div>
        </div>
    )
}