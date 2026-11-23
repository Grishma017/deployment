function Footer({ homePath = '' }) {
  return (
    <footer className="site-footer">
      <div className="footer-main content-width">
        <div className="footer-brand">
          <a className="brand brand-footer" href="/" aria-label="Swad home">
            <span className="brand-lockup">
              <span className="brand-wordmark" aria-hidden="true">
                <span className="brand-script">स्वा</span>
                <svg className="brand-fork-d" viewBox="0 -8 32 48" fill="none">
                  <path d="M22 19v27M22 23c-2.5-2.7-5-4-9-4-6.3 0-10.8 5-10.8 13S6.7 44 13 44c4 0 7-1.7 9-4.5" />
                  <path d="M16-6v19m4-19v20m4-20v20m4-20v19m-12 0c0 4.5 2.5 7 6 7s6-2.5 6-7" />
                </svg>
              </span>
            </span>
          </a>
          <p>Nepali recipes and the stories behind them</p>
        </div>

        <div className="footer-column">
          <h2>Explore</h2>
          <a href={`${homePath}#categories`}>Categories</a>
          <a href={`${homePath}#recipes`}>Popular recipes</a>
          <a href={`${homePath}#culture`}>Food culture</a>
        </div>

        <div className="footer-column">
          <h2>Join the table</h2>
          <a href={`${homePath}#share`}>Share a recipe</a>
          <a href="/user/login" style={{ opacity: 0.85 }}>Join Community</a>
          <a href="/admin/login" style={{ opacity: 0.85 }}>Admin Portal</a>
        </div>
      </div>

      <div className="footer-bottom content-width">
        <span>© {new Date().getFullYear()} Swad</span>
        <details className="photo-credits">
          <summary>Food photo credits</summary>
          <p>
            Newari Foods by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Newari_Foods.jpg">
              Sufe
            </a>{' '}
            (CC BY-SA 4.0); Buff Momo by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Buff_Momo_1.jpg">
              Gaurav Dhwaj Khadka
            </a>{' '}
            (CC BY-SA 4.0); Sel Roti by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Sel_Roti.jpg">
              Swapnil Acharya
            </a>{' '}
            (CC BY-SA 3.0); Chiya Sel Roti by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Chiya_Sel_Roti.jpg">
              Gaurav Dhwaj Khadka
            </a>{' '}
            (CC BY-SA 4.0); Meat Chatamari by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Meat_Chatamari.jpg">
              Raunak Maskay
            </a>{' '}
            (CC BY-SA 4.0); Dal Bhat by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:2015-03-09_Dalbath_of_Yin_Yang_Restaurant_in_Thamel,_Kathmandu,_Nepal_%E3%83%80%E3%83%AB%E3%83%90%E3%83%BC%E3%83%88_DSCF6286.JPG">
              松岡明芳
            </a>{' '}
            (CC BY-SA 4.0); Dal Bhat Tarkari Aachar by{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Dal_Bhat_Tarkari_Aachar.jpg">
              Gaurav Dhwaj Khadka
            </a>{' '}
            {'('}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
            {'). '}
            <a href="https://commons.wikimedia.org/wiki/File:Chicken_Thukpa.jpg">
              Chicken Thukpa
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Buba_kwati.jpg">
              Buba kwati
            </a>{' '}
            by Karrattul (CC0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Aalu_Bodi_Tama_3.jpg">
              Aalu Bodi Tama
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Dhido.jpg">Dhido</a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Chicken_Curry-Wikicamp_Nepal_2018-Day_03-5355.jpg">
              Chicken Curry
            </a>{' '}
            by Bijay Chaurasia (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Chatpate_13.jpg">
              Chatpate
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Bara_(72062).jpg">
              Bara
            </a>{' '}
            by Janak Bhatta (CC BY 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Samosa_4.jpg">
              Samosa
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Bread_Pakora_(Bread_Pakoda).jpg">
              Bread Pakora
            </a>{' '}
            by SristiAwasthi21 (CC0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Yomari_2.jpg">
              Yomari
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Juju_Dhau.jpg">
              Juju Dhau
            </a>{' '}
            and{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Lal_Mohan_1.jpg">
              Lal Mohan
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Kheer_Khane_Din_.jpg">
              Kheer
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Lakha_Mari_.jpeg">
              Lakhamari
            </a>{' '}
            by Nirjal Stha (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Samay_Baji_-_Newar_Culture.jpg">
              Samay Baji
            </a>{' '}
            by Shristi24 (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Chhwela.jpg">
              Chhwela
            </a>{' '}
            by Rajivkilanashrestha (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Butter_Milk_Tea.jpg">
              Butter Milk Tea
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Tongba.jpg">
              Tongba
            </a>{' '}
            by Jweatherley (public domain);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Chhyang_or_Chhaang_-_Fermented_rice_drink!_(8902831091).jpg">
              Chhyang
            </a>{' '}
            by Sharada Prasad CS (CC BY 2.0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Coffee,_Nepalese_milk_tea_and_mango_lassi_at_Villa_Nepal_Spice_in_November_2024.jpg">
              Mango Lassi
            </a>{' '}
            by JIP (CC BY-SA 4.0); and{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Sugarcane_Juice_1.jpg">
              Sugarcane Juice
            </a>{' '}
            by Gaurav Dhwaj Khadka (CC BY-SA 4.0).
          </p>
        </details>
      </div>
    </footer>
  )
}

export default Footer
