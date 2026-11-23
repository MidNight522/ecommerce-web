import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  GetMeResponse,
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  User,
  UpdateProfileBody,
} from './auth.types';
import { environment } from '../../environment/environment';
import { tap } from 'rxjs';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal<string | null>(
    this.getTokenFromLocalStorage(),
  );
  private readonly currentUserSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(
    () => Boolean(this.token()) && Boolean(this.currentUser()),
  );

  register(body: RegisterBody, rememberMe: boolean) {
    return this.http
      .post<RegisterResponse>(
        `${environment.apiUrl}/auth/register`,
        this.normalizeRegisterBody(body),
      )
      .pipe(
        tap((response) => {
          this.setSession(response.token, response.user, rememberMe);
        }),
      );
  }
  login(body: LoginBody) {
    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}/auth/login`,
        this.normalizeLoginBody(body),
      )
      .pipe(
        tap((response) => {
          this.setSession(response.token, response.user);
        }),
      );
  }

  getMe() {
    return this.http
      .get<GetMeResponse>(`${environment.apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token()}`,
        },
      })
      .pipe(
        tap((response) => {
          this.currentUserSignal.set(response.user);
        }),
      );
  }

  updateProfile(body: UpdateProfileBody) {
    return this.http
      .patch<GetMeResponse>(`${environment.apiUrl}/auth/me`, body)
      .pipe(tap((response) => this.currentUserSignal.set(response.user)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  private getTokenFromLocalStorage() {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
  }

  private normalizeLoginBody(body: LoginBody) {
    return {
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    };
  }

  private normalizeRegisterBody(body: RegisterBody) {
    return {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    };
  }

  private setSession(token: string, user: User, rememberMe = true) {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(TOKEN_KEY, token);
    otherStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
  }
}
