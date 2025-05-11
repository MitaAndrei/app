import {Routes} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MacroTrackerComponent } from './pages/macro-tracker/macro-tracker.component';
import { WorkoutsComponent } from './pages/workouts/workouts.component';
import { AuthFormComponent } from './pages/authentication/auth-form/auth-form.component';
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {BlankLayoutComponent} from "./layouts/blank-layout/blank-layout.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'workouts', component: WorkoutsComponent},
      { path: 'macro', component: MacroTrackerComponent},
      { path: 'auth-form', component: AuthFormComponent},
      { path: 'profile', component: UserProfileComponent},
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: '**', component: NotFoundComponent }
    ]
  }
];
