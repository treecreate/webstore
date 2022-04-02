export interface CatalogItem {
  title: string;
  descriptionEn: string;
  descriptionDk: string;
  prices: number[];
  imgSrc: string;
  specialOffer?: string;
  routerLink: string;
}

const familyTree: CatalogItem = {
  title: 'Family Tree',
  descriptionEn: 'skrt skrt',
  descriptionDk: 'lol lol lol',
  prices: [499, 699, 999],
  imgSrc: '/assets/img/product-display-img/family-tree.jpg',
  specialOffer: '30% off when purchasing 2',
  routerLink: 'family-tree',
};

const quotable: CatalogItem = {
  title: 'Quotable',
  descriptionEn: 'skrt skrt',
  descriptionDk: 'lol lol lol',
  prices: [349, 499, 699],
  imgSrc: '/assets/img/description2.jpg',
  specialOffer: '30% off when purchasing 2',
  routerLink: 'quotable',
};

const unique: CatalogItem = {
  title: 'Special order',
  descriptionEn: 'skrt skrt',
  descriptionDk: 'lol lol lol',
  prices: [],
  imgSrc: '/assets/img/description2.jpg',
  specialOffer: 'Lets see what we can do for you',
  routerLink: 'unique',
};

const catalogList: CatalogItem[] = [familyTree, quotable, unique];

export default catalogList;
