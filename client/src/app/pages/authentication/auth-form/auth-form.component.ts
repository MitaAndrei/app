import {Component} from '@angular/core';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../../services/auth.service";
import {SignUpCredentials} from "../../../models/SignUpCredentials";
import {LogInCredentials} from "../../../models/LogInCredentials";
import {Router} from "@angular/router";
import {FormlyMaterialModule} from "@ngx-formly/material";

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    FormlyModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent {

  constructor(public authService: AuthService,
              public router: Router) {
  }


  form_signup = new FormGroup({});
  form_login = new FormGroup({});
  current_form = this.form_login;

  login_model = {
    username: "zdx",
    password: "sososo",
   };

  signup_model = {
    username: "xas",
    password: "",
    password_confirm: "",

  }

  current_model = this.login_model;

  fields_signup: FormlyFieldConfig[] = [{
    validators: {
      validation: [
        { name: 'fieldMatch', options: { errorPath: 'passwordConfirm' } },
      ],
    },
    fieldGroup: [
      {
        key: 'username',
        type: 'input',
        props: {
          label: 'username',
          placeholder: 'Username',
          required: true,
          minLength: 3,
        },
      },
      {
        key: 'password',
        type: 'input',
        props: {
          type: 'password',
          label: 'Password',
          placeholder: 'Must be at least 3 characters long',
          required: true,
          minLength: 3,
        },
      },
      {
        key: 'passwordConfirm',
        type: 'input',
        props: {
          type: 'password',
          label: 'Confirm Password',
          placeholder: 'Please re-enter your password',
          required: true,
        },
      },
    ],
  }];

  fields_login: FormlyFieldConfig[] = [{
    fieldGroup: [
      {
        key: 'username',
        type: 'input',
        props: {
          label: 'username',
          placeholder: 'Username',
          required: true,
          minLength: 3,
        },
      },
      {
        key: 'password',
        type: 'input',
        props: {
          type: 'password',
          label: 'Password',
          placeholder: 'Must be at least 3 characters long',
          required: true,
          minLength: 3,
        },
      }]
  }];

  current_fields = this.fields_login;

  onSubmit(model: any) {
    if (!this.current_form.valid) {
      alert("not valid")
      return;
    }

    if(this.current_form === this.form_signup){
      let credentials: SignUpCredentials = {
        username : model.username,
        password: model.password,
      }
      this.authService.signUp(credentials).subscribe( () =>
        this.changeForm()
      )
    }

    else{
      let credentials: LogInCredentials = {
        username : model.username,
        password: model.password,
      }
      this.authService.logIn(credentials).subscribe( response => {
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        this.router.navigate(['/workouts']);
        this.authService.getCurrentUser().subscribe({
          next: user => {
            this.authService.currentUserSig.set(user);
          },
          error: () => {
            this.authService.currentUserSig.set(null);
          }
        })
      })
    }

  }

  changeForm(){
    if(this.current_form === this.form_login){
      this.current_form = this.form_signup;
      this.current_fields = this.fields_signup;
      this.current_model = this.signup_model;
      return;
    }

    this.current_form = this.form_login;
    this.current_fields = this.fields_login;
    this.current_model = this.login_model;
  }
}
