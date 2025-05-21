import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game.model';
import { GameCardComponent } from './game-card.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GameCardComponent],
  template: `
    <div class="games-container">
      <div class="games-header">
        <h1>Catálogo de Juegos</h1>
        <p *ngIf="selectedCategory">Categoría: {{ selectedCategory }}</p>
        <p *ngIf="showDiscounted">Ofertas Especiales</p>
      </div>
      
      <div class="games-content">
        <div class="filters-sidebar">
          <div class="filter-section">
            <h3>Categorías</h3>
            <ul class="category-list">
              <li>
                <a 
                  [routerLink]="['/games']" 
                  [queryParams]="{}" 
                  [class.active]="!selectedCategory"
                >
                  Todos los Juegos
                </a>
              </li>
              <li *ngFor="let category of categories">
                <a 
                  [routerLink]="['/games']" 
                  [queryParams]="{category: category}" 
                  [class.active]="selectedCategory === category"
                >
                  {{ category }}
                </a>
              </li>
            </ul>
          </div>
          
          <div class="filter-section">
            <h3>Precio</h3>
            <div class="price-range">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                [(ngModel)]="priceFilter" 
                (ngModelChange)="applyFilters()"
              >
              <div class="price-values">
                <span>$0</span>
                <span>{{priceFilter}}</span>
              </div>
            </div>
          </div>
          
          <div class="filter-section">
            <h3>Ofertas</h3>
            <div class="checkbox-filter">
              <input 
                type="checkbox" 
                id="discounted" 
                [(ngModel)]="showDiscounted" 
                (ngModelChange)="applyFilters()"
              >
              <label for="discounted">Mostrar solo ofertas</label>
            </div>
          </div>
          
          <div class="filter-section">
            <h3>Ordenar por</h3>
            <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
              <option value="relevance">Relevancia</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="name">Nombre</option>
              <option value="rating">Calificación</option>
              <option value="newest">Más Recientes</option>
            </select>
          </div>
          
          <button class="btn-clear-filters" (click)="clearFilters()">Limpiar Filtros</button>
        </div>
        
        <div class="games-grid">
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Buscar juegos..." 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="applyFilters()"
            >
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
          
          <div class="results-info">
            <p>Mostrando {{ filteredGames.length }} de {{ allGames.length }} juegos</p>
          </div>
          
          <div class="games-list" *ngIf="filteredGames.length > 0">
            <app-game-card 
              *ngFor="let game of filteredGames" 
              [game]="game">
            </app-game-card>
          </div>
          
          <div class="no-results" *ngIf="filteredGames.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
            <button class="btn-primary" (click)="clearFilters()">Limpiar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .games-container {
      padding: 20px 0;
    }
    
    .games-header {
      margin-bottom: 30px;
    }
    
    .games-header h1 {
      font-size: 2rem;
      color: #1a1a2e;
      margin-bottom: 10px;
    }
    
    .games-header p {
      color: #666;
      font-size: 1.1rem;
    }
    
    .games-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 30px;
    }
    
    /* Filters Sidebar */
    .filters-sidebar {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 20px;
      height: fit-content;
    }
    
    .filter-section {
      margin-bottom: 25px;
    }
    
    .filter-section h3 {
      font-size: 1.1rem;
      color: #1a1a2e;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .category-list li {
      margin-bottom: 10px;
    }
    
    .category-list a {
      color: #666;
      text-decoration: none;
      transition: color 0.3s;
      display: block;
      padding: 5px 0;
    }
    
    .category-list a:hover, .category-list a.active {
      color: #e94560;
    }
    
    .price-range {
      padding: 0 5px;
    }
    
    .price-range input {
      width: 100%;
      margin-bottom: 10px;
    }
    
    .price-values {
      display: flex;
      justify-content: space-between;
      color: #666;
    }
    
    .checkbox-filter {
      display: flex;
      align-items: center;
    }
    
    .checkbox-filter input {
      margin-right: 10px;
    }
    
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      color: #333;
    }
    
    .btn-clear-filters {
      width: 100%;
      padding: 10px;
      background-color: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-clear-filters:hover {
      background-color: #e9ecef;
    }
    
    /* Games Grid */
    .games-grid {
      display: flex;
      flex-direction: column;
    }
    
    .search-bar {
      position: relative;
      margin-bottom: 20px;
    }
    
    .search-bar input {
      width: 100%;
      padding: 12px 40px 12px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .search-bar button {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
    }
    
    .results-info {
      margin-bottom: 20px;
      color: #666;
    }
    
    .games-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .no-results {
      text-align: center;
      padding: 40px 0;
      color: #666;
    }
    
    .no-results svg {
      color: #e94560;
      margin-bottom: 15px;
    }
    
    .no-results h3 {
      font-size: 1.3rem;
      margin-bottom: 10px;
      color: #1a1a2e;
    }
    
    .no-results p {
      margin-bottom: 20px;
    }
    
    .btn-primary {
      background-color: #e94560;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .btn-primary:hover {
      background-color: #d63553;
    }
    
    @media (max-width: 992px) {
      .games-content {
        grid-template-columns: 1fr;
      }
      
      .filters-sidebar {
        margin-bottom: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `]
})
export class GamesComponent implements OnInit {
  allGames: Game[] = [];
  filteredGames: Game[] = [];
  categories: string[] = [];
  
  // Filtros
  selectedCategory: string = '';
  priceFilter: number = 100;
  showDiscounted: boolean = false;
  sortBy: string = 'relevance';
  searchTerm: string = '';
  
  constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.allGames = games;
      
      // Extraer categorías únicas
      const categorySet = new Set<string>();
      games.forEach(games => categorySet.add(games.category));
      this.categories = Array.from(categorySet);
      
      // Obtener parámetros de la URL
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
        }
        
        if (params['discount'] === 'true') {
          this.showDiscounted = true;
        }
        
        if (params['sort']) {
          this.sortBy = params['sort'];
        }
        
        this.applyFilters();
      });
    });
  }
  
  applyFilters(): void {
    // Filtrar por categoría
    let result = this.allGames;
    
    if (this.selectedCategory) {
      result = result.filter(game => game.category === this.selectedCategory);
    }
    
    // Filtrar por precio
    result = result.filter(game => {
      const price = game.discount ? game.price * (1 - game.discount) : game.price;
      return price <= this.priceFilter;
    });
    
    // Filtrar por descuento
    if (this.showDiscounted) {
      result = result.filter(game => game.discount);
    }
    
    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(term) || 
        game.description.toLowerCase().includes(term)
      );
    }
    
    // Ordenar resultados
    switch (this.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price;
          return priceB - priceA;
        });
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      default:
        // Por defecto, ordenar por relevancia (rating)
        result.sort((a, b) => b.rating - a.rating);
    }
    
    this.filteredGames = result;
  }
  
  clearFilters(): void {
    this.selectedCategory = '';
    this.priceFilter = 100;
    this.showDiscounted = false;
    this.sortBy = 'relevance';
    this.searchTerm = '';
    this.applyFilters();
  }
}
