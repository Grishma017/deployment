function RecipeCard({ recipe, showCategory = true, onSelect }) {
  const categoryLabel = Array.isArray(recipe.categories)
    ? recipe.categories[0]
    : recipe.category || (recipe.categories ? String(recipe.categories) : '')

  const cookTimeDisplay =
    typeof recipe.cookTime === 'number'
      ? `${recipe.cookTime} min`
      : recipe.cookTime || '—'

  return (
    <article
      className="recipe-card"
      onClick={() => onSelect && onSelect(recipe)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect(recipe)
        }
      }}
      aria-label={`View recipe details for ${recipe.name}`}
    >
      <div className="recipe-image-wrap">
        <img
          className="recipe-image"
          src={recipe.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'}
          alt={recipe.imageAlt || recipe.name}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'
          }}
        />
      </div>
      <div className="recipe-card-content">
        {showCategory && categoryLabel && (
          <span className="recipe-category">{categoryLabel}</span>
        )}
        <h3>{recipe.name}</h3>
        <p className="recipe-card-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span>{cookTimeDisplay}</span>
          <span className="recipe-difficulty">{recipe.difficulty || 'Easy'}</span>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
