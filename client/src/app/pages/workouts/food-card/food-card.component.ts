import {Component, input} from '@angular/core';
import {formatDate, NgForOf} from "@angular/common";
import {LoggedFood} from "../../../models/LoggedFood";
import {Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LogFoodDialogComponent} from "../log-food-dialog/log-food-dialog.component";
import {FoodService} from "../../../services/food.service";

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './food-card.component.html',
  styleUrl: './food-card.component.scss'
})
export class FoodCardComponent {
  foods = input<LoggedFood[]>([]);
  public date = input.required<Date>();

  constructor(public router: Router, private dialog: MatDialog, private foodService: FoodService) {
  }

  get totalCalories() : number {
    return this.foodService.getTotalCalories(this.foods())
  }

  get totalFats() : number {
    return this.foodService.getTotalFats(this.foods())
  }

  get totalProtein() : number {
    return this.foodService.getTotalProtein(this.foods())
  }

  get totalCarbs() : number {
    return this.foodService.getTotalCarbs(this.foods())
  }

  openLogFoodDialog(){
    let dialogRef = this.dialog.open(LogFoodDialogComponent,
      {autoFocus: false, data: {date: this.date()}})
  }

  getFormattedDate(date: Date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }
}


