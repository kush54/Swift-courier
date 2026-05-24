import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  customerId: string;
  customerName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private KEY = 'swift_user';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.success && res.data) {
          localStorage.setItem(this.KEY,
            JSON.stringify(res.data));
        }
      })
    );
  }

  logout(): void { localStorage.removeItem(this.KEY); }

  getUser(): User | null {
    const s = localStorage.getItem(this.KEY);
    return s ? JSON.parse(s) : null;
  }

  isLoggedIn(): boolean { return !!this.getUser(); }
  isOfficer(): boolean {
    return this.getUser()?.role === 'OFFICER';
  }
}