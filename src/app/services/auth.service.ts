import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, catchError, map, tap } from "rxjs"
import type { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Actualiza esto al puerto correcto si es diferente
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
  }

  public getToken(): string | null {
    return localStorage.getItem('token')
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  register(user: User): Observable<boolean> {
    return this.http.post<{message: string, user: User, token: string}>( 
      `${this.apiUrl}/auth/register`, 
      user,
      { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token)
          this.currentUserSubject.next(response.user)
          localStorage.setItem('currentUser', JSON.stringify(response.user))
        }
      }),
      map(response => {
        return true
      }),
      catchError(error => {
        console.error('Error en el registro:', error)
        throw error
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
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        if (response.user && response.token) {
          localStorage.setItem('token', response.token);
          const { password, ...userWithoutPassword } = response.user;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          this.currentUserSubject.next(userWithoutPassword);
        }
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Error en el login:', error);
        // Manejo más específico del error
        if (error.status === 401) {
          throw new Error('Credenciales inválidas');
        } else if (error.status === 404) {
          throw new Error('Usuario no encontrado');
        } else {
          throw new Error('Error en el servidor. Por favor, intente más tarde');
        }
      })
    );
  }  logout(): void {
    // Primero notificar el cambio de estado para que los servicios dependientes se actualicen
    this.currentUserSubject.next(null);
    
    // Luego limpiar el almacenamiento local
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("cart"); // Asegurarnos de limpiar también el carrito local
  }
    // Método para solicitar restablecimiento de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post<{message: string, token?: string}>(
      `${this.apiUrl}/auth/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error en la solicitud de restablecimiento de contraseña:', error);
        throw error;
      })
    );
  }
  
  // Método para verificar código
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<{message: string, token: string}>(
      `${this.apiUrl}/auth/verify-code`,
      { email, code },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error al verificar el código:', error);
        throw error;
      })
    );
  }
  
  // Método para restablecer contraseña
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<{message: string}>(
      `${this.apiUrl}/auth/reset-password`,
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }
}
