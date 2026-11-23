function CategoryFilter({ categories }) {
  return (
    <nav
      className="category-grid"
      aria-label="Recipe categories"
    >
      {categories.map((category) => (
        <a
          className="category-card"
          href={category.href}
          key={category.name}
        >
          <img src={category.image} alt="" className="category-image" />
          <span className="category-shade" aria-hidden="true" />
          <span className="category-content">
            <span className="category-name">{category.name}</span>
          </span>
        </a>
      ))}
    </nav>
  )
}

export default CategoryFilter
