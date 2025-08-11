import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email, 
      password, 
      username
    }).pipe(
      tap((res: any) => {
        if (res.success) {
          const userData = {
            username: res.username,
            email: res.email,
            token: res.token
          };
          this.setCurrentUser(userData);
        }
      }),
      catchError(error => {
        throw 'Registration failed: ' + (error.error?.error || 'Unknown error');
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email, 
      password
    }).pipe(
      tap((res: any) => {
        if (res.success) {
          const userData = {
            username: res.username,
            email: res.email,
            token: res.token
          };
          this.setCurrentUser(userData);
        }
      }),
      catchError(error => {
        throw 'Login failed: ' + (error.error?.error || 'Invalid credentials');
      })
    );
  }

  initiatePhoneAuth(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate-phone-auth`, { phone }).pipe(
      tap((res: any) => {
        if (res.exists && res.token) {
          const userData = {
            username: res.username,
            phone: res.phone,
            token: res.token
          };
          this.setCurrentUser(userData);
        }
      }),
      catchError(error => {
        throw 'Phone auth failed: ' + (error.error?.error || 'Unknown error');
      })
    );
  }

  private setCurrentUser(userData: any) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}