import { Injectable } from '@angular/core';
import {Food} from "../models/Food";
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FoodGramsPair} from "../models/FoodGramsPair";
import {LoggedFood} from "../models/LoggedFood";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {
  }

  baseApiUrl: string = `https://localhost:7225/api/`


  triggerGetFoods = new Subject<void>();

  createFood(food: Food) : Observable<any>{
    return this.http.post<any>(this.baseApiUrl + 'Food', food)
  }

  getAllFood(): Observable<Food[]>{
    return this.http.get<Food[]>(this.baseApiUrl + 'Food');
  }

  logFoods(date: Date, foods: FoodGramsPair[]): Observable<any>{
    const params = new HttpParams().set('date', date.toISOString());
    return this.http.post<any>(this.baseApiUrl + 'Food/createLoggedFoods', foods, {params: params});
  }

  deleteLoggedFood(id: string): Observable<any>{
    return this.http.delete<any>(this.baseApiUrl + 'Food/deleteLoggedFood/' + id);
  }

  editLoggedFood(loggedFood: LoggedFood) {
    return this.http.put<LoggedFood>(this.baseApiUrl + 'Food/editLoggedFood/', loggedFood);
  }

  getAllInDateRange(start: Date, end: Date) : Observable<LoggedFood[]>{
    const fstart = start.toISOString();
    const fend = end.toISOString();
    return this.http.get<LoggedFood[]>(this.baseApiUrl + 'Food/getAllInDateRange',{
      params: {startDate: fstart, endDate: fend},});
  }

  getInDateRangeFor(userId: string, start: Date, end: Date) : Observable<LoggedFood[]>{
    const fstart = start.toISOString();
    const fend = end.toISOString();
    return this.http.get<LoggedFood[]>(this.baseApiUrl + 'Food/logged/' + userId,{
      params: {startDate: fstart, endDate: fend},});
  }

  getAllForDate(date: Date) : Observable<LoggedFood[]>{
    const fdate = new Date(date).toISOString();
    return this.http.get<LoggedFood[]>(this.baseApiUrl + 'Food/getAllForDate',{
      params: {date: fdate},});
  }

  getTotalCalories(foods: LoggedFood[]) : number {
    return foods.reduce((total, loggedfood) => total + loggedfood.food.calories / 100 * loggedfood.grams, 0);
  }

  getTotalFats(foods: LoggedFood[]) : number {
    return foods.reduce((total, loggedfood) => total + loggedfood.food.fats / 100 * loggedfood.grams, 0);
  }

  getTotalProtein(foods: LoggedFood[]) : number {
    return foods.reduce((total, loggedfood) => total + loggedfood.food.protein / 100 * loggedfood.grams, 0);
  }

  getTotalCarbs(foods: LoggedFood[]) : number {
    return foods.reduce((total, loggedfood) => total + loggedfood.food.carbs / 100 * loggedfood.grams, 0);
  }

}
