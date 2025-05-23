import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3001/api/email';

  constructor(private http: HttpClient) {}

  sendReceiptEmail(cart: Cart, userEmail: string, orderNumber: string): Observable<any> {
    const emailData = {
      to: userEmail,
      subject: `Recibo de compra #${orderNumber} - GameStore`,
      cart: cart,
      orderNumber: orderNumber,
      date: new Date(),
      total: cart.totalPrice * 1.16
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/send-receipt`, emailData, { headers });
  }
}