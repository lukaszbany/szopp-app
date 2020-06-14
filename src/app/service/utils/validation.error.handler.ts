import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../model/error/error.model';
import {ValidationError} from '../../model/error/validation.error.model';

@Injectable({providedIn: 'root'})
export class ValidationErrorHandler {

  static saveErrors(form: NgForm, error: ApiError) {
    if (error.validationErrors) {
      this.setValidationErrors(error, form);
    }
  }

  private static setValidationErrors(error: ApiError, form: NgForm) {
    for (let validationError of error.validationErrors) {
      this.addFormError(validationError, form);
    }
  }

  private static addFormError(validationError: ValidationError, form: NgForm) {
    if (validationError.field && form.controls[validationError.field]) {
      this.setFieldError(form, validationError);
      this.markFieldAsTouched(form, validationError);
    }
  }

  private static setFieldError(form: NgForm, validationError: ValidationError) {
    form
      .controls[validationError.field]
      .setErrors({
        incorrect: true,
        message: validationError.message
      });
  }

  private static markFieldAsTouched(form: NgForm, validationError: ValidationError) {
    form
      .controls[validationError.field]
      .markAsTouched();
  }
}
