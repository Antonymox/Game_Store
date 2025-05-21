import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { ThemeService, Theme } from "../services/theme.service";
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
      background-color: var(--header-bg, #1a1a2e);
      color: var(--header-text, white);
      padding: 15px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
      color: var(--accent-color, #e94560);
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
      color: var(--header-text, white);
      text-decoration: none;
      font-size: 16px;
      transition: color 0.3s;
      cursor: pointer;
    }
    
    .nav-list a:hover, .nav-list a.active {
      color: var(--accent-color, #e94560);
    }
    
    .categories:hover .dropdown {
      display: block;
    }
    
    .dropdown {
      display: none;
      position: absolute;
      background-color: var(--header-bg, #1a1a2e);
      min-width: 160px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      z-index: 1;
      border-radius: 4px;
      padding: 10px 0;
      margin-top: 10px;
    }
    
    .dropdown a {
      display: block;
      padding: 8px 15px;
      color: var(--header-text, white);
      text-decoration: none;
    }
    
    .dropdown a:hover {
      background-color: rgba(255, 255, 255, 0.1);
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
      border: none;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--header-text, white);
      width: 200px;
    }
    
    .search button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--accent-color, #e94560);
      cursor: pointer;
    }
    
    .cart {
      margin-right: 20px;
      position: relative;
    }
    
    .cart-icon {
      color: var(--header-text, white);
      position: relative;
      display: inline-block;
    }
    
    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--accent-color, #e94560);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .theme-toggle {
      margin-right: 20px;
    }
    
    .theme-toggle-btn {
      background: none;
      border: none;
      color: var(--header-text, white);
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s;
    }
    
    .theme-toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .btn {
      padding: 8px 15px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .btn-login {
      color: var(--header-text, white);
      margin-right: 10px;
    }
    
    .btn-register {
      background-color: var(--accent-color, #e94560);
      color: white;
    }
    
    .btn-register:hover {
      background-color: var(--accent-hover, #d63553);
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
      color: var(--accent-color, #e94560) !important;
    }
  `,
  ],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  currentTheme: Theme = "light";

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService,
  ) {
    console.log("HeaderComponent: Constructor iniciado");
  }

  ngOnInit(): void {
    console.log("HeaderComponent: ngOnInit iniciado");

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.themeService.currentTheme$.subscribe((theme) => {
      console.log(`HeaderComponent: Tema recibido del servicio: ${theme}`);
      this.currentTheme = theme;
    });

    setTimeout(() => {
      console.log("HeaderComponent: Registrando estado del tema después de inicialización");
      this.themeService.logCurrentState();
    }, 1000);

    console.log("HeaderComponent: ngOnInit completado");
  }

  toggleTheme(): void {
    console.log("HeaderComponent: Botón de cambio de tema clickeado");
    this.themeService.toggleTheme();

    setTimeout(() => {
      console.log("HeaderComponent: Registrando estado del tema después del cambio");
      this.themeService.logCurrentState();
    }, 100);
  }

  logout(): void {
    this.authService.logout();
  }
}