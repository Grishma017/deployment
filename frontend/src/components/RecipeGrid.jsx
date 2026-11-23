import { useState, useEffect } from 'react'
import CategoryFilter from './CategoryFilter.jsx'
import RecipeCard from './RecipeCard.jsx'
import RecipeDetailModal from './RecipeDetailModal.jsx'
import { categories, categoryPhotos } from '../data/categories.js'
import { getRecipes } from '../services/api.js'

// Curated default recipes in case backend is offline or empty initially
const defaultRecipes = [
  {
    name: 'Momo',
    categories: ['Snacks'],
    description: 'Hand-folded dumplings with tomato achar',
    cookTime: '45 min',
    difficulty: 'Medium',
    image: categoryPhotos.momo,
    imageAlt: 'Nepali buff momo served with dipping sauce',
    ingredients: [
      '2 cups all-purpose flour',
      '500g minced meat or minced seasonal vegetables',
      '1 large onion, minced',
      '1 tbsp ginger-garlic paste',
      '1 tsp momo masala',
      'Fresh coriander leaves',
    ],
    instructions: [
      'Knead dough and rest for 25 minutes.',
      'Mix meat or vegetables with minced onions, ginger-garlic paste, and seasonings.',
      'Roll into small rounds, fill with stuffing, and pleat carefully.',
      'Steam in an oiled steamer for 12 to 14 minutes. Serve with hot tomato achar.',
    ],
  },
  {
    name: 'Dal Bhat Tarkari',
    categories: ['Main Course'],
    description: 'Lentils, rice and seasonal tarkari for an everyday meal',
    cookTime: '55 min',
    difficulty: 'Easy',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Dal_Bhat_Tarkari_Aachar.jpg/960px-Dal_Bhat_Tarkari_Aachar.jpg',
    imageAlt: 'Nepali dal bhat with rice, lentils and seasonal tarkari',
    ingredients: [
      '1.5 cups rice',
      '1 cup yellow lentils (musuro dal)',
      'Assorted seasonal vegetables',
      'Turmeric, cumin, and mustard oil',
      'Pure ghee for tempering',
    ],
    instructions: [
      'Cook rice in water until soft and fluffy.',
      'Boil lentils with turmeric and salt; temper with cumin in hot ghee.',
      'Saute seasonal vegetables with spices.',
      'Serve hot together with homemade spicy achar.',
    ],
  },
  {
    name: 'Chatamari',
    categories: ['Traditional Newari Food', 'Snacks'],
    description: 'A crisp rice flour crepe from Newar kitchens',
    cookTime: '35 min',
    difficulty: 'Medium',
    image: categoryPhotos.chatamari,
    imageAlt: 'Newari meat chatamari, a savory rice-flour crepe',
    ingredients: [
      '1.5 cups rice flour',
      '200g minced meat',
      '1 egg',
      'Minced onion, green chilies, cilantro',
      'Mustard oil',
    ],
    instructions: [
      'Make a thin batter of rice flour and water.',
      'Pour batter onto a hot greased flat pan.',
      'Top immediately with seasoned minced meat and egg.',
      'Cover with lid and cook until bottom is crispy.',
    ],
  },
]

function RecipeGrid({ searchQuery, onSearchChange }) {
  const [recipes, setRecipes] = useState(defaultRecipes)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Fetch live recipes from MongoDB API
  useEffect(() => {
    async function loadBackendRecipes() {
      try {
        const data = await getRecipes()
        if (Array.isArray(data) && data.length > 0) {
          setRecipes(data)
        }
      } catch (err) {
        // Quiet fallback to curated defaults
      }
    }
    loadBackendRecipes()
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRecipes = recipes.filter((recipe) => {
    const cats = Array.isArray(recipe.categories)
      ? recipe.categories.join(' ')
      : recipe.category || ''
    const searchableText =
      `${recipe.name} ${recipe.description || ''} ${cats}`.toLowerCase()
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery)

    return matchesSearch
  })

  // Show only 3 recipes on homepage (no search), all when searching
  const displayedRecipes = normalizedQuery ? filteredRecipes : filteredRecipes.slice(0, 3)

  return (
    <>
      <section
        className="category-section"
        id="categories"
        aria-labelledby="categories-title"
      >
        <div className="content-width">
          <div className="section-heading category-heading">
            <h2 id="categories-title">Explore by category</h2>
          </div>
          <CategoryFilter categories={categories} />
        </div>
      </section>

      <section
        className="popular-section"
        id="recipes"
        aria-labelledby="recipes-title"
      >
        <div className="content-width">
          <div className="section-heading popular-heading">
            <h2 id="recipes-title">
              {normalizedQuery ? 'Recipes for your table' : 'Popular Nepali recipes'}
            </h2>
          </div>

          {normalizedQuery && (
            <p className="search-summary" aria-live="polite">
              Search results for "{searchQuery.trim()}" ({filteredRecipes.length} found)
            </p>
          )}

          {displayedRecipes.length > 0 ? (
            <div className="recipe-grid" aria-live="polite">
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  recipe={recipe}
                  key={recipe._id || recipe.name}
                  onSelect={(r) => setSelectedRecipe(r)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-recipes" role="status">
              <h3>No recipes match your search</h3>
              <p>Try a different keyword or clear your search</p>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  onSearchChange('')
                }}
              >
                Show all recipes
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Full recipe detail modal on click */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  )
}

export default RecipeGrid
