import { AbstractControl } from "@angular/forms";

export function minlengthValidationMessages(err: any, field:any) {
    return `Should have at least ${field.templateOptions.minLength} characters`;
  }

  export function fieldMatchValidator(control: AbstractControl) {
    const { password, passwordConfirm } = control.value;

    // avoid displaying the message error when values are empty
    if (!passwordConfirm || !password) {
      return null;
    }

    if (passwordConfirm === password) {
      return null;
    }

    return { fieldMatch: { message: 'Password Not Matching' } };
  }
