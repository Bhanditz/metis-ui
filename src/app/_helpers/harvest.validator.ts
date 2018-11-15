import { AbstractControl, ValidationErrors } from '@angular/forms';

export function harvestValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value.indexOf('?') >= 0) {
    return {'validParameter': true };
  }

  const regex = /(http(s?))\:\/\//g;
  if (!regex.test(control.value)) {
    return {'validUrl': true };
  }
  return null;
}
