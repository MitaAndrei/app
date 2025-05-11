import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Workout} from "../models/Workout";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(
    private http: HttpClient
  ) { }

  baseApiUrl: string = `https://localhost:7225/api/`


  triggerGetWorkouts = new Subject<void>();
  triggerGetTemplates = new Subject<void>();


  createWorkout(workout : Workout) : Observable<any>{
    return this.http.post<any>(this.baseApiUrl + 'Workout', workout)
  }

  editWorkout(id: string, workout : Workout) : Observable<any>{
    return this.http.put<any>(this.baseApiUrl + 'Workout/' + id, workout)
  }

  getAllForUser() : Observable<Workout[]>{
    return this.http.get<Workout[]>(this.baseApiUrl + 'Workout');
  }

  getTemplates() : Observable<Workout[]>{
    return this.http.get<Workout[]>(this.baseApiUrl + 'Workout/templates');
  }

  getAllInDateRange(start: Date, end: Date) : Observable<Workout[]>{
    const fstart = start.toISOString();
    const fend = end.toISOString();
    return this.http.get<Workout[]>(this.baseApiUrl + 'Workout/getAllInDateRange',{
      params: {startDate: fstart, endDate: fend},});
  }

  deleteWorkout(id: string): Observable<string> {
    return this.http.delete<string>(this.baseApiUrl + `Workout/${id}`,);
  }

}
