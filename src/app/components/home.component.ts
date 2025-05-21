import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { GameService } from "../services/game.service"
import type { Game } from "../models/game.model"
import { GameCardComponent } from "./game-card.component"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, GameCardComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Descubre los mejores juegos digitales</h1>
          <p>Explora nuestra amplia selección de videojuegos para todas las plataformas</p>
          <div class="hero-buttons">
            <a routerLink="/games" class="btn btn-primary">Explorar Juegos</a>
            <a routerLink="/register" class="btn btn-secondary">Registrarse</a>
          </div>
        </div>
      </section>
      
      <!-- Featured Games -->
      <section class="section">
        <div class="section-header">
          <h2>Juegos Destacados</h2>
          <a routerLink="/games" class="view-all">Ver todos</a>
        </div>
        
        <div class="games-grid">
          <app-game-card 
            *ngFor="let game of featuredGames" 
            [game]="game">
          </app-game-card>
        </div>
      </section>
      
      <!-- New Releases -->
      <section class="section">
        <div class="section-header">
          <h2>Nuevos Lanzamientos</h2>
          <a routerLink="/games" [queryParams]="{sort: 'newest'}" class="view-all">Ver todos</a>
        </div>
        
        <div class="games-grid">
          <app-game-card 
            *ngFor="let game of newReleases" 
            [game]="game">
          </app-game-card>
        </div>
      </section>
      
      <!-- Deals -->
      <section class="section">
        <div class="section-header">
          <h2>Ofertas Especiales</h2>
          <a routerLink="/games" [queryParams]="{discount: 'true'}" class="view-all">Ver todas</a>
        </div>
        
        <div class="games-grid">
          <app-game-card 
            *ngFor="let game of discountedGames" 
            [game]="game">
          </app-game-card>
        </div>
      </section>
      
      <!-- Categories -->
      <section class="section categories-section">
        <h2>Explora por Categorías</h2>
        
        <div class="categories-grid">
          <div class="category-card" *ngFor="let category of categories">
            <a routerLink="/games" [queryParams]="{category: category.name}">
              <div class="category-image" [style.background-image]="'url(' + category.image + ')'">
                <div class="category-overlay"></div>
                <h3>{{ category.name }}</h3>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      <!-- Newsletter -->
      <section class="newsletter">
        <div class="newsletter-content">
          <h2>Suscríbete a nuestro boletín</h2>
          <p>Recibe las últimas noticias, ofertas y lanzamientos directamente en tu correo.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico">
            <button class="btn btn-primary">Suscribirse</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
    .home-container {
      width: 100%;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
                url('/asset/Wallpaper.png') no-repeat center center;
      background-size: cover;
      color: white;
      padding: 120px 20px;
      text-align: center;
      margin-bottom: 40px;
      border-radius: 8px;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .hero p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
    }
    
    .btn {
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      display: inline-block;
    }
    
    .btn-primary {
      background-color: #e94560;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #d63553;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;
    }
    
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    /* Sections */
    .section {
      margin-bottom: 60px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .section-header h2 {
      font-size: 1.8rem;
      color: var(--heading-color);
      position: relative;
    }
    
    .section-header h2::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: #e94560;
    }
    
    .view-all {
      color: #e94560;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .view-all:hover {
      color: #d63553;
      text-decoration: underline;
    }
    
    /* Games Grid */
    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    /* Categories */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    
    .category-card {
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
    }
    
    .category-image {
      height: 150px;
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .category-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
    }
    
    .category-image h3 {
      color: white;
      font-size: 1.2rem;
      position: relative;
      z-index: 1;
      text-align: center;
    }
    
    /* Newsletter */
    .newsletter {
      background-color: #1a1a2e;
      color: white;
      padding: 60px 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .newsletter-content {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    
    .newsletter h2 {
      font-size: 1.8rem;
      margin-bottom: 15px;
    }
    
    .newsletter p {
      margin-bottom: 25px;
      opacity: 0.9;
    }
    
    .newsletter-form {
      display: flex;
      gap: 10px;
    }
    
    .newsletter-form input {
      flex: 1;
      padding: 12px 15px;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }
      
      .games-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
      
      .newsletter-form {
        flex-direction: column;
      }
      
      .newsletter-form input, 
      .newsletter-form button {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .hero-buttons {
        flex-direction: column;
      }
      
      .categories-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
  ],
})
export class HomeComponent implements OnInit {
  featuredGames: Game[] = []
  newReleases: Game[] = []
  discountedGames: Game[] = []

  categories = [
    { name: "RPG", image: "/assets/images/categories/rpg.jpg" },
    { name: "Acción/Aventura", image: "/assets/images/categories/action.jpg" },
    { name: "FPS", image: "/assets/images/categories/fps.jpg" },
    { name: "Deportes", image: "/assets/images/categories/sports.jpg" },
  ]

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      // Juegos destacados (los 4 con mejor rating)
      this.featuredGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 4)

      // Nuevos lanzamientos (ordenados por fecha)
      this.newReleases = [...games]
        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        .slice(0, 4)

      // Juegos con descuento
      this.discountedGames = games.filter((game) => game.discount).slice(0, 4)
    })
  }
}
