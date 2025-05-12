import {Component, effect, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/User";
import {ActivityGraphComponent} from "../../activity-graph/activity-graph.component";
import {WorkoutService} from "../../services/workout.service";
import {DateTimeService} from "../../services/date-time.service";
import {Workout} from "../../models/Workout";
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {filter, map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, ActivityGraphComponent, NgIf],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
    workouts: Workout[] | null = null;
    User: User = {} as User;
    isCurrentUser: boolean = true;

  username = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('username')),
      filter((username): username is string => !!username)
    ),
    { initialValue: '' }
  );

    constructor(private authService: AuthService,
                private workoutService: WorkoutService,
                private dateTimeService: DateTimeService,
                private userService: UserService,
                private route: ActivatedRoute)
    {
      effect(() => {
        const username = this.username();
        const currentUser = this.authService.currentUserSig();

        if (!username || currentUser === undefined) return;

        if (currentUser && username === currentUser.username) {
          this.User = currentUser;
          this.isCurrentUser = true;
          this.fetchWorkouts();
        } else {
          this.userService.getUserByUsername(username).subscribe(user => {
            this.User = user;
            this.isCurrentUser = false;
            this.fetchWorkouts();
          });
        }
      });
    }

    ngOnInit(): void {

      // this.route.paramMap.subscribe(params => {
      //   const username = params.get('username');
      //   const currentUser = this.authService.currentUserSig();
      //
      //   if (!username) return;
      //
      //   if (currentUser && username === currentUser.username) {
      //     this.User = currentUser;
      //     this.fetchWorkouts();
      //   } else {
      //     this.userService.getUserByUsername(username).subscribe(user => {
      //       this.User = user;
      //       this.isCurrentUser = false;
      //       this.fetchWorkouts();
      //     });
      //   }
      //
      //   console.log(this.User);
      // });

    }


    get activityStartDate(): Date{
      const pastDate = new Date();
      pastDate.setDate(new Date().getDate() - 364);
      return pastDate;
    }


   fetchWorkouts(): void {
    const activityStartDate = this.dateTimeService.toUtc(this.activityStartDate);
    const todayUtc = this.dateTimeService.toUtc(new Date());

    if(this.isCurrentUser){
      this.workoutService
        .getAllInDateRange(activityStartDate, todayUtc)
        .subscribe(data => {
          this.workouts = data;
        });
    }
    else{
      this.workoutService
        .getForUser(this.User.id, activityStartDate, todayUtc)
        .subscribe(data => {
          this.workouts = data;
        });
    }

  }

  workoutsPerMonth(month: number = (new Date()).getMonth()) : number {
      return this.workouts?.filter(w => new Date(w.date).getMonth() == month).length ?? 0
  }

  maxWorkoutsAMonth() : number {
      let max = 0;
      for(let i = 0; i < 12; i++){
        max = Math.max(max, this.workoutsPerMonth(i))
      }
      return max
  }

}
