import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { fieldMatchValidator, minlengthValidationMessages } from './app/pages/authentication/auth-form/formValidators';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {AutocompleteTypeComponent} from "./app/custom-field-types/autocomplete-type/autocomplete-type.component";

bootstrapApplication(AppComponent, {
  providers : [...appConfig.providers,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    importProvidersFrom([
      FormlyModule.forRoot({
        types: [
          { name: 'autocomplete', component: AutocompleteTypeComponent },
          // { name: 'datepicker', component: DatePickerComponent },
        ],

        validators: [
          { name: 'fieldMatch', validation: fieldMatchValidator },
        ],
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'minlength', message: minlengthValidationMessages },
        ]
        ,}),
        ])
    ]
  })
  .catch((err) => console.error(err));
