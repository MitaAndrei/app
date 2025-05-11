import {Component, inject} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormlyFieldConfig, FormlyModule} from "@ngx-formly/core";
import {Food} from "../../../../models/Food";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {FoodService} from "../../../../services/food.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-food-dialog',
  standalone: true,
  imports: [
    FormlyModule,
    FormlyMaterialModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormlyModule
  ],
  templateUrl: './add-food-dialog.component.html',
  styleUrl: './add-food-dialog.component.scss'
})
export class AddFoodDialogComponent {

  readonly dialogRef = inject(MatDialogRef<AddFoodDialogComponent>);

  constructor(private foodService: FoodService) {
  }

  form = new FormGroup({});

  model : Food = {} as Food;

  fields: FormlyFieldConfig[] = [{
    fieldGroup: [
      {
        key: 'name',
        type: 'input',
        props: {
          label: 'name',
          placeholder: 'Food name',
          required: true,
        },
      },
      {
        key: 'calories',
        type: 'input',
        props: {
          label: 'calories',
          type: "number",
          placeholder: 'Calories per 100g',
          required: true,
          min: 0
        },
      },
    ],
  },{
    fieldGroupClassName: "d-flex w-100",
    fieldGroup: [
      {
        className: 'flex-1 w-25',
        key: 'fats',
        type: 'input',
        props: {
          label: 'fats',
          type: "number",
          placeholder: 'fats per 100g',
          required: true,
          min: 0
        },
      },
      {
        className: 'flex-1 w-25',
        key: 'carbs',
        type: 'input',
        props: {
          type: "number",
          label: 'carbs',
          placeholder: 'carbs per 100g',
          required: true,
          min: 0
        },
      },
      {
        className: 'flex-1 w-25',
        key: 'protein',
        type: 'input',
        props: {
          type: "number",
          label: 'protein',
          placeholder: 'Protein per 100g',
          required: true,
          min: 0
        },
      },
    ]
  }
  ];


  onSubmit(model: Food) {
    if(!this.form.valid || this.form.pristine) {
      return;}

    this.foodService.createFood(model).subscribe(() => this.dialogRef.close("created"));

  }
}
