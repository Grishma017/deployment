const newariImage =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Newari_Foods.jpg/1280px-Newari_Foods.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail'

function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          A little taste of <em>home wherever you are</em>
        </h1>
        <p className="hero-description">
          Swad is a Nepali food and recipe-sharing platform dedicated to
          celebrating the richness of Nepalese cuisine. It allows food lovers
          to discover traditional Nepali dishes, explore authentic recipes,
          learn about ingredients and cooking methods, and share their own
          recipes with others. Swad aims to preserve Nepal&apos;s food culture
          and bring the taste of home closer to everyone, wherever they are.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#recipes">
            Explore recipes
          </a>
          <a className="text-link" href="#culture">
            Our food culture
          </a>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-photo-frame">
          <img
            className="hero-photo"
            src={newariImage}
            alt="A spread of traditional Newari dishes served together"
          />
          <div className="hero-photo-label">
            <strong>Newari feast</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
