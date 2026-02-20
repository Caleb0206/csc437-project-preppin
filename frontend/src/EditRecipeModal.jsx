import { useEffect } from "react";

export function EditRecipeModal({
    isOpen,
    onClose,
    mode = "edit",
    recipe = null,
}) {
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
                <div className="edit-recipe-form">
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
                        <input id="recipe-name" type="text" defaultValue={recipe?.name ?? ""} />
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
                            defaultValue={recipe?.ingredients ?? ""}
                            placeholder="List ingredients..."
                        />
                    </div>

                </div>
                <footer className="dialog-actions">
                    <button value="cancel" onClick={onClose}>Cancel</button>
                    <button value="confirm" className="primary" onClick={onClose}>
                        Save
                    </button>
                </footer>
            </div>
        </div>
    )
}