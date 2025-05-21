import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { ThemeService } from "../services/theme.service";
import { User } from "../models/user.model";
import { Cart } from "../models/cart.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo">
          <a routerLink="/home">
            <h1>GameStore</h1>
          </a>
        </div>
        
        <nav class="nav">
          <ul class="nav-list">
            <li><a routerLink="/home" routerLinkActive="active">Inicio</a></li>
            <li><a routerLink="/games" routerLinkActive="active">Juegos</a></li>
            <li class="categories">
              <a>Categorías</a>
              <div class="dropdown">
                <a routerLink="/games" [queryParams]="{category: 'RPG'}">RPG</a>
                <a routerLink="/games" [queryParams]="{category: 'Acción/Aventura'}">Acción/Aventura</a>
                <a routerLink="/games" [queryParams]="{category: 'FPS'}">FPS</a>
                <a routerLink="/games" [queryParams]="{category: 'Deportes'}">Deportes</a>
              </div>
            </li>
          </ul>
        </nav>
        
        <div class="user-actions">
          <div class="search">
            <input type="text" placeholder="Buscar juegos...">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
          
          <div class="cart">
            <a routerLink="/cart" class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span class="cart-count" *ngIf="cart.totalItems > 0">{{ cart.totalItems }}</span>
            </a>
          </div>

          <div class="theme-toggle">
            <button (click)="toggleTheme()" class="theme-toggle-btn" aria-label="Cambiar tema">
              <svg *ngIf="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
              </svg>
              <svg *ngIf="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
              </svg>
            </button>
          </div>
          
          <div class="auth-buttons" *ngIf="!currentUser">
            <a routerLink="/login" class="btn btn-login">Iniciar Sesión</a>
            <a routerLink="/register" class="btn btn-register">Registrarse</a>
          </div>
          
          <div class="user-menu" *ngIf="currentUser">
            <div class="user-info">
              <span>Hola, {{ currentUser.firstName || currentUser.username }}</span>
              <div class="dropdown">
                <a routerLink="/profile">Mi Perfil</a>
                <a routerLink="/orders">Mis Pedidos</a>
                <a (click)="logout()" class="logout">Cerrar Sesión</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
      background-color: var(--header-bg);
      color: var(--header-text);
      padding: 15px 0;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
      border-bottom: 3px solid var(--border-color);
      position: relative;
      z-index: 10;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }
    
    .logo a {
      text-decoration: none;
      color: white;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-list li {
      margin: 0 15px;
      position: relative;
    }
    
    .nav-list a {
      color: var(--header-text);
      text-decoration: none;
      font-size: 16px;
      transition: color 0.3s;
      cursor: pointer;
      font-family: var(--pixel-font);
      font-size: 0.8rem;
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .nav-list a:hover, .nav-list a.active {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .categories:hover .dropdown {
      display: block;
    }
    
    .dropdown {
      display: none;
      position: absolute;
      background-color: var(--bg-secondary);
      min-width: 160px;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      z-index: 1;
      border-radius: 0;
      padding: 10px 0;
      margin-top: 10px;
      border: 3px solid var(--border-color);
    }
    
    .dropdown a {
      display: block;
      padding: 8px 15px;
      color: var(--text-primary);
      text-decoration: none;
    }
    
    .dropdown a:hover {
      background-color: var(--bg-tertiary);
      color: var(--accent-color);
    }
    
    .user-actions {
      display: flex;
      align-items: center;
    }
    
    .search {
      display: flex;
      margin-right: 20px;
      position: relative;
    }
    
    .search input {
      padding: 8px 15px;
      border: 3px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-primary);
      width: 200px;
      font-family: var(--retro-font);
      font-size: 1rem;
    }
    
    .search button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--accent-color);
      cursor: pointer;
      box-shadow: none;
    }
    
    .search button:hover {
      transform: translateY(-50%) scale(1.1);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .cart {
      margin-right: 20px;
      position: relative;
    }
    
    .cart-icon {
      color: var(--header-text);
      position: relative;
      display: inline-block;
    }
    
    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--accent-color);
      color: white;
      border-radius: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
    }

    .theme-toggle {
      margin-right: 20px;
    }
    
    .theme-toggle-btn {
      background: none;
      border: 2px solid var(--border-color);
      color: var(--header-text);
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
      transition: background-color 0.3s;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .theme-toggle-btn:hover {
      background-color: var(--bg-tertiary);
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn {
      padding: 8px 15px;
      border-radius: 0;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      font-size: 0.7rem;
      text-transform: uppercase;
      border: 2px solid var(--border-color);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-login {
      color: var(--header-text);
      margin-right: 10px;
      background-color: transparent;
    }
    
    .btn-register {
      background-color: var(--accent-color);
      color: white;
    }
    
    .btn-register:hover, .btn-login:hover {
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .user-info {
      position: relative;
      cursor: pointer;
    }
    
    .user-info:hover .dropdown {
      display: block;
    }
    
    .user-info .dropdown {
      right: 0;
      left: auto;
    }
    
    .logout {
      cursor: pointer;
      color: var(--accent-color) !important;
    }
    `
  ]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  currentTheme: 'light' | 'dark' = 'light';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}