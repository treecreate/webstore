import { QuotableType } from '@interfaces';

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
  productType?: string;
}

const familyTree: ProductsItem = {
  titleEn: 'Family Tree',
  titleDk: 'Familietræ',
  descriptionEn:
    'The Treecreate family tree is for you if you want to give your family a gift to remember. Design your own family tree and have it carved in beautiful oak wood. If you are looking for this years best christmas gift, this if for you.',
  descriptionDk:
    'Treecreate Familietræet er for dig, der vil give din familie en gave de aldrig glemmer. Design dit eget familietræ i bæredygtigt træ (eg). Hvis du leder efter årets julegave 2022, så er Treecreate familietræet noget for dig',
  prices: [499, 699, 999],
  imgSrc: '/assets/img/family-tree/family-tree-display-img/family-tree-02.jpg',
  altText: 'Et helt unikt familietræ perfekt som gave.',
  specialOffer: '',
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
  specialOffer: '',
  routerLink: 'quotable',
  productType: QuotableType.quotable,
};

const babySign: ProductsItem = {
  titleEn: 'Baby sign',
  titleDk: 'Baby skilt',
  descriptionEn:
    'Do you want a unique, personal and sustainable way to immortalize the memory of the birth of your child? Then you can design your very own Baby Sign which we will engrave on a nice piece of oakwood. The perfect gift for the fresh, new parent.',
  descriptionDk:
    'Ønsker du en unik, personlig og miljøvenlig måde at foreviggøre mindet om fødslen og dagen hvor dit spædbarn kom til verden? Så få designet dit helt eget Baby Skilt, som vi indgraverer på et lækkert stykke egetræ i høj kvalitet. Den perfekte gave til de nybagte forældre.',
  prices: [299, 399, 499],
  imgSrc: '/assets/img/quotable-img/quotable-02.jpg',
  altText: 'Et flot baby skilt. Perfekt som barnedåbs gave.',
  specialOffer: '',
  routerLink: 'quotable',
  productType: QuotableType.babySign,
};

const loveLetter: ProductsItem = {
  titleEn: 'Love letter',
  titleDk: 'Kærlighedsbrevet',
  descriptionEn:
    'With Treecreate’s Love Letter you will get the opportunity to give the most personal and unique gift to your significant other. Choose your own frame and write a message about how much you love each other. The perfect gift for the anniversary or a birthday.',
  descriptionDk:
    'Med Treecreates Kærlighedsbrev får du muligheden for at give den mest personlige og unikke gave til din kæreste. Vælg din egen ramme, og skriv en besked om hvor meget du elsker din partner. Den perfekte gave til årsdagen eller fødselsdag.',
  prices: [299, 399, 499],
  imgSrc: '/assets/img/quotable-img/quotable-02.jpg',
  altText: 'Et romantisk kærlighedsbrev skåret i egetræ.',
  specialOffer: '',
  routerLink: 'quotable',
  productType: QuotableType.loveLetter,
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
  specialOffer: '',
  routerLink: 'custom-order',
};

const productsList: ProductsItem[] = [quotable, babySign, loveLetter, familyTree, unique];

export default productsList;
