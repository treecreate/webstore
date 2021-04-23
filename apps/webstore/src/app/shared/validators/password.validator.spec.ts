import { FormControl } from '@angular/forms';
import {
  passwordValidator,
  PASSWORD_VALIDATION_ERRORS,
} from './password.validator';

describe('passwordValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
  });

  // === MISSING INPUT ===
  describe('missing input', () => {
    it('should return field error message: missing input (empty input)', () => {
      control.setValue('');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MISSING_INPUT;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it(`should NOT return field error message: missing input (filled input)`, () => {
      control.setValue('q');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MISSING_INPUT;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === MIN LENGTH ===
  describe('min length', () => {
    it('should return field error message: min length (1 character)', () => {
      control.setValue('Z');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MIN_LENGTH;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: min length (7 characters)', () => {
      control.setValue('Q#3D-WW');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MIN_LENGTH;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: min length (8 characters)', () => {
      control.setValue('Q#3D-LD$');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MIN_LENGTH;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: min length (10 characters)', () => {
      control.setValue('Q#3D-QW#SZ');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MIN_LENGTH;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: min length (20 characters)', () => {
      control.setValue('Q#3D-QW#SZQ#3D-QW#SZ');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MIN_LENGTH;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === MAX LENGTH ===
  describe('max length', () => {
    it('should return field error message: max length (129 characters)', () => {
      control.setValue(
        '9ph[.]ZezjEB]fEY$aJ?_V?@k@=yDEz~~QG>fJUN5qV3_MW}!9MZ$4r6$?N`-=qF,D]A&Km%$ADE~Mpu_TxU7~uSfbV86-X,a[V{q"bKpd`=SE=,}U[T~t6}!T>d@^P%q'
      );

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MAX_LENGTH;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: max length (256 characters)', () => {
      control.setValue(
        `2wzZXmvXBq8rvkwAwyxwB5xCvg4xuqc3kcDezDGTzRV5RjEcnfqbQg2NqvsK2CvdbvHeDbVJj3XQanVuePLrvHy9fV5PkExTmeXtFJmmYBacPXYL4t4UuFWcjxpm9WuWT9E
        36Ghnz8mvhqkUT8F7q5VrfK4RjLxhRStVtm6mLbdPLncAxr9J6V2fCuvzKgVcKHb2924Jduv2ZxzCjcNAp2maNXDH9Wb7xrRggdbPZYg4tX5HDR8uFMRb6EN6hXDR`
      );

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MAX_LENGTH;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: max length (128 characters - no special)', () => {
      control.setValue(
        'GzQ2KUnZEnvxEAxfxxxFShjTBS4DThLPJ3LbkaPA7NKKtbZ37ERCB3St5RtLpS65YVatnuq5HQyC2KsNHqKHWeRPSCsancg6SmDcWMdmYQVGYVtsXyPjDSCbt76bLf2z'
      );

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.MAX_LENGTH;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === LOWERCASE REQUIRED ===
  describe('lowercase required', () => {
    it('should return field error message: lowercase required (8 uppercase)', () => {
      control.setValue('ONLYUPPERCASE');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.LOWERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: lowercase required (10 random - no lowercase)', () => {
      control.setValue('O@E)IFDS12');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.LOWERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: lowercase required (8 random - with lowercase)', () => {
      control.setValue('OREdifDS');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.LOWERCASE_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: lowercase required (20 random - with lowercase)', () => {
      control.setValue('#$JungleDiff*Feeders');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.LOWERCASE_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === UPPERCASE REQUIRED ===
  describe('uppercase required', () => {
    it('should return field error message: uppercase required (8 chars - all lowercase)', () => {
      control.setValue('onlylowe');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: uppercase required (12 chars - lowercase + digits)', () => {
      control.setValue('21onlylowe99');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: uppercase required (20 chars - lowercase + digits + special)', () => {
      control.setValue('21##onlylowe99@%&!#@');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: uppercase required (20 chars - lowercase + digits + special)', () => {
      control.setValue('21##onlylowe99@%&!#@');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: uppercase required (20 chars - uppercase + lowercase  + special)', () => {
      control.setValue('ZZ##onlyloweDD@%&!#@');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: uppercase required (8 chars - uppercase + digit + special)', () => {
      control.setValue('Z#128D@%');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: uppercase required (10 chars - uppercase + digit + lowercase)', () => {
      control.setValue('Zy12jk8Dzd');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === UPPERCASE REQUIRED ===
  describe('Digit required', () => {
    it('should return field error message: digit required (13 chars - lower + uppercase)', () => {
      control.setValue('NoDigitInHere');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: digit required (8 chars - lower + uppercase + special)', () => {
      control.setValue('Pa$$wORD');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: digit required (20 chars - lower + uppercase + special)', () => {
      control.setValue('Pa$$wORDPa$$wORDERDq');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: digit required (8 chars - lower + uppercase + digit)', () => {
      control.setValue('paSSw04d');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: digit required (20 chars - lower + uppercase + digit)', () => {
      control.setValue('paSSw04dpaSSw04dIKNO');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED;

      expect(validation.password.message).not.toBe(expectedMessage);
    });
  });

  // === SPECIAL CHARACTER REQUIRED ===
  describe('Special character required', () => {
    it('should return field error message: special character required (8 chars - lower + upper + digit)', () => {
      control.setValue('MidDif423');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.SPECIAL_CHAR_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should return field error message: special character required (20 chars - lower + upper + digit)', () => {
      control.setValue('MidDif42378RFOKujeon');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.SPECIAL_CHAR_REQUIRED;

      expect(validation.password.message).toBe(expectedMessage);
    });

    it('should NOT return field error message: special character required (8 chars - lower + upper + digit + special)', () => {
      control.setValue('P4$$word');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.SPECIAL_CHAR_REQUIRED;

      expect(validation).not.toBe(expectedMessage);
    });

    it('should NOT return field error message: special character required (20 chars - lower + upper + digit + special)', () => {
      control.setValue('MidDif42378#FOKuj@ie');

      const validation = passwordValidator(control);
      const expectedMessage = PASSWORD_VALIDATION_ERRORS.SPECIAL_CHAR_REQUIRED;

      expect(validation).not.toBe(expectedMessage);
    });
  });

  // === VALID ===
  describe('Valid passwrod', () => {
    it('should NOT return field error message: validation passed (8 chars - mix off all)', () => {
      control.setValue('Pa$sw0rd');

      const validation = passwordValidator(control);
      const expectedResult = null;

      expect(validation).toBe(expectedResult);
    });

    it('should NOT return field error message: validation passed (20 chars - mix off all)', () => {
      control.setValue('Passw0rd!H3LL0#$@vsu');

      const validation = passwordValidator(control);
      const expectedResult = null;

      expect(validation).toBe(expectedResult);
    });
  });
});
