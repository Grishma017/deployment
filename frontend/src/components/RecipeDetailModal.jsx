function RecipeDetailModal({ recipe, onClose }) {
  if (!recipe) return null

  return (
    <div
      className="admin-modal-backdrop"
      style={{ zIndex: 1200 }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="admin-modal-dialog"
        style={{
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            {recipe.categories && recipe.categories.length > 0 && (
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--red)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                }}
              >
                {Array.isArray(recipe.categories)
                  ? recipe.categories.join(' • ')
                  : recipe.category || recipe.categories}
              </span>
            )}
            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.85rem',
                margin: 0,
                color: 'var(--ink)',
              }}
            >
              {recipe.name}
            </h2>
          </div>

          <button
            type="button"
            className="admin-button-secondary admin-button-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕ Close
          </button>
        </div>

        {recipe.image && (
          <div
            style={{
              width: '100%',
              height: 260,
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 20,
              border: '1px solid var(--line)',
            }}
          >
            <img
              src={recipe.image}
              alt={recipe.imageAlt || recipe.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'
              }}
            />
          </div>
        )}

        {recipe.description && (
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {recipe.description}
          </p>
        )}

        {/* Cooking metadata chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 24,
            padding: '12px 16px',
            backgroundColor: 'var(--canvas)',
            borderRadius: 8,
            fontSize: '0.9rem',
          }}
        >
          {recipe.prepTime !== undefined && (
            <div>
              <strong>Prep: </strong> {recipe.prepTime} min
            </div>
          )}
          {recipe.cookTime && (
            <div>
              <strong>Cook: </strong> {typeof recipe.cookTime === 'number' ? `${recipe.cookTime} min` : recipe.cookTime}
            </div>
          )}
          {recipe.servings && (
            <div>
              <strong>Servings: </strong> {recipe.servings}
            </div>
          )}
          {recipe.difficulty && (
            <div>
              <strong>Difficulty: </strong>{' '}
              <span
                className={`difficulty-pill ${(recipe.difficulty || 'Easy').toLowerCase()}`}
              >
                {recipe.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.25rem',
                marginBottom: 10,
                color: 'var(--ink)',
              }}
            >
              Ingredients
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.7 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ color: 'var(--ink)' }}>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.25rem',
                marginBottom: 10,
                color: 'var(--ink)',
              }}
            >
              Cooking Method
            </h3>
            <ol style={{ paddingLeft: 20, margin: 0, lineHeight: 1.7 }}>
              {recipe.instructions.map((step, i) => (
                <li key={i} style={{ marginBottom: 8, color: 'var(--ink)' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <button
            type="button"
            className="admin-button-primary"
            onClick={onClose}
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailModal
