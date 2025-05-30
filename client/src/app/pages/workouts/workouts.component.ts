import {Component, effect, OnDestroy, OnInit} from '@angular/core';
import {WorkoutService} from "../../services/workout.service";
import {Workout} from "../../models/Workout";
import {CommonModule} from "@angular/common";
import {DateTimeService} from "../../services/date-time.service";
import {MatButtonModule, MatFabButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {WorkoutFormDialogComponent} from "./workout-form-dialog/workout-form-dialog.component";
import {CalendarContentComponent} from "./calendar-content/calendar-content.component";
import {MatDialog} from "@angular/material/dialog";
import {DateRangePickerComponent} from "../../custom-field-types/date-range-picker/date-range-picker.component";
import {DateRange} from "@angular/material/datepicker";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {filter, map, Subject, takeUntil} from "rxjs";
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {LogFoodDialogComponent} from "./log-food-dialog/log-food-dialog.component";
import {FoodService} from "../../services/food.service";
import {LoggedFood} from "../../models/LoggedFood";
import {FoodCardComponent} from "./food-card/food-card.component";
import { User } from '../../models/User';
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule, DateRangePickerComponent,
    CalendarContentComponent, CommonModule,
    MatFabButton, MatIcon, SidebarComponent,
    CdkDropListGroup, CdkMenuTrigger, CdkMenu,
    CdkMenuItem, MatMenuTrigger, MatMenu, MatMenuItem,
    FoodCardComponent
    ],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss'
})

export class WorkoutsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  workouts: Workout[]  = [];
  loggedFoods: LoggedFood[] = []
  days: {date: Date, workouts: Workout[], loggedFoods: LoggedFood[]}[] = [];
  User: User = {} as User;
  isCurrentUser: boolean = true;

  username = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('username')),
      filter((username): username is string => !!username)
    ),
    { initialValue: '' }
  );

  constructor(private workoutService: WorkoutService,
              private dateTimeService: DateTimeService,
              private foodService: FoodService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              protected authService: AuthService,
              private userService: UserService,) {

    effect(() => {
      const username = this.username();
      const currentUser = this.authService.currentUserSig();

      if (!username || currentUser === undefined) return;

      if (currentUser && username === currentUser.username) {
        this.User = currentUser;
        this.isCurrentUser = true;
        this.getWorkouts()
        this.getLoggedFoods()

      } else {
        this.userService.getUserByUsername(username).subscribe(user => {
          this.User = user;
          this.isCurrentUser = false;
          this.getWorkouts()
          this.getLoggedFoods()
        });
      }
    });

  }

  ngOnInit(): void {
     this.getCurrentWeekDates().map(date => {
       this.days.push({date: date, workouts: [], loggedFoods: []})
     })

    this.workoutService.triggerGetWorkouts
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getWorkouts());

    this.foodService.triggerGetFoods
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getLoggedFoods())
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentWeekDates(): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    let firstDayOfWeek = new Date(today);
    const dayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay(); // Adjust for Monday start
    firstDayOfWeek.setDate(today.getDate() + dayOffset);
    firstDayOfWeek.setHours(0, 0, 0, 0);
    firstDayOfWeek = this.dateTimeService.toUtc(firstDayOfWeek);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);
      dates.push(currentDate);
    }

    return dates;
  }

  getWorkouts(){

    if(this.isCurrentUser){
      this.workoutService.getAllInDateRange(this.days[0].date, this.days[6].date).subscribe(
        workouts => this.setWorkouts(workouts)
      )
    }
    else{
      this.workoutService.getForUser(this.User.id, this.days[0].date, this.days[6].date).subscribe(
        workouts => this.setWorkouts(workouts)
      )
    }
  }

  setWorkouts(workouts: Workout[]) {
    this.workouts = workouts;
    this.days.forEach(day => {
      day.workouts = workouts
        .filter(w => this.dateTimeService.sameDay(new Date(w.date), day.date))
    })
  }

  getLoggedFoods(){
    if(this.isCurrentUser){
      this.foodService.getAllInDateRange(this.days[0].date, this.days[6].date).subscribe(
        lf => this.setLoggedFoods(lf)
      )
    }else{
      this.foodService.getInDateRangeFor(this.User.id, this.days[0].date, this.days[6].date).subscribe(
        lf => this.setLoggedFoods(lf)
      )
    }
  }

  setLoggedFoods(lf: LoggedFood[]) {
    this.loggedFoods = lf;

    this.days.forEach(day => {
      day.loggedFoods = lf
        .filter(f => this.dateTimeService.sameDay(new Date(f.date), day.date))
    })
  }

  changeDates(range: DateRange<Date> | null){
    if (range == null) return;

    if(range.start == null) return;

    this.days = []

    let first = new Date(range.start!);
    first.setHours(0, 0, 0, 0);

    first = this.dateTimeService.toUtc(first);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(first);
      currentDate.setDate(first.getDate() + i);
      this.days.push({date: currentDate, workouts: [], loggedFoods: []});
    }
    this.getWorkouts();
    this.getLoggedFoods();
  }

  previousWeek(){
    let first = new Date(this.days[0].date);
    let last = new Date(this.days[6].date);

    first.setDate(first.getDate() - 7);
    last.setDate(last.getDate() - 7);
    this.changeDates(new DateRange(first, last));
  }

  nextWeek(){
    let first = new Date(this.days[0].date);
    let last = new Date(this.days[6].date);

    first.setDate(first.getDate() + 7);
    last.setDate(last.getDate() + 7);
    this.changeDates(new DateRange(first, last));
  }

  toggleSidebar(){
    this.sidebarOpen = !this.sidebarOpen;
  }

  openAddDialog(){
    let dialogRef = this.dialog.open(WorkoutFormDialogComponent)

    dialogRef.afterClosed().subscribe(() => {
      this.getWorkouts();
    })
  }

  openFoodDialog(){
    let dialogRef = this.dialog.open(LogFoodDialogComponent, {autoFocus: false})

    dialogRef.afterClosed().subscribe(() => {
      this.getWorkouts();
    })
  }
}
