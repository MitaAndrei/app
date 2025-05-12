import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {RouterModule} from '@angular/router';
import {MatIcon} from "@angular/material/icon";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../services/user.service";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs";
import {switchMap} from "rxjs/operators";
import {MatFormField} from "@angular/material/form-field";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLabel} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {User} from "../models/User";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, ReactiveFormsModule, MatFormField, MatList, MatListItem, MatLabel, MatProgressSpinner],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})

export class NavBarComponent implements OnInit {

  searchControl = new FormControl('');
  users: User[] = [];

  constructor(public authService: AuthService,
              private userService: UserService,) {
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      map(query => query ? query.trim() : ""),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length === 0) {
        this.users = [];
      } else {
        this.userService.searchUsers(query).subscribe(results => {
          this.users = results;
        });
      }
    });
  }

  SignOut(){
    this.authService.logOut();
  }

}
