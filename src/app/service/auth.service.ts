import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use relative paths so the dev server proxy can forward requests to the backend and avoid CORS
  private baseUrl = '';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string, remember: boolean = true): Observable<string> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, senha }).pipe(
      map(res => {
        const token = res.token || res.accessToken || res.jwt || (res as any).tokenJwt || null;
        // try to get user info (nome, email) from response
        const user = (res as any).nome || (res as any).name || (res as any).email ? { nome: (res as any).nome || (res as any).name, email: (res as any).email } : null;
        if (token) {
          // store token
          if (remember) {
            localStorage.setItem(this.tokenKey, token);
          } else {
            sessionStorage.setItem(this.tokenKey, token);
          }
          // store user info alongside token
          if (user) {
            const ujson = JSON.stringify(user);
            if (remember) {
              localStorage.setItem(this.userKey, ujson);
            } else {
              sessionStorage.setItem(this.userKey, ujson);
            }
          }
        }
        return token as string;
      })
    );
  }

  register(nome: string, email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { nome, email, senha });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  getUser(): { nome?: string; email?: string } | null {
    const raw = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
