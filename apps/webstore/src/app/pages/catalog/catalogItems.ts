export interface CatalogItem {
    productTitle: string;
    descriptionEn: string;
    descriptionDk: string;
    prices: number[];
    imgSrc: string;
    specialOffer?: string;
    routerLink: string;
}
  
const familyTree: CatalogItem = {
    productTitle: 'Family Tree',
    descriptionEn: 'skrt skrt',
    descriptionDk: 'lol lol lol',
    prices: [499, 699, 999],
    imgSrc: '',
    specialOffer: '30% off when purchasing 2',
    routerLink: '/familytree'
}

const quotable: CatalogItem = {
    productTitle: 'Quotable',
    descriptionEn: 'skrt skrt',
    descriptionDk: 'lol lol lol',
    prices: [349, 499, 699],
    imgSrc: '',
    specialOffer: '30% off when purchasing 2',
    routerLink: '/quotable'
}

const unique: CatalogItem = {
    productTitle: 'Special order',
    descriptionEn: 'skrt skrt',
    descriptionDk: 'lol lol lol',
    prices: [],
    imgSrc: '',
    specialOffer: 'Lets see what we can do for you',
    routerLink: '/unique'
}

const catalogList: CatalogItem[] = [
    familyTree,
    quotable,
    unique
] 