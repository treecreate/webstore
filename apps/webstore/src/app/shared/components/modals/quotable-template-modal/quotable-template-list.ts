import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, IQuotableTemplate, QuotableType } from '@interfaces';

export const quotableTemplateList: IQuotableTemplate[] = [
  //    QUOTABLE
  {
    name: 'Til Farmor/Farfar',
    type: QuotableType.quotable,
    designProps: {
      showText: true,
      showTitle: false,
      title: '',
      text: 'Det eneste bedre \nend at have dig som \nMOR/FAR\n\nEr at mine børn har dig\nsom FARMOR/FARFAR',
      fontSize: 40,
      verticalPlacement: 35,
      designSrc: QuotableDesignEnum.frame11,
      font: DesignFontEnum.argestadisplay,
    },
  },
  {
    name: 'Til Mor/Far',
    type: QuotableType.quotable,
    designProps: {
      showText: true,
      showTitle: false,
      title: '',
      text: 'Jeg elsker dig MOR/FAR,\nsom træer elsker vand og solskin.\nDu hjælper mig med at vokse,\ntrives og nå nye højder.\n\nDin SØN/DATTER\nNAVN',
      fontSize: 20,
      verticalPlacement: 35,
      designSrc: QuotableDesignEnum.frame2,
      font: DesignFontEnum.argestadisplay,
    },
  },
  {
    name: 'Til Mor/Far 2',
    type: QuotableType.quotable,
    designProps: {
      showText: true,
      showTitle: true,
      title: 'Mor / Far',
      text: 'jeg vil gerne takke dig\nfor at have spillet en så utrolig\nrolle i mit liv.\n\nJeg elsker dig nu og for evigt.\nNAVN',
      fontSize: 20,
      verticalPlacement: 35,
      designSrc: QuotableDesignEnum.frame1,
      font: DesignFontEnum.argestadisplay,
    },
  },
  //   LOVE LETTER
  {
    name: 'Til Ham/Hende',
    type: QuotableType.loveLetter,
    designProps: {
      showText: true,
      showTitle: true,
      title: 'Navn',
      text: 'Jeg skrev dit navn i skyerne,\nmen vinden blæste det væk.\n\nJeg skrev dit navn i sandet,\nmen bølgerne skyllede det væk.\n\nJeg skrev dit navn i mit hjerte,\nog for evigt vil det blive der.',
      fontSize: 26,
      verticalPlacement: 35,
      designSrc: QuotableDesignEnum.frame2,
      font: DesignFontEnum.argestadisplay,
    },
  },
  //   BABY SIGN
  {
    name: 'Børne tavle',
    type: QuotableType.babySign,
    designProps: {
      showText: true,
      showTitle: true,
      title: 'Navn',
      text: '\n01.01.21 - kl.00.00\n4000g - 50cm',
      fontSize: 30,
      verticalPlacement: 80,
      designSrc: QuotableDesignEnum.frame18,
      font: DesignFontEnum.argestadisplay,
    },
  },
  {
    name: 'Børne tavle 2',
    type: QuotableType.babySign,
    designProps: {
      showText: true,
      showTitle: true,
      title: 'Navn',
      text: 'Fødsel: 01.01.21\nVægt: 4000g\nHøjde: 50cm\nKlokken: 00.00\nDåb: 01.01.21',
      fontSize: 30,
      verticalPlacement: 83,
      designSrc: QuotableDesignEnum.frame20,
      font: DesignFontEnum.argestadisplay,
    },
  },
  {
    name: 'Børne tavle 3',
    type: QuotableType.babySign,
    designProps: {
      showText: true,
      showTitle: true,
      title: 'Navn',
      text: 'With every newborn baby, a little sun rises.\n01.01.2022',
      fontSize: 30,
      verticalPlacement: 35,
      designSrc: QuotableDesignEnum.frame19,
      font: DesignFontEnum.argestadisplay,
    },
  },
];
