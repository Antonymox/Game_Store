import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import { HttpClient } from "@angular/common/http"
import type { Cart } from "../models/cart.model"
import type { Game } from "../models/game.model"
import { AuthService } from "./auth.service"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`
  private initialCart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  }

  private cartSubject = new BehaviorSubject<Cart>(this.initialCart)
  public cart$ = this.cartSubject.asObservable()  
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser$.subscribe(user => {
      if (user && this.authService.getToken()) {
        // Si el usuario está autenticado, cargar su carrito desde el backend
        this.loadCart()
      } else {
        // Si no hay usuario autenticado o se cerró sesión
        // Limpiar el carrito local y del backend
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      }
    })
  }

  private loadCart(): void {
    if (!this.authService.isLoggedIn()) {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        this.cartSubject.next(JSON.parse(storedCart))
      }
      return
    }

    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => {
        console.log('Carrito cargado exitosamente:', cart)
        this.cartSubject.next(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error)
        if (error.status === 401) {
          const storedCart = localStorage.getItem('cart')
          if (storedCart) {
            this.cartSubject.next(JSON.parse(storedCart))
          }
        }
      }
    })
  }

  private recalculateCart(cart: Cart): Cart {
    return {
      ...cart,
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: cart.items.reduce((total, item) => {
        const price = item.game.discount ? item.game.price * (1 - item.game.discount) : item.game.price
        return total + price * item.quantity
      }, 0),
    }
  }

  private updateCartInBackend(cart: Cart): void {
    if (!this.authService.isLoggedIn()) {
      this.cartSubject.next(cart)
      localStorage.setItem('cart', JSON.stringify(cart))
      return
    }

    this.http.put<Cart>(this.apiUrl, cart).subscribe({
      next: (updatedCart) => {
        this.cartSubject.next(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
      },
      error: (error) => {
        console.error('Error al actualizar el carrito:', error)
        // Si hay error, mantener la versión local
        this.cartSubject.next(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
    })
  }

  getCart(): Observable<Cart> {
    return this.cart$
  }

  addToCart(game: Game, quantity = 1): void {
    const currentCart = this.cartSubject.value
    const existingItemIndex = currentCart.items.findIndex((item) => item.game.id === game.id)

    let updatedCart: Cart

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentCart.items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      }

      updatedCart = {
        ...currentCart,
        items: updatedItems,
      }
    } else {
      updatedCart = {
        ...currentCart,
        items: [...currentCart.items, { game, quantity }],
      }
    }

    const finalCart = this.recalculateCart(updatedCart)
    this.updateCartInBackend(finalCart)
  }

  updateQuantity(gameId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(gameId)
      return
    }

    const currentCart = this.cartSubject.value
    const existingItemIndex = currentCart.items.findIndex((item) => item.game.id === gameId)

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentCart.items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity,
      }

      const updatedCart = {
        ...currentCart,
        items: updatedItems,
      }

      const finalCart = this.recalculateCart(updatedCart)
      this.updateCartInBackend(finalCart)
    }
  }

  removeFromCart(gameId: number): void {
    const currentCart = this.cartSubject.value
    const updatedItems = currentCart.items.filter((item) => item.game.id !== gameId)
    const updatedCart = {
      ...currentCart,
      items: updatedItems,
    }

    const finalCart = this.recalculateCart(updatedCart)
    this.updateCartInBackend(finalCart)
  }

  clearCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.cartSubject.next(this.initialCart)
      localStorage.removeItem('cart')
      return
    }

    this.http.delete(this.apiUrl).subscribe({
      next: () => {
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      },
      error: (error) => {
        console.error('Error al limpiar el carrito:', error)
        // Si hay error, limpiar localmente
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      }
    })
  }
}
