import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${env.apiUrl}/users/me`);
  }
}
