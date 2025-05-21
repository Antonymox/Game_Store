import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import type { Game } from "../models/game.model"
import { CartService } from "../services/cart.service"

@Component({
  selector: "app-game-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="game-card">
      <div class="game-image">
        <a [routerLink]="['/games', game.id]">
          <img [src]="game.imageUrl" [alt]="game.title">
          <div class="game-overlay">
            <span class="view-details">Ver detalles</span>
          </div>
        </a>
        <div class="game-badge" *ngIf="game.discount">
          -{{ (game.discount * 100) | number:'1.0-0' }}%
        </div>
      </div>
      
      <div class="game-info">
        <div class="game-category">{{ game.category }}</div>
        <h3 class="game-title">
          <a [routerLink]="['/games', game.id]">{{ game.title }}</a>
        </h3>
        
        <div class="game-rating">
          <div class="stars">
            <span *ngFor="let star of getStars(game.rating)" class="star" [class.half]="star === 0.5" [class.empty]="star === 0">
              <svg *ngIf="star === 1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              <svg *ngIf="star === 0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
              </svg>
              <svg *ngIf="star === 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
              </svg>
            </span>z
          </div>
          <span class="rating-value">{{ game.rating }}</span>
        </div>
        
        <div class="game-price">
          <div class="price-container">
            <span class="original-price" *ngIf="game.discount">{{ game.price | currency:'USD' }}</span>
            <span class="current-price">{{ getCurrentPrice(game) | currency:'USD' }}</span>
          </div>
          <button class="add-to-cart" (click)="addToCart(game)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .game-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      overflow: hidden;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 3px solid var(--border-color);
      position: relative;
    }
    
    .game-card:hover {
      transform: translate(-4px, -4px) rotate(1deg);
      box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
    }
    
    .game-image {
      position: relative;
      height: 180px;
      overflow: hidden;
      border-bottom: 3px solid var(--border-color);
    }
    
    .game-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
      image-rendering: pixelated;
    }
    
    .game-image:hover img {
      transform: scale(1.05);
    }
    
    .game-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .game-image:hover .game-overlay {
      opacity: 1;
    }
    
    .view-details {
      color: white;
      background-color: var(--accent-color);
      padding: 8px 15px;
      border-radius: 0;
      font-weight: 500;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      font-size: 0.7rem;
      text-transform: uppercase;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .game-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: var(--accent-color);
      color: white;
      padding: 5px 10px;
      border-radius: 0;
      font-weight: 600;
      font-size: 0.9rem;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      transform: rotate(5deg);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .game-info {
      padding: 15px;
    }
    
    .game-category {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 5px;
      font-family: var(--retro-font);
      text-transform: uppercase;
    }
    
    .game-title {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      line-height: 1.3;
    }
    
    .game-title a {
      color: var(--heading-color);
      text-decoration: none;
      transition: color 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .game-title a:hover {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .game-rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .stars {
      display: flex;
      color: #ffc107;
      margin-right: 5px;
    }
    
    .star {
      margin-right: 2px;
    }
    
    .rating-value {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-family: var(--retro-font);
    }
    
    .game-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .price-container {
      display: flex;
      flex-direction: column;
    }
    
    .original-price {
      color: var(--text-tertiary);
      text-decoration: line-through;
      font-size: 0.8rem;
      font-family: var(--retro-font);
    }
    
    .current-price {
      color: var(--accent-color);
      font-weight: 700;
      font-size: 1.1rem;
      font-family: var(--pixel-font);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .add-to-cart {
      background-color: var(--bg-tertiary);
      color: white;
      border: 2px solid var(--border-color);
      border-radius: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .add-to-cart:hover {
      background-color: var(--accent-color);
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
  `,
  ],
})
export class GameCardComponent {
  @Input() game!: Game

  constructor(private cartService: CartService) {}

  getStars(rating: number): number[] {
    const stars: number[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Agregar estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(1)
    }

    // Agregar media estrella si es necesario
    if (hasHalfStar) {
      stars.push(0.5)
    }

    // Completar con estrellas vacías hasta llegar a 5
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(0)
    }

    return stars
  }

  getCurrentPrice(game: Game): number {
    return game.discount ? game.price * (1 - game.discount) : game.price
  }

  addToCart(game: Game): void {
    this.cartService.addToCart(game)
  }
}
