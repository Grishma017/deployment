const dalBhatImage =
  'https://upload.wikimedia.org/wikipedia/commons/6/61/2015-03-09_Dalbath_of_Yin_Yang_Restaurant_in_Thamel%2C_Kathmandu%2C_Nepal_%E3%83%80%E3%83%AB%E3%83%90%E3%83%BC%E3%83%88_DSCF6286.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original'

function CultureSection() {
  return (
    <section
      className="culture-section"
      id="culture"
      aria-labelledby="culture-title"
    >
      <div className="culture-inner content-width">
        <div className="culture-image-wrap">
          <img
            src={dalBhatImage}
            alt="Dal bhat served at a restaurant in Kathmandu"
            className="culture-image"
          />
        </div>
        <div className="culture-copy">
          <h2 id="culture-title">
            Every dish carries a little piece of <em>where we come from</em>
          </h2>
          <p>
            Nepali food reflects the country’s landscapes, seasons and
            communities. Dal bhat is part of daily life in many homes, while
            Newari feasts bring family and neighbors together.
          </p>
          <a className="culture-link" href="#recipes">
            Meet the recipes
          </a>
        </div>
      </div>
    </section>
  )
}

export default CultureSection
