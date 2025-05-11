import { Component } from '@angular/core';
import {NavBarComponent} from "../../nav-bar/nav-bar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    NavBarComponent,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
