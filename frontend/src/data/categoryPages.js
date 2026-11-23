import { categoryPhotos } from './categories.js'

export const categoryPages = {
  'main-course': {
    title: 'Main Course',
    description:
      'Hearty meals from Nepali kitchens, from everyday dal bhat to regional soups and curries.',
    recipes: [
      {
        name: 'Dal Bhat Tarkari',
        description: 'Dal, rice and seasonal tarkari in a balanced everyday meal.',
        cookTime: '60 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Dal_Bhat_Tarkari_Aachar.jpg/960px-Dal_Bhat_Tarkari_Aachar.jpg',
        imageAlt: 'Dal bhat served with rice, lentils and vegetable curry',
      },
      {
        name: 'Chicken Thukpa',
        description: 'A Himalayan noodle soup with chicken and warming broth.',
        cookTime: '50 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Chicken_Thukpa.jpg/960px-Chicken_Thukpa.jpg',
        imageAlt: 'A bowl of chicken thukpa, a Nepali noodle soup',
      },
      {
        name: 'Kwati',
        description: 'A nourishing mixed-bean soup traditionally enjoyed at Janai Purnima.',
        cookTime: '90 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Buba_kwati.jpg/960px-Buba_kwati.jpg',
        imageAlt: 'A bowl of Buba kwati, mixed beans with pieces of flatbread',
      },
      {
        name: 'Aalu Bodi Tama',
        description: 'Potatoes, beans and fermented bamboo shoots in a tangy curry.',
        cookTime: '45 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Aalu_Bodi_Tama_3.jpg/960px-Aalu_Bodi_Tama_3.jpg',
        imageAlt: 'Aalu bodi tama with potatoes, beans and bamboo shoots',
      },
      {
        name: 'Dhido Set',
        description: 'Traditional millet or buckwheat dhido served with accompaniments.',
        cookTime: '45 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Dhido.jpg/960px-Dhido.jpg',
        imageAlt: 'A Nepali dhido set khana meal',
      },
      {
        name: 'Nepali Chicken Curry',
        description: 'Chicken simmered in a fragrant Nepali spice gravy.',
        cookTime: '60 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Chicken_Curry-Wikicamp_Nepal_2018-Day_03-5355.jpg/960px-Chicken_Curry-Wikicamp_Nepal_2018-Day_03-5355.jpg',
        imageAlt: 'Nepali chicken curry prepared at Wikicamp Nepal',
      },
    ],
  },
  snacks: {
    title: 'Snacks',
    description:
      'Savory favorites from Nepali street stalls, tea tables and Newari kitchens.',
    recipes: [
      {
        name: 'Momo',
        description: 'Hand-folded dumplings served with a bright tomato achar.',
        cookTime: '45 min',
        difficulty: 'Medium',
        image: categoryPhotos.momo,
        imageAlt: 'Nepali buff momo served with dipping sauce',
      },
      {
        name: 'Chatpate',
        description: 'A tangy mix of puffed rice, crisp noodles, potato and spices.',
        cookTime: '15 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Chatpate_13.jpg/960px-Chatpate_13.jpg',
        imageAlt: 'A plate of Nepali chatpate',
      },
      {
        name: 'Bara',
        description: 'A savory lentil pancake from Newari kitchens.',
        cookTime: '40 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Bara_%2872062%29.jpg/960px-Bara_%2872062%29.jpg',
        imageAlt: 'Bara, a savory Newari lentil pancake',
      },
      {
        name: 'Chatamari',
        description: 'A thin rice-flour crepe topped with savory ingredients.',
        cookTime: '35 min',
        difficulty: 'Medium',
        image: categoryPhotos.chatamari,
        imageAlt: 'Newari meat chatamari, a savory rice-flour crepe',
      },
      {
        name: 'Samosa',
        description: 'Crisp pastry filled with spiced potato, a popular tea-time snack.',
        cookTime: '40 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Samosa_4.jpg/960px-Samosa_4.jpg',
        imageAlt: 'Golden triangular samosas',
      },
      {
        name: 'Bread Pakora',
        description: 'Bread with spiced potato, coated in batter and fried until crisp.',
        cookTime: '25 min',
        difficulty: 'Easy',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bread_Pakora_%28Bread_Pakoda%29.jpg',
        imageAlt: 'Crisp bread pakora served as a savory snack',
      },
    ],
  },
  desserts: {
    title: 'Desserts',
    description:
      'Traditional sweets and comforting treats shared at festivals and family gatherings.',
    recipes: [
      {
        name: 'Sel Roti',
        description: 'Golden ring-shaped rice bread made for festive mornings.',
        cookTime: '30 min',
        difficulty: 'Medium',
        image: categoryPhotos.selRoti,
        imageAlt: 'Traditional Nepali sel roti, golden and freshly made',
      },
      {
        name: 'Yomari',
        description: 'A steamed rice-flour dumpling filled with chaku and sesame.',
        cookTime: '50 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Yomari_2.jpg/960px-Yomari_2.jpg',
        imageAlt: 'Yomari, a traditional Newari steamed sweet',
      },
      {
        name: 'Juju Dhau',
        description: 'Rich, thick yogurt traditionally set in clay pots in Bhaktapur.',
        cookTime: 'Chill overnight',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Juju_Dhau.jpg/960px-Juju_Dhau.jpg',
        imageAlt: 'Juju dhau, thick Newari yogurt in a clay pot',
      },
      {
        name: 'Lal Mohan',
        description: 'Soft, syrup-soaked milk sweets served on special occasions.',
        cookTime: '60 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Lal_Mohan_1.jpg/960px-Lal_Mohan_1.jpg',
        imageAlt: 'Lal mohan, a traditional Nepali syrup-soaked sweet',
      },
      {
        name: 'Kheer',
        description: 'Slow-cooked rice pudding enjoyed during festivals and family meals.',
        cookTime: '50 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Kheer_Khane_Din_.jpg/960px-Kheer_Khane_Din_.jpg',
        imageAlt: 'Nepali kheer rice pudding',
      },
      {
        name: 'Lakhamari',
        description: 'A crisp, intricately shaped Newari sweet for celebrations.',
        cookTime: '90 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Lakha_Mari_.jpeg/960px-Lakha_Mari_.jpeg',
        imageAlt: 'Lakhamari, a traditional Newari sweet',
      },
    ],
  },
  drinks: {
    title: 'Drinks',
    description:
      'Warming cups and traditional drinks enjoyed across Nepal’s hills, towns and homes.',
    recipes: [
      {
        name: 'Masala Chiya',
        description: 'Milk tea simmered with warming spices.',
        cookTime: '10 min',
        difficulty: 'Easy',
        image: categoryPhotos.chiya,
        imageAlt: 'A cup of Nepali chiya served with sel roti',
      },
      {
        name: 'Butter Tea',
        description: 'A savory Himalayan tea blended with butter and a little salt.',
        cookTime: '10 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Butter_Milk_Tea.jpg/960px-Butter_Milk_Tea.jpg',
        imageAlt: 'A cup of butter milk tea in Nepal',
      },
      {
        name: 'Tongba',
        description: 'Warm water poured over fermented millet in a traditional vessel.',
        cookTime: '10 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Tongba.jpg/960px-Tongba.jpg',
        imageAlt: 'Tongba, a traditional millet drink served warm',
      },
      {
        name: 'Chhyang',
        description: 'A traditional fermented rice drink shared in many Nepali communities.',
        cookTime: 'Serve chilled',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Chhyang_or_Chhaang_-_Fermented_rice_drink%21_%288902831091%29.jpg/960px-Chhyang_or_Chhaang_-_Fermented_rice_drink%21_%288902831091%29.jpg',
        imageAlt: 'A glass of chhyang, a fermented rice drink',
      },
      {
        name: 'Mango Lassi',
        description: 'A cooling yogurt drink served at Nepali eateries.',
        cookTime: '10 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Coffee%2C_Nepalese_milk_tea_and_mango_lassi_at_Villa_Nepal_Spice_in_November_2024.jpg/960px-Coffee%2C_Nepalese_milk_tea_and_mango_lassi_at_Villa_Nepal_Spice_in_November_2024.jpg',
        imageAlt: 'Mango lassi served at a Nepali restaurant',
      },
      {
        name: 'Sugarcane Juice',
        description: 'Freshly pressed sugarcane juice sold by local vendors.',
        cookTime: '10 min',
        difficulty: 'Easy',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Sugarcane_Juice_1.jpg/960px-Sugarcane_Juice_1.jpg',
        imageAlt: 'Fresh sugarcane juice in a glass in Nepal',
      },
    ],
  },
  'traditional-newari-food': {
    title: 'Traditional Newari Food',
    description:
      'Distinctive dishes and festive plates shaped by the food traditions of the Newar community.',
    recipes: [
      {
        name: 'Chatamari',
        description: 'A crisp rice-flour crepe topped with savory ingredients.',
        cookTime: '35 min',
        difficulty: 'Medium',
        image: categoryPhotos.chatamari,
        imageAlt: 'Newari meat chatamari, a savory rice-flour crepe',
      },
      {
        name: 'Samay Baji',
        description: 'A ceremonial platter of beaten rice, savory sides and achar.',
        cookTime: '60 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Samay_Baji_-_Newar_Culture.jpg/960px-Samay_Baji_-_Newar_Culture.jpg',
        imageAlt: 'Samay baji, a traditional Newar food offering',
      },
      {
        name: 'Choila',
        description: 'Smoky grilled meat tossed with spices, herbs and mustard oil.',
        cookTime: '55 min',
        difficulty: 'Medium',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Chhwela.jpg',
        imageAlt: 'Chhwela, a traditional Newari meat dish',
      },
      {
        name: 'Bara',
        description: 'A savory lentil pancake often served with achar or egg.',
        cookTime: '40 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Bara_%2872062%29.jpg/960px-Bara_%2872062%29.jpg',
        imageAlt: 'Bara, a savory Newari lentil pancake',
      },
      {
        name: 'Yomari',
        description: 'A steamed rice-flour dumpling filled with chaku and sesame.',
        cookTime: '50 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Yomari_2.jpg/960px-Yomari_2.jpg',
        imageAlt: 'Yomari, a traditional Newari steamed sweet',
      },
      {
        name: 'Lakhamari',
        description: 'A crisp, intricately shaped sweet served at Newari celebrations.',
        cookTime: '90 min',
        difficulty: 'Medium',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Lakha_Mari_.jpeg/960px-Lakha_Mari_.jpeg',
        imageAlt: 'Lakhamari, a traditional Newari sweet',
      },
    ],
  },
}
