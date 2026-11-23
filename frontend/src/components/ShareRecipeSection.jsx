function ShareRecipeSection() {
  return (
    <section className="share-section" id="share" aria-labelledby="share-title">
      <div className="share-inner content-width">
        <div className="share-copy">
          <h2 id="share-title">Have a recipe that tastes like home?</h2>
          <p>
            Share a family recipe and the story behind it
          </p>
        </div>
        <div className="share-action">
          <a className="button button-light" href="/user/login">
            Share a Recipe
          </a>
        </div>
      </div>
    </section>
  )
}

export default ShareRecipeSection
