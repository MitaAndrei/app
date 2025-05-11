import {Component, OnInit} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {AsyncPipe} from "@angular/common";
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-type',
  standalone: true,
  imports: [
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    FormlyModule,
    MatAutocomplete,
    MatOption,
    AsyncPipe
  ],
  templateUrl: './autocomplete-type.component.html',
  styleUrl: './autocomplete-type.component.scss'
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> implements OnInit {
  filter!: Observable<any>;

  ngOnInit() {
    this.filter = this.formControl.valueChanges.pipe(
      startWith(''),
      switchMap((term) => this.props['filter'](term)),
    );
  }
}
