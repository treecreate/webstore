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
    'The Treecreate family tree is for you if you want to give your family a gift to remember. Design your own family tree and have it carved in beautiful oak wood. If you are looking for this years best christmas gift, this if for you.',
  descriptionDk:
    'Treecreate Familietræet er for dig, der vil give din familie en gave de aldrig glemmer. Design dit eget familietræ og få det skåret træ (eg) af høj kvalitet. Hvis du leder efter årets julegave 2022, så er Treecreate familietræet noget for dig',
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
    "With the Treecreate Quotable you get the opportunity to write a special message carved in oak wood to the one you love. Quotable is a unique and personal way of giving the perfect gift. Its even environmental like Treecreate's other products.",
  descriptionDk:
    "Med Treecreate's citat ramme, får du muligheden for at skrive en hilsen eller en tekst i egetræ til en du elsker. Quotable er en unik og personlig måde at give en hilsen eller gave på. Og så er den endda miljøvenlig ligesom Treecreate's andre produkter.",
  prices: [299, 399, 499],
  imgSrc: '/assets/img/quotable-img/quotable-02.jpg',
  altText: 'En smuk citat ramme med dit personlige citat på. Perfekt som gave.',
  specialOffer: '- 25% off when purchasing 4',
  routerLink: 'quotable',
};

const unique: ProductsItem = {
  titleEn: 'Custom order',
  titleDk: 'Specialbestilling',
  descriptionEn:
    'A unique chance to bring out your message in your own way. Get a completely user defined engraved piece of wood. Your own images and descriptions to what the design should be.',
  descriptionDk:
    'En enestående mulighed for at bringe dit billede eller design ud på. Få lavet en fuldkommen brugerdefineret design skåret i egetræ. Med Treecreate kan du skabe noget helt unikt på dine egne vilkår.',
  prices: [399],
  imgSrc: '/assets/img/component-images/custom-image.jpg',
  altText: 'Dit unikke produkt. Præcis som du vil have det.',
  specialOffer: '- Logo, Tegning, Billede eller noget helt andet.',
  routerLink: 'custom-order',
};

const productsList: ProductsItem[] = [quotable, familyTree, unique];

export default productsList;
