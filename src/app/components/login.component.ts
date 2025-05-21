import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de nuevo a GameStore</p>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Usuario o Email</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="loginData.username" 
              required 
              #username="ngModel"
              [class.is-invalid]="username.invalid && (username.dirty || username.touched)"
            >
            <div class="invalid-feedback" *ngIf="username.invalid && (username.dirty || username.touched)">
              Usuario o email es requerido
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                [(ngModel)]="loginData.password" 
                required 
                #password="ngModel"
                [class.is-invalid]="password.invalid && (password.dirty || password.touched)"
              >
              <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="password.invalid && (password.dirty || password.touched)">
              Contraseña es requerida
            </div>
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" name="remember" [(ngModel)]="loginData.remember">
              <label for="remember">Recordarme</label>
            </div>
            <a routerLink="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Iniciar Sesión</span>
            <span *ngIf="isLoading">Cargando...</span>
          </button>
        </form>
        
        <div class="login-footer">
          <p>¿No tienes una cuenta? <a routerLink="/register">Regístrate</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .login-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 450px;
      padding: 30px;
      border: 3px solid var(--border-color);
      position: relative;
    }
    
    .login-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.05) 10px,
        transparent 10px,
        transparent 20px
      );
      pointer-events: none;
      z-index: 0;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      z-index: 1;
    }
    
    .login-header h2 {
      color: var(--heading-color);
      margin-bottom: 10px;
      font-size: 1.8rem;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }
    
    .login-header p {
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: 1.2rem;
    }
    
    .alert {
      padding: 12px;
      border-radius: 0;
      margin-bottom: 20px;
      border: 2px solid var(--border-color);
      position: relative;
      z-index: 1;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 2px solid #f5c6cb;
    }
    
    .form-group {
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--pixel-font);
      font-size: 0.8rem;
      text-transform: uppercase;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 12px 15px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: 1rem;
      transition: border-color 0.3s;
      background-color: var(--input-bg);
      color: var(--text-primary);
      font-family: var(--retro-font);
    }
    
    input:focus {
      outline: none;
      box-shadow: 0 0 0 3px var(--accent-color);
    }
    
    .is-invalid {
      border-color: #dc3545 !important;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
      font-family: var(--retro-font);
    }
    
    .password-input {
      position: relative;
    }
    
    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: none;
    }
    
    .toggle-password:hover {
      color: var(--accent-color);
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
    }
    
    .remember-me input {
      margin-right: 8px;
    }
    
    .forgot-password {
      color: var(--accent-color);
      text-decoration: none;
      font-size: 0.9rem;
      font-family: var(--retro-font);
    }
    
    .forgot-password:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .btn-login {
      width: 100%;
      padding: 12px;
      background-color: var(--accent-color);
      color: white;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
    }
    
    .btn-login:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-login:disabled {
      background-color: #e9798e;
      cursor: not-allowed;
      transform: none;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .login-footer {
      text-align: center;
      margin-top: 25px;
      color: var(--text-secondary);
      position: relative;
      z-index: 1;
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }
    
    .login-footer a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-footer a:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    @media (max-width: 480px) {
      .form-options {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .forgot-password {
        margin-top: 10px;
      }
    }
    `
  ]
})
export class LoginComponent {
  loginData = {
    username: "",
    password: "",
    remember: false
  };

  isLoading = false;
  errorMessage = "";
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          this.router.navigate(["/home"]);
        } else {
          this.errorMessage = "Usuario o contraseña incorrectos";
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Ocurrió un error al iniciar sesión. Inténtalo de nuevo.";
        console.error("Error de inicio de sesión:", error);
      }
    });
  }
}