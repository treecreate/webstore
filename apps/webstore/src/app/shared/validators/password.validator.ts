/* eslint-disable @typescript-eslint/naming-convention */
import { AbstractControl } from '@angular/forms';
import { APP_CONSTANTS } from '../../app.constants';

export const PASSWORD_VALIDATION_ERRORS = {
  MISSING_INPUT: 'Please input your password.',
  MIN_LENGTH: `Password must be at least ${APP_CONSTANTS.PASSWORD_MIN_LENGTH} characters long.`,
  MAX_LENGTH: `Password must be shorter than ${APP_CONSTANTS.PASSWORD_MAX_LENGTH} characters.`,
  LOWERCASE_REQUIRED: 'At least 1 lowercase letter is required.',
  UPPERCASE_REQUIRED: 'At least 1 uppercase letter is required.',
  DIGIT_REQUIRED: 'At least 1 digit is required.',
  SPECIAL_CHAR_REQUIRED: 'At least 1 special character is required.',
};

const errorMessage = (message: string) => ({ password: { message } });

export function passwordValidator(
  control: AbstractControl
): {
  password: {
    message: string;
  };
} | null {
  const value = control.value;

  if (!value) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.MISSING_INPUT);
  }

  if (value.length < APP_CONSTANTS.PASSWORD_MIN_LENGTH) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.MIN_LENGTH);
  }

  if (value.length > APP_CONSTANTS.PASSWORD_MAX_LENGTH) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.MAX_LENGTH);
  }

  if (!APP_CONSTANTS.PASSWORD_REGEX_LOWERCASE.test(value)) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.LOWERCASE_REQUIRED);
  }

  if (!APP_CONSTANTS.PASSWORD_REGEX_UPPERCASE.test(value)) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.UPPERCASE_REQUIRED);
  }

  if (!APP_CONSTANTS.PASSWORD_REGEX_DIGIT.test(value)) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.DIGIT_REQUIRED);
  }

  if (!APP_CONSTANTS.PASSWORD_REGEX_SPECIAL_CHAR.test(value)) {
    return errorMessage(PASSWORD_VALIDATION_ERRORS.SPECIAL_CHAR_REQUIRED);
  }

  return null;
}
