import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = `https://localhost:7225/api/`

  searchUsers(query: string) {
    return this.http.get<User[]>(this.baseApiUrl + "User/search", {params: {query: query}});
  }

  getUserByUsername(username: string) {
    return this.http.get<User>(this.baseApiUrl + "User/getUserByUsername", {params: {username: username}});
  }
}
