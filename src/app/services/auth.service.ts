import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of } from "rxjs"
import type { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private users: User[] = []

  constructor() {
    // Cargar usuario del localStorage si existe
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }

    // Usuarios de prueba
    this.users = [
      {
        id: 1,
        username: "usuario1",
        email: "usuario1@example.com",
        password: "password123",
        firstName: "Usuario",
        lastName: "Uno",
      },
    ]
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  register(user: User): Observable<boolean> {
    // Verificar si el usuario ya existe
    const userExists = this.users.some((u) => u.username === user.username || u.email === user.email)

    if (userExists) {
      return of(false)
    }

    // Asignar ID y agregar usuario
    const newUser = {
      ...user,
      id: this.users.length + 1,
    }

    this.users.push(newUser)
    return of(true)
  }

  login(username: string, password: string): Observable<User | null> {
    // Buscar usuario
    const user = this.users.find((u) => (u.username === username || u.email === username) && u.password === password)

    if (user) {
      // Crear copia sin password para almacenar
      const { password, ...userWithoutPassword } = user
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      this.currentUserSubject.next(userWithoutPassword)
      return of(userWithoutPassword)
    }

    return of(null)
  }

  logout(): void {
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue
  }
}
