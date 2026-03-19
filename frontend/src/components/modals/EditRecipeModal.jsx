import {useEffect, useState, useId} from "react";

const PLACEHOLDER_IMG = "https://placehold.co/500x200";

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}

export function EditRecipeModal({
                                    isOpen,
                                    onClose,
                                    onSave,
                                    mode,
                                    recipe,
                                }) {
    const fileInputId = useId();

    const [name, setName] = useState(() => recipe?.name ?? "");
    const [ingredients, setIngredients] = useState(() => recipe?.ingredients ?? "");
    const [imageFile, setImageFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(() => recipe?.imgSrc ?? "");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        function onKey(e) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    async function handleFileChange(e) {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);

        if (!file) {
            setPreviewSrc(recipe?.imgSrc ?? "");
            return;
        }

        try {
            const dataUrl = await readAsDataURL(file);
            setPreviewSrc(dataUrl);
        } catch (error) {
            console.error(error);
            setSubmitError("Could not preview selected image.");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");

        const ok = await onSave({
            name,
            ingredients,
            imageFile
        });

        if (!ok) {
            setSubmitError("Could not save recipe.");
        }
    }

    if (!isOpen) return null;

    const title = mode === "add" ? "Add Recipe" : "Edit Recipe";

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-labelledby="edit-recipe-title"
            id="edit-recipe-dialog"
        >

            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-recipe-title"
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

                    {submitError && (
                        <p className="form-error" role="alert">
                            {submitError}
                        </p>
                    )}

                    <div className="form-field">
                        <label htmlFor="recipe-name">Recipe name</label>
                        <input
                            id="recipe-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={fileInputId}>Choose image to upload</label>
                        <input
                            id={fileInputId}
                            name="image"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="form-field">
                        <img
                            className="pic"
                            src={previewSrc || PLACEHOLDER_IMG}
                            alt="preview"
                        />
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