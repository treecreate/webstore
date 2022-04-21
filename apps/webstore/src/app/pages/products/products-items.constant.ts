export interface ProductsItem {
  titleEn: string;
  titleDk: string;
  descriptionEn: string;
  descriptionDk: string;
  prices: number[];
  imgSrc: string;
  specialOffer?: string;
  routerLink: string;
}

const familyTree: ProductsItem = {
  titleEn: 'Family Tree',
  titleDk: 'Familietræ',
  descriptionEn: 'Create your own family tree by adding the names of your family.',
  descriptionDk: 'Lav dit eget stamtræ ved at skrive din families navne ind.',
  prices: [499, 699, 999],
  imgSrc: '/assets/img/product-display-img/family-tree.jpg',
  specialOffer: '30% off when purchasing 2',
  routerLink: 'family-tree',
};

const quotable: ProductsItem = {
  titleEn: 'Quote frame',
  titleDk: 'Citatramme',
  descriptionEn: 'Select a frame and write a quote to someone you care about.',
  descriptionDk: 'Vælg en ramme og skriv et citat til den du holder af.',
  prices: [299, 399, 499],
  imgSrc: '/assets/img/description2.jpg',
  specialOffer: '- 30% off when purchasing 2',
  routerLink: 'quotable',
};

const unique: ProductsItem = {
  titleEn: 'Custom order',
  titleDk: 'Special bestilling',
  descriptionEn:
    'Send an image or describe what you want. We will see what we can create for you and give you a price.',
  descriptionDk: 'Send et billede og bescrib hvad du vil have. We ser hvad vi kan gøre for dig og giver dig en pris.',
  prices: [],
  imgSrc: '/assets/img/description2.jpg',
  specialOffer: '- Logo, Tegning, Billede eller noget helt andet.',
  routerLink: 'unique',
};

const productsList: ProductsItem[] = [familyTree, quotable, unique];

export default productsList;
