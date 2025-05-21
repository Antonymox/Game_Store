import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart-container">
      <h1 class="cart-title">Carrito de Compras</h1>
      
      <div class="cart-empty" *ngIf="cart.items.length === 0">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado ningún juego a tu carrito.</p>
        <a routerLink="/games" class="btn-primary">Explorar Juegos</a>
      </div>
      
      <div class="cart-content" *ngIf="cart.items.length > 0">
        <div class="cart-items">
          <div class="cart-header">
            <div class="product-info">Producto</div>
            <div class="product-price">Precio</div>
            <div class="product-quantity">Cantidad</div>
            <div class="product-total">Total</div>
            <div class="product-remove"></div>
          </div>
          
          <div class="cart-item" *ngFor="let item of cart.items">
            <div class="product-info">
              <div class="product-image">
                <img [src]="item.game.imageUrl" [alt]="item.game.title">
              </div>
              <div class="product-details">
                <h3><a [routerLink]="['/games', item.game.id]">{{ item.game.title }}</a></h3>
                <p class="product-category">Ver detalles: {{ item.game.category }}</p>
              </div>
            </div>
            
            <div class="product-price">
              <div *ngIf="item.game.discount" class="price-discount">
                <span class="original-price">{{ item.game.price | currency:'USD' }}</span>
                <span class="discount-badge">-{{ (item.game.discount * 100) | number:'1.0-0' }}%</span>
              </div>
              <div class="current-price">{{ getCurrentPrice(item.game) | currency:'USD' }}</div>
            </div>
            
            <div class="product-quantity">
              <div class="quantity-control">
                <button 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.game.id, item.quantity - 1)"
                  [disabled]="item.quantity <= 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                  </svg>
                </button>
                <input 
                  type="number" 
                  min="1" 
                  [value]="item.quantity" 
                  (change)="onQuantityChange($event, item.game.id)"
                >
                <button 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.game.id, item.quantity + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="product-total">
              {{ (getCurrentPrice(item.game) * item.quantity) | currency:'USD' }}
            </div>
            
            <div class="product-remove">
              <button class="remove-btn" (click)="removeItem(item.game.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="cart-actions">
          <button class="btn-secondary" (click)="clearCart()">Vaciar Carrito</button>
          <a routerLink="/games" class="btn-outline">Continuar Comprando</a>
        </div>
        
        <div class="cart-summary">
          <h2>Resumen del Pedido</h2>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ cart.totalPrice | currency:'USD' }}</span>
          </div>
          
          <div class="summary-row">
            <span>Impuestos (16%)</span>
            <span>{{ (cart.totalPrice * 0.16) | currency:'USD' }}</span>
          </div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ (cart.totalPrice * 1.16) | currency:'USD' }}</span>
          </div>
          
          <div class="promo-code">
            <input type="text" placeholder="Código promocional">
            <button class="btn-apply">Aplicar</button>
          </div>
          
          <button class="btn-checkout">Proceder al Pago</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Tus estilos aquí (sin cambios) */
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }
  
  getCurrentPrice(game: any): number {
    return game.discount ? game.price * (1 - game.discount) : game.price;
  }
  
  onQuantityChange(event: Event, gameId: number): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    this.updateQuantity(gameId, quantity);
  }
  
  updateQuantity(gameId: number, quantity: number): void {
    const parsedQuantity = parseInt(quantity.toString(), 10);
    if (isNaN(parsedQuantity)) {
      return;
    }
    
    this.cartService.updateQuantity(gameId, Math.max(1, parsedQuantity));
  }
  
  removeItem(gameId: number): void {
    this.cartService.removeFromCart(gameId);
  }
  
  clearCart(): void {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }
}
