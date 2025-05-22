import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, catchError, map, tap } from "rxjs"
import type { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  constructor(private http: HttpClient) {
    // Cargar usuario del localStorage si existe
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }  register(user: User): Observable<boolean> {
    return this.http.post<{message: string, user: User, token: string}>(
      `${this.apiUrl}/auth/register`, 
      user,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      map(response => {
        // El registro fue exitoso
        return true;
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        throw error;
      })
    );
  }  login(usernameOrEmail: string, password: string): Observable<User | null> {
    const loginData = {
      email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      username: !usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      password
    };

    return this.http.post<{message: string, user: User, token: string}>(
      `${this.apiUrl}/auth/login`, 
      loginData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        if (response.user && response.token) {
          // Guardar el token
          localStorage.setItem('token', response.token);
          // Guardar el usuario sin contraseña
          const { password, ...userWithoutPassword } = response.user;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          this.currentUserSubject.next(userWithoutPassword);
        }
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Error en el login:', error);
        throw error;
      })
    );
  }
  logout(): void {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
