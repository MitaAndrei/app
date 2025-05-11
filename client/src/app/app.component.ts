import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { MacroTrackerComponent } from './pages/macro-tracker/macro-tracker.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavBarComponent,
    HomeComponent,
    MacroTrackerComponent,
    HttpClientModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  constructor(public authService: AuthService){
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe( {
      next: user => {
        this.authService.currentUserSig.set(user);
        console.log(user);
      },
      error: () => {
        this.authService.currentUserSig.set(null);
      }
    });
  }

}

