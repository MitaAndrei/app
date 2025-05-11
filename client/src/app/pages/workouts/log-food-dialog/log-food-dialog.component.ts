import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddFoodDialogComponent} from "./add-food-dialog/add-food-dialog.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatLabel} from "@angular/material/select";
import {FoodService} from "../../../services/food.service";
import {Food} from "../../../models/Food";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FoodGramsPair} from "../../../models/FoodGramsPair";
import {DateTimeService} from "../../../services/date-time.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-log-food-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    NgForOf,
    MatSelect,
    MatOption,
    MatInputModule,
    MatFormFieldModule,
    NgIf,
    AsyncPipe,
    MatAutocompleteModule,
    MatLabel,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatTooltip
  ],
  templateUrl: './log-food-dialog.component.html',
  styleUrl: './log-food-dialog.component.scss'
})
export class LogFoodDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AddFoodDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA)

  constructor(private dialog: MatDialog, private foodService: FoodService,
              private dateTimeService: DateTimeService, private cdr: ChangeDetectorRef) {
  }

  form = new FormGroup({
    foodsArray: new FormArray<FormGroup>([new FormGroup({
      food: new FormControl(''),
      grams: new FormControl('')
    })]),
    date: new FormControl(''),
  },);

  foodOptions: Food[] = [];
  filteredOptions: Food[] = [];


  ngOnInit() {
    if (this.data?.date) {
      this.form.get('date')?.setValue(this.data.date); // ✅ Set it after data is available
      this.cdr.detectChanges();
    }
    this.getFood()
  }

  getFood(){
    this.foodService.getAllFood().subscribe( (data) => {
      this.foodOptions = data;
      this.filteredOptions = data;
    })
  }

  get foods(): FormArray<FormGroup> {
    return this.form.get('foodsArray') as FormArray;
  }

  // Add a new FormGroup to FormArray
  add() {
    const foodGroup = new FormGroup({
      food: new FormControl(''),
      grams: new FormControl('')
    });

    this.foods.push(foodGroup);
  }

  remove(index: number) {
    this.foods.removeAt(index);
  }

  filter(input: string): void {
    console.log("filtering")
    const filterValue = input.toLowerCase();
    this.filteredOptions = this.foodOptions.filter(f => f.name.toLowerCase().includes(filterValue));
  }

  openAddFoodDialog(): void {
    let dialogRef = this.dialog.open(AddFoodDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === "created"){
        this.getFood();
      }
    })
  }

  getOptionText(option: Food): string {
    return option?.name ?? "";
  }

  getTooltipText(food: Food): string {
    return `Calories:${food.calories}\nProtein:${food.protein}g\nCarbs:${food.carbs}g\nFats:${food.fats}g`
  }

  // Submit form
  onSubmit() {
    if(!this.form.valid) return;

    let tobeLogged: FoodGramsPair[] = this.foods.value;
    let date: Date = this.dateTimeService.toUtc(new Date(this.form.controls.date.value!));
    this.foodService.logFoods(date, tobeLogged).subscribe( () => {
     this.dialogRef.close("logged");
     this.foodService.triggerGetFoods.next();
    });
  }

}
