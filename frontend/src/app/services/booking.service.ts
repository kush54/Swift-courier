import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private customerHeaders(): HttpHeaders {
    const user = this.auth.getUser();
    return new HttpHeaders({
      'X-Customer-Id': user?.customerId || '',
      'X-Role': user?.role || ''
    });
  }

  private officerHeaders(): HttpHeaders {
    const user = this.auth.getUser();
    return new HttpHeaders({ 'X-Role': user?.role || '' });
  }

  calculateCost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/bookings/calculate-cost`, data);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/bookings/create`, data, { headers: this.customerHeaders() });
  }

  processPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/payments/checkout`, data);
  }

  getHistory(page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/customer/bookings/history`, { headers: this.customerHeaders(), params });
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/customer/bookings/${bookingId}/cancel`, {}, { headers: this.customerHeaders() });
  }

  trackBooking(bookingId: string): Observable<any> {
    const user = this.auth.getUser();
    const headers = user ? new HttpHeaders({ 'X-Role': user.role }) : new HttpHeaders();
    return this.http.get(`${this.apiUrl}/shared/track/${bookingId}`, { headers });
  }

  downloadInvoice(bookingId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/shared/invoice/${bookingId}/download`, { responseType: 'blob' });
  }

  getAllBookings(filters: any, page = 0, size = 10): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filters.customerId) params = params.set('customerId', filters.customerId);
    if (filters.bookingId) params = params.set('bookingId', filters.bookingId);
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get(`${this.apiUrl}/officer/bookings/all`, { headers: this.officerHeaders(), params });
  }

  counterBooking(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/officer/bookings/counter-create`, data, { headers: this.officerHeaders() });
  }

  schedulePickup(bookingId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/officer/bookings/${bookingId}/schedule-pickup`, data, { headers: this.officerHeaders() });
  }

  updateStatus(bookingId: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/officer/bookings/${bookingId}/status`, data, { headers: this.officerHeaders() });
  }

  updateGps(bookingId: string, lat: number, lng: number): Observable<any> {
    const params = new HttpParams().set('lat', lat).set('lng', lng);
    return this.http.post(`${this.apiUrl}/officer/bookings/${bookingId}/gps`, {}, { headers: this.officerHeaders(), params });
  }
}

