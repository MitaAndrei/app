import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})

export class NavBarComponent {

  constructor(public authService: AuthService) {
  }


  SignIn(){
  }

  SignOut(){
    this.authService.logOut();
  }

}
