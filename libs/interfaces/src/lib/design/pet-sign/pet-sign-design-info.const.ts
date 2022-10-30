import { PetSignDesignEnum, PetSignDesignNameDanishEnum, PetSignDesignNameEnglishEnum } from '@assets';
import { IPetSignFrameInfo } from './pet-sign-design-info.interface';

export const petSignFrames: IPetSignFrameInfo[] = [
  {
    src: PetSignDesignEnum.noFrame,
    nameDk: PetSignDesignNameDanishEnum.noFrame,
    nameEn: PetSignDesignNameEnglishEnum.noFrame,
  },
  {
    src: PetSignDesignEnum.frame1,
    nameDk: PetSignDesignNameDanishEnum.frame1,
    nameEn: PetSignDesignNameEnglishEnum.frame1,
  },
  {
    src: PetSignDesignEnum.frame3,
    nameDk: PetSignDesignNameDanishEnum.frame3,
    nameEn: PetSignDesignNameEnglishEnum.frame3,
  },
  {
    src: PetSignDesignEnum.frame2,
    nameDk: PetSignDesignNameDanishEnum.frame2,
    nameEn: PetSignDesignNameEnglishEnum.frame2,
  },
];
