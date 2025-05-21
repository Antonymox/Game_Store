import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { Cart } from "../models/cart.model"
import type { Game } from "../models/game.model"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private initialCart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  }

  private cartSubject = new BehaviorSubject<Cart>(this.initialCart)
  public cart$ = this.cartSubject.asObservable()

  constructor() {
    // Cargar carrito del localStorage si existe
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      this.cartSubject.next(JSON.parse(storedCart))
    }
  }

  private updateLocalStorage(cart: Cart): void {
    localStorage.setItem("cart", JSON.stringify(cart))
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

  getCart(): Observable<Cart> {
    return this.cart$
  }

  addToCart(game: Game, quantity = 1): void {
    const currentCart = this.cartSubject.value
    const existingItemIndex = currentCart.items.findIndex((item) => item.game.id === game.id)

    let updatedCart: Cart

    if (existingItemIndex !== -1) {
      // El juego ya está en el carrito, actualizar cantidad
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
      // Agregar nuevo juego al carrito
      updatedCart = {
        ...currentCart,
        items: [...currentCart.items, { game, quantity }],
      }
    }

    // Recalcular totales
    const finalCart = this.recalculateCart(updatedCart)

    // Actualizar estado y localStorage
    this.cartSubject.next(finalCart)
    this.updateLocalStorage(finalCart)
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
      this.cartSubject.next(finalCart)
      this.updateLocalStorage(finalCart)
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
    this.cartSubject.next(finalCart)
    this.updateLocalStorage(finalCart)
  }

  clearCart(): void {
    this.cartSubject.next(this.initialCart)
    localStorage.removeItem("cart")
  }
}
