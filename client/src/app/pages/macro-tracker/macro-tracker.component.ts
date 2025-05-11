import {Component, input, model, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FoodService} from "../../services/food.service";
import {LoggedFood} from "../../models/LoggedFood";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {LogFoodDialogComponent} from "../workouts/log-food-dialog/log-food-dialog.component";
import {DateTimeService} from "../../services/date-time.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-macro-tracker',
  standalone: true,
  imports: [CommonModule, MatIcon, FormsModule],
  templateUrl: './macro-tracker.component.html',
  styleUrl: './macro-tracker.component.scss'
})
export class MacroTrackerComponent implements OnInit{

  date = model(new Date());
  foodsForCurrentDate: LoggedFood[] = [];
  beingEdited: LoggedFood | null = null;
  oldValue: number | null = null;

  constructor(private foodService: FoodService, private dialog: MatDialog,
              private dateTimeService: DateTimeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.date.update(old => old ? this.dateTimeService.toUtc(new Date(old)) : new Date())
    console.log(this.date())
    this.getLoggedFoods()
  }

  changeDay(offset: number) {
    console.log(this.date());
    this.date.update(old => new Date(old.setDate(old.getDate() + offset)));
    this.getLoggedFoods()
  }


  getTotalCalories() : number {
    return this.foodService.getTotalCalories(this.foodsForCurrentDate)
  }

  getTotalFats() : number {
    return this.foodService.getTotalFats(this.foodsForCurrentDate)
  }

  getTotalProtein() : number {
    return this.foodService.getTotalProtein(this.foodsForCurrentDate)
  }

  getTotalCarbs() : number {
    return this.foodService.getTotalCarbs(this.foodsForCurrentDate)
  }

  getLoggedFoods(){
    this.foodService.getAllForDate(this.date()).subscribe(
      foods => this.foodsForCurrentDate = foods
    )
  }

  openLogFoodDialog(){
    let dialogRef = this.dialog.open(LogFoodDialogComponent, {autoFocus: false, data: {date: this.date()}});
    dialogRef.afterClosed().subscribe( result => {
      if( result == 'logged')
        this.getLoggedFoods();
    } )


  }

  deleteLoggedFood(id: string) {
    this.foodService.deleteLoggedFood(id).subscribe(
      () => this.getLoggedFoods(),
    )
  }

  edit(loggedFood: LoggedFood) {
    this.beingEdited = loggedFood;
    this.oldValue = loggedFood.grams;
  }

  cancel(){
    this.beingEdited!.grams = this.oldValue!;
    this.beingEdited = null;
  }

  save(loggedFood: LoggedFood) {
    let shouldReturn : boolean = this.beingEdited?.grams == this.oldValue
    this.beingEdited = null;
    this.oldValue = null;
    if(shouldReturn) return;
    this.foodService.editLoggedFood(loggedFood).subscribe(
    )
  }
}
