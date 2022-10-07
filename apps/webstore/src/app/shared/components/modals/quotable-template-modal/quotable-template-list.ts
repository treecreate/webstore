import { IQuotableTemplate, QuotableType } from '@interfaces';

export const quotableTemplateList: IQuotableTemplate[] = [
  //    QUOTABLE
  {
    name: 'Til Farmor/Farfar',
    text: 'Det eneste bedre \nend at have dig som \nMOR/FAR\n\nEr at mine børn har dig\nsom FARMOR/FARFAR',
    showText: true,
    showTitle: false,
    title: '',
    fontSize: 20,
    type: QuotableType.quotable,
  },
  {
    name: 'Til Mor/Far',
    text: 'Jeg elsker dig MOR/FAR,\nsom træer elsker vand og solskin.\nDu hjælper mig med at vokse,\ntrives og nå nye højder.\n\nDin SØN/DATTER\nNAVN',
    showText: true,
    showTitle: false,
    title: '',
    fontSize: 20,
    type: QuotableType.quotable,
  },
  {
    name: 'Til Mor/Far 2',
    text: 'jeg vil gerne takke dig\nfor at have spillet en så utrolig\nrolle i mit liv.\n\nJeg elsker dig nu og for evigt.\nNAVN',
    showText: true,
    showTitle: true,
    title: 'Mor / Far',
    fontSize: 20,
    type: QuotableType.quotable,
  },
  //   LOVE LETTER
  {
    name: 'Til Ham/Hende',
    text: 'Jeg skrev dit navn i skyerne,\nmen vinden blæste det væk.\n\nJeg skrev dit navn i sandet,\nmen bølgerne skyllede det væk.\n\nJeg skrev dit navn i mit hjerte,\nog for evigt vil det blive der.',
    showText: true,
    showTitle: true,
    title: 'Navn',
    fontSize: 26,
    type: QuotableType.loveLetter,
  },
  //   BABY SIGN
  {
    name: 'Børne tavle',
    text: '\n01.01.21 - kl.00.00\n\n4000g - 50cm',
    showText: true,
    showTitle: true,
    title: 'Navn',
    fontSize: 30,
    type: QuotableType.babySign,
  },
  {
    name: 'Børne tavle 2',
    text: 'Fødsel: 01.01.21\nVægt: 4000g\nHøjde: 50cm\nKlokken: 00.00\nDåb: 01.01.21',
    showText: true,
    showTitle: true,
    title: 'Navn',
    fontSize: 30,
    type: QuotableType.babySign,
  },
];
