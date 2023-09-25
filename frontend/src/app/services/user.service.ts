import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _endpoint = `http://localhost:8600`;
  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get(`${this._endpoint}/api/v1/u/${id}`).pipe(
      map((res: any) => {
        const user: User = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          firstName: res.data.firstName,
          middleName: res.data.middleName,
          lastName: res.data.lastName,
          phoneNo: res.data.phoneNo,
          gender: res.data.gender,
          dob: res.data.dob,
          role: res.data.role,
          registeredAt: res.data.registeredAt,
          updatedAt: res.data.updatedAt,
        };

        return user;
      })
    );
  }
}
