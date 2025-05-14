import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Food} from "../models/Food";
import {Observable} from "rxjs";
import {FriendshipStatus} from "../models/FriendshipStatus";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = `https://localhost:7225/api/`

  sendFriendRequest(receiverId: string) : Observable<any>{
    return this.http.post<any>(this.baseApiUrl + 'Friends/request', {receiverId})
  }

  acceptFriendRequest(userId: string) : Observable<any>{
    return this.http.post<any>(this.baseApiUrl + 'Friends/accept/' + userId, null)
  }

  rejectFriendRequest(userId: string) : Observable<any>{
    return this.http.post<any>(this.baseApiUrl + 'Friends/reject/' + userId, null)
  }

  unfriend(userId: string) : Observable<any>{
    return this.http.delete<any>(this.baseApiUrl + 'Friends/unfriend/' + userId)
  }

  getFriendshipStatus(userId: string) : Observable<FriendshipStatus>{
    return this.http.get<FriendshipStatus>(this.baseApiUrl + 'Friends/status/'+userId);
  }

}
