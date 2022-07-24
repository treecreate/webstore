export interface ProductsItem {
  titleEn: string;
  titleDk: string;
  descriptionEn: string;
  descriptionDk: string;
  prices: number[];
  imgSrc: string;
  altText: string;
  specialOffer?: string;
  routerLink: string;
}

const familyTree: ProductsItem = {
  titleEn: 'Family Tree',
  titleDk: 'Familietræ',
  descriptionEn:
    'Create your own unique family tree by adding the names of your family. Give a completely unique present to the one you care about.',
  descriptionDk:
    'Lav dit personlige stamtræ ved at skrive din families navne ind. Giv en helt unik gave til den du holder af.',
  prices: [499, 699, 999],
  imgSrc: '/assets/img/family-tree/family-tree-display-img/family-tree-02.jpg',
  altText: 'Et helt unikt familietræ perfekt som gave.',
  specialOffer: '- 25% off when purchasing 4',
  routerLink: 'family-tree',
};

const quotable: ProductsItem = {
  titleEn: 'Quotable',
  titleDk: 'Citat ramme',
  descriptionEn:
    'Select a frame and select a quote or write one yourself to someone you care about. Perfect for birthday, valentines day, chirsmas and other events.',
  descriptionDk:
    'Vælg en ramme og vælg et citat eller skriv selv hvad du vil sige til den du holder af. Perfect til fødselsdage, valentins dag, jul og andre begivenheder.',
  prices: [299, 399, 499],
  imgSrc: '/assets/img/quotable-img/quotable-02.jpg',
  altText: 'En smuk citat ramme med dit personlige citat på. Perfekt som gave.',
  specialOffer: '- 25% off when purchasing 4',
  routerLink: 'quotable',
};

// const unique: ProductsItem = {
//   titleEn: 'Custom order',
//   titleDk: 'Special bestilling',
//   descriptionEn:
//     'Send an image or describe what you want. We will see what we can create for you and give you a price.',
//   descriptionDk: 'Send et billede og bescrib hvad du vil have. We ser hvad vi kan gøre for dig og giver dig en pris.',
//   prices: [],
//   imgSrc: '/assets/img/description2.jpg',
//   altText: 'Dit unikke produkt. Præcis som du vil have det.',
//   specialOffer: '- Logo, Tegning, Billede eller noget helt andet.',
//   routerLink: 'unique',
// };

const productsList: ProductsItem[] = [quotable, familyTree];

export default productsList;
