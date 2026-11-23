export const categoryPhotos = {
  momo:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Buff_Momo_1.jpg/960px-Buff_Momo_1.jpg',
  selRoti: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Sel_Roti.jpg',
  chiya:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Chiya_Sel_Roti.jpg/960px-Chiya_Sel_Roti.jpg',
  chatamari:
    'https://upload.wikimedia.org/wikipedia/commons/e/e9/Meat_Chatamari.jpg',
  newari:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Newari_Foods.jpg/1280px-Newari_Foods.jpg',
}

export const categories = [
  {
    name: 'Main Course',
    slug: 'main-course',
    href: '/main-course',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Dal_Bhat_Tarkari_Aachar.jpg/960px-Dal_Bhat_Tarkari_Aachar.jpg',
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    href: '/snacks',
    image: categoryPhotos.momo,
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    href: '/desserts',
    image: categoryPhotos.selRoti,
  },
  {
    name: 'Drinks',
    slug: 'drinks',
    href: '/drinks',
    image: categoryPhotos.chiya,
  },
  {
    name: 'Traditional Newari Food',
    slug: 'traditional-newari-food',
    href: '/traditional-newari-food',
    image: categoryPhotos.newari,
  },
]

