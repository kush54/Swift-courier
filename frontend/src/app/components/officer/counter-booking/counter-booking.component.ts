import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ToastService } from '../../../services/toast.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GeocodingService } from '../../../services/geocoding.service';
declare var L: any;

@Component({
  selector: 'app-counter-booking',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <h2>Counter Booking</h2>
          <p>Create booking for walk-in customers</p>
        </div>

        <div *ngIf="success" class="card"
          style="text-align:center;padding:48px;max-width:560px;
          margin:0 auto">
          <div style="font-size:64px;margin-bottom:16px">✅</div>
          <h2 style="color:var(--accent-success);margin-bottom:8px">
            Booking Created!
          </h2>
          <p style="color:var(--text-secondary);margin-bottom:8px">
            Booking ID:
            <strong style="color:var(--accent-primary);
              font-family:var(--font-display);font-size:1.2rem">
              {{createdBooking?.bookingId}}
            </strong>
          </p>
          <p style="color:var(--text-secondary);margin-bottom:24px">
            Total:
            <strong style="color:var(--accent-success)">
              ₹{{createdBooking?.totalServiceCost}}
            </strong>
            (includes ₹25 admin fee)
          </p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn btn-primary" (click)="resetForm()">
              <span class="material-icons">add_circle</span>
              New Booking
            </button>
            <button class="btn btn-secondary"
              (click)="router.navigate(['/officer/bookings'])">
              <span class="material-icons">list_alt</span>
              All Bookings
            </button>

              <button
    *ngIf="createdBooking?.status === 'BOOKED'"
    style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;
    padding:8px 16px;border-radius:8px;cursor:pointer;
    display:flex;align-items:center;gap:6px"
    (click)="cancelBooking()">
    <span class="material-icons" style="font-size:16px">cancel</span>
    Cancel Booking
  </button>
          </div>
        </div>

        <div *ngIf="!success" class="booking-container">
          <div class="card">
            <h3 style="margin-bottom:24px">
              👤 Customer & Receiver Details
            </h3>

            <div *ngIf="error" class="alert alert-error">
              <span class="material-icons"
                style="font-size:18px">error</span>
              {{error}}
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Customer ID
                  <span style="color:var(--text-muted);
                    font-weight:400;margin-left:4px">
                    (optional for walk-in)
                  </span>
                </label>
                <input class="form-control" type="text"
                  [(ngModel)]="form.customerId"
                  placeholder="CUST-1001 or leave blank">
              </div>
              <div class="form-group">
                <label>Payment Mode *</label>
                <select class="form-control"
                  [(ngModel)]="form.paymentMode">
                  <option value="CASH">Cash</option>
                  <option value="POS">POS / Card</option>
                </select>
              </div>
            </div>

            <div style="height:1px;background:var(--border-subtle);
              margin:8px 0 24px"></div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Receiver Name *</label>
                <input class="form-control" type="text"
                  [(ngModel)]="form.receiverName"
                  placeholder="Full name">
              </div>
              <div class="form-group">
                <label>Receiver Mobile *</label>
               <input class="form-control"
  type="tel"
  maxlength="10"
  pattern="[6-9]{1}[0-9]{9}"
  [(ngModel)]="form.receiverMobile">
              </div>
            </div>

            <div class="form-group">
              <label>Delivery Address *</label>
              <input class="form-control" type="text"
                [(ngModel)]="form.receiverAddress"
                placeholder="Full delivery address">
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>PIN Code</label>
              <input class="form-control"
  type="text"
  maxlength="6"
  pattern="[0-9]{6}"
  [(ngModel)]="form.receiverPin">
              </div>
              <div class="form-group">
                <label>Parcel Contents</label>
                <input class="form-control" type="text"
                  [(ngModel)]="form.parcelContentsDescription"
                  placeholder="e.g. Documents, Electronics">
              </div>
            </div>

            <div style="height:1px;background:var(--border-subtle);
              margin:8px 0 24px"></div>
            <h3 style="margin-bottom:20px">
              📦 Parcel Details
            </h3>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Weight (grams) *</label>
               <input class="form-control"
  type="number"
  min="1"
  max="50000"
  [(ngModel)]="form.parcelWeightGrams">
              </div>
              <div class="form-group">
                <label>Delivery Type *</label>
                <select class="form-control"
                  [(ngModel)]="form.deliveryType"
                  (change)="calculatePrice()">
                  <option value="STANDARD">Standard</option>
                  <option value="EXPRESS">Express (+₹100)</option>
                  <option value="OVERNIGHT">
                    Overnight (+₹200)
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Packing Preference *</label>
                <select class="form-control"
                  [(ngModel)]="form.packingPreference"
                  (change)="calculatePrice()">
                  <option value="BASIC">Basic</option>
                  <option value="FRAGILE">
                    Fragile (+₹50)
                  </option>
                  <option value="HEAVY_DUTY">
                    Heavy Duty (+₹80)
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Pickup Time</label>
              <input class="form-control"
  type="datetime-local"
  [min]="minDateTime"
  [(ngModel)]="form.pickupTime">
              </div>
            </div>


            <!-- ✅ Map + Route section — pickup ke baad add karo -->
<div style="height:1px;background:var(--border-subtle);margin:8px 0 24px"></div>
<h3 style="margin-bottom:20px">🗺️ Route Planning</h3>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
  <!-- Origin -->
  <div class="form-group">
    <label>Origin (Pickup Point)</label>
    <div style="position:relative">
      <input class="form-control" [(ngModel)]="originQuery"
        placeholder="Search city or area..."
        (input)="originSearch$.next(originQuery);showOriginList=true"
        (focus)="showOriginList=true">
      <div *ngIf="showOriginList && originSuggestions.length"
        style="position:absolute;top:100%;left:0;right:0;z-index:100;
        background:white;border:1px solid var(--border);border-radius:8px;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);max-height:200px;overflow-y:auto">
        <div *ngFor="let s of originSuggestions"
          style="padding:10px 14px;cursor:pointer;font-size:13px;
          border-bottom:1px solid var(--border)"
          (click)="selectOrigin(s)">
          📍 {{s.display_name | slice:0:60}}...
        </div>
      </div>
    </div>
    <div *ngIf="form.originLat"
      style="font-size:11px;color:green;margin-top:4px">
      ✅ {{form.originLat|number:'1.4-4'}}, {{form.originLng|number:'1.4-4'}}
    </div>
  </div>

  <!-- Destination -->
  <div class="form-group">
    <label>Destination (Delivery Point)</label>
    <div style="position:relative">
      <input class="form-control" [(ngModel)]="destQuery"
        placeholder="Search city or area..."
        (input)="destSearch$.next(destQuery);showDestList=true"
        (focus)="showDestList=true">
      <div *ngIf="showDestList && destSuggestions.length"
        style="position:absolute;top:100%;left:0;right:0;z-index:100;
        background:white;border:1px solid var(--border);border-radius:8px;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);max-height:200px;overflow-y:auto">
        <div *ngFor="let s of destSuggestions"
          style="padding:10px 14px;cursor:pointer;font-size:13px;
          border-bottom:1px solid var(--border)"
          (click)="selectDest(s)">
          🎯 {{s.display_name | slice:0:60}}...
        </div>
      </div>
    </div>
    <div *ngIf="form.destLat"
      style="font-size:11px;color:green;margin-top:4px">
      ✅ {{form.destLat|number:'1.4-4'}}, {{form.destLng|number:'1.4-4'}}
    </div>
  </div>
</div>

<!-- Show Map Button -->
<button class="btn btn-secondary" style="margin-bottom:16px"
  *ngIf="!showMap && form.originLat && form.destLat"
  (click)="showMap=true;initMap()">
  <span class="material-icons">map</span> Show Route Map
</button>

<!-- Map -->
<div *ngIf="showMap" style="border-radius:12px;overflow:hidden;
  border:1px solid var(--border);margin-bottom:16px">
  <div id="counter-map" style="height:400px;width:100%"></div>
</div>

<!-- Route Selection -->
<div *ngIf="routes.length" style="margin-bottom:16px">
  <div style="font-size:12px;font-weight:700;text-transform:uppercase;
    letter-spacing:1px;color:var(--text-secondary);margin-bottom:10px">
    Select Route for Courier
  </div>
  <div *ngFor="let r of routes; let i=index"
    style="display:flex;align-items:center;gap:10px;padding:10px 14px;
    border-radius:8px;cursor:pointer;border:2px solid;margin-bottom:6px;transition:all 0.15s"
    [style.borderColor]="selectedRoute===i ? routeColors[i] : 'var(--border)'"
    [style.background]="selectedRoute===i ? 'rgba(0,255,136,0.05)' : 'white'"
    (click)="selectRouteItem(i)">
    <div style="width:12px;height:12px;border-radius:50%;flex-shrink:0"
      [style.background]="routeColors[i]"></div>
    <div style="flex:1">
      <span style="font-weight:700;font-size:13px">Route {{i+1}}</span>
      <span *ngIf="r.distance === getShortestDistance()"
        style="font-size:10px;background:rgba(0,255,136,0.15);
        color:green;padding:2px 7px;border-radius:10px;margin-left:6px">
        SHORTEST ⭐
      </span>
      <span *ngIf="r.distance === getLongestDistance() && routes.length > 1"
        style="font-size:10px;background:rgba(255,107,53,0.15);
        color:orange;padding:2px 7px;border-radius:10px;margin-left:6px">
        LONGEST
      </span>
      <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">
        {{(r.distance/1000)|number:'1.1-1'}} km
        · ~{{(r.duration/60)|number:'1.0-0'}} min
      </div>
    </div>
    <span class="material-icons" *ngIf="selectedRoute===i"
      style="color:green">check_circle</span>
  </div>
</div>

            <!-- Price Breakdown -->
            <div class="price-box" *ngIf="price">
              <div style="font-size:12px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--accent-primary);margin-bottom:14px">
                💰 Price Breakdown (with Admin Fee)
              </div>
              <div class="price-row">
                <span class="price-label">Base Rate</span>
                <span>₹{{price.baseRate}}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Weight Charge</span>
                <span>₹{{price.weightCharge}}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Delivery Charge</span>
                <span>₹{{price.deliveryCharge}}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Packing Charge</span>
                <span>₹{{price.packingCharge}}</span>
              </div>
              <div class="price-row">
                <span class="price-label">GST (18%)</span>
                <span>₹{{price.taxAmount}}</span>
              </div>
              <div class="price-row"
                style="color:var(--accent-warning)">
                <span class="price-label">Admin Fee</span>
                <span>₹25.00</span>
              </div>
              <div class="price-row total">
                <span>Total Payable</span>
                <span>₹{{price.totalServiceCost}}</span>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;
              margin-top:24px;gap:12px">
              <button class="btn btn-secondary"
                (click)="resetForm()">
                <span class="material-icons">refresh</span>
                Reset
              </button>
              <button class="btn btn-primary"
                (click)="submitBooking()"
                [disabled]="submitting">
                <div *ngIf="submitting" class="spinner"
                  style="width:16px;height:16px;border-width:2px">
                </div>
                <span class="material-icons" *ngIf="!submitting">
                  receipt
                </span>
                {{submitting ? 'Creating...' : 'Create & Mark Booked'}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .main-with-sidebar {
    flex: 1;
    width: 100%;
    min-width: 0;
  }

  .page-content {
    width: 100%;
    max-width: 100%;
    padding: 24px;
    box-sizing: border-box;
  }

  .booking-container {
    width: 100%;
    max-width: 100%;
  }

  .card {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .grid {
    display: grid;
    gap: 16px;
    width: 100%;
  }

  .grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form-control {
    width: 100%;
    box-sizing: border-box;
  }

  .price-box {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 20px;
    margin-top: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }
  }
`]
})
export class CounterBookingComponent implements OnInit {
  price: any = null;
  submitting = false;
  success = false;
  error = '';
  createdBooking: any = null;

  minDateTime = new Date().toISOString().slice(0, 16);
  // Map variables
  map: any;
  originMarker: any;
  destMarker: any;
  routes: any[] = [];
  routeLayers: any[] = [];
  routeColors = ['#00ff88', '#00f5ff', '#ff6b35', '#8b5cf6'];
  selectedRoute = 0;
  originQuery = '';
  destQuery = '';
  originSuggestions: any[] = [];
  destSuggestions: any[] = [];
  showOriginList = false;
  showDestList = false;
  showMap = false;
  originSearch$ = new Subject<string>();
  destSearch$ = new Subject<string>();

  getShortestDistance(): number {
    return Math.min(...this.routes.map((r: any) => r.distance));
  }
  getLongestDistance(): number {
    return Math.max(...this.routes.map((r: any) => r.distance));
  }

  form: any = {
    customerId: '', receiverName: '', receiverAddress: '',
    receiverPin: '', receiverMobile: '', parcelWeightGrams: 500,
    parcelContentsDescription: '', deliveryType: 'STANDARD',
    packingPreference: 'BASIC', pickupTime: '',
    paymentMode: 'CASH', originLat: 0, originLng: 0,
    destLat: 0, destLng: 0
  };

  constructor(
    public router: Router,
    private bookingService: BookingService,
    private geoService: GeocodingService, // ✅ add

    private toast: ToastService
  ) { }

  // ngOnInit() { this.calculatePrice(); }

  ngOnInit() {
    this.calculatePrice();

    this.originSearch$.pipe(
      debounceTime(400),
      switchMap(q => this.geoService.searchPlaces(q))
    ).subscribe(r => this.originSuggestions = r);

    this.destSearch$.pipe(
      debounceTime(400),
      switchMap(q => this.geoService.searchPlaces(q))
    ).subscribe(r => this.destSuggestions = r);
  }

  initMap() {
    setTimeout(() => {
      if (this.map) { this.map.remove(); this.map = null; }
      this.map = L.map('counter-map').setView([22.9734, 78.6569], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap' }).addTo(this.map);
      if (this.form.originLat) this.placeOriginMarker();
      if (this.form.destLat) this.placeDestMarker();
      if (this.form.originLat && this.form.destLat) this.fetchRoutes();
    }, 300);
  }

  selectOrigin(s: any) {
    this.originQuery = s.display_name;
    this.form.originLat = parseFloat(s.lat);
    this.form.originLng = parseFloat(s.lon);
    this.showOriginList = false;
    this.originSuggestions = [];
    this.placeOriginMarker();
    // if (this.form.destLat) this.fetchRoutes();
    if (this.form.destLat) {
      this.fetchRoutes();
      this.calculatePrice(); // ✅ distance mil gaya
    }
  }

  cancelBooking() {
  if (!confirm('Cancel booking ' + this.createdBooking.bookingId + '?')) return;
  this.bookingService.cancelBooking(this.createdBooking.bookingId).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.toast.success('Booking cancelled');
        this.createdBooking.status = 'CANCELLED';
      } else {
        this.toast.error(res.message || 'Cancel failed');
      }
    },
    error: (err: any) => {
      this.toast.error(err.error?.message || 'Cancel failed');
    }
  });
}

  selectDest(s: any) {
    this.destQuery = s.display_name;
    this.form.destLat = parseFloat(s.lat);
    this.form.destLng = parseFloat(s.lon);
    this.showDestList = false;
    this.destSuggestions = [];
    this.placeDestMarker();
    // if (this.form.originLat) this.fetchRoutes();
    if (this.form.originLat) {
      this.fetchRoutes();
      this.calculatePrice(); // ✅
    }
  }

  placeOriginMarker() {
    if (!this.map) return;
    if (this.originMarker) this.map.removeLayer(this.originMarker);
    const icon = L.divIcon({
      html: `<div style="width:14px;height:14px;border-radius:50%;
      background:#00f5ff;border:3px solid #fff;
      box-shadow:0 0 10px rgba(0,245,255,0.8)"></div>`,
      iconSize: [14, 14], className: ''
    });
    this.originMarker = L.marker(
      [this.form.originLat, this.form.originLng], { icon }
    ).addTo(this.map).bindPopup('📍 Origin');
    this.map.setView([this.form.originLat, this.form.originLng], 12);
  }

  placeDestMarker() {
    if (!this.map) return;
    if (this.destMarker) this.map.removeLayer(this.destMarker);
    const icon = L.divIcon({
      html: `<div style="width:14px;height:14px;border-radius:50%;
      background:#ff2d78;border:3px solid #fff;
      box-shadow:0 0 10px rgba(255,45,120,0.8)"></div>`,
      iconSize: [14, 14], className: ''
    });
    this.destMarker = L.marker(
      [this.form.destLat, this.form.destLng], { icon }
    ).addTo(this.map).bindPopup('🎯 Destination');
  }

  fetchRoutes() {
    this.routeLayers.forEach(l => this.map.removeLayer(l));
    this.routeLayers = []; this.routes = [];
    this.geoService.getRoutes(
      this.form.originLat, this.form.originLng,
      this.form.destLat, this.form.destLng
    ).subscribe({
      next: (res: any) => {
        if (res.routes?.length) {
          let routes = res.routes;
          if (routes.length === 1) {
            const b = routes[0];
            routes = [b,
              { ...b, distance: b.distance * 1.12, duration: b.duration * 1.18 },
              { ...b, distance: b.distance * 1.25, duration: b.duration * 1.35 }
            ];
          }
          this.routes = routes.sort((a: any, b: any) => a.distance - b.distance);
          this.drawRoutes();
        }
      },
      error: () => this.drawStraightLine()
    });
  }

  drawRoutes() {
    this.routes.forEach((route: any, i: number) => {
      const coords = this.geoService.decodePolyline(route.geometry.coordinates);
      const line = L.polyline(coords, {
        color: this.routeColors[i] || '#8b5cf6',
        weight: i === 0 ? 5 : 3,
        opacity: i === 0 ? 0.9 : 0.5,
        dashArray: i === 0 ? null : '8,6'
      }).addTo(this.map);
      this.routeLayers.push(line);
    });
    if (this.routeLayers.length) {
      this.map.fitBounds(
        L.featureGroup(this.routeLayers).getBounds(), { padding: [40, 40] });
    }
  }

  drawStraightLine() {
    const line = L.polyline([
      [this.form.originLat, this.form.originLng],
      [this.form.destLat, this.form.destLng]
    ], { color: '#00ff88', weight: 4, dashArray: '10,8' }).addTo(this.map);
    this.routeLayers.push(line);
    this.map.fitBounds(line.getBounds(), { padding: [40, 40] });
  }

  selectRouteItem(i: number) {
    this.selectedRoute = i;
    this.routeLayers.forEach((l, idx) => l.setStyle({
      weight: idx === i ? 5 : 3,
      opacity: idx === i ? 0.9 : 0.4
    }));
  }

  // calculatePrice() {
  //   if (!this.form.parcelWeightGrams) return;
  //   this.bookingService.calculateCost({
  //     parcelWeightGrams: this.form.parcelWeightGrams,
  //     deliveryType: this.form.deliveryType,
  //     packingPreference: this.form.packingPreference
  //   }).subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         this.price = res.data;
  //         this.price.totalServiceCost =
  //           (parseFloat(this.price.totalServiceCost) + 25)
  //             .toFixed(2);
  //       }
  //     }
  //   });
  // }


  // CounterBookingComponent
  calculatePrice() {
    if (!this.form.parcelWeightGrams) return;
    this.bookingService.calculateCost({
      parcelWeightGrams: this.form.parcelWeightGrams,
      deliveryType: this.form.deliveryType,
      packingPreference: this.form.packingPreference,
      originLat: this.form.originLat || 0,  // ✅
      originLng: this.form.originLng || 0,  // ✅
      destLat: this.form.destLat || 0,      // ✅
      destLng: this.form.destLng || 0       // ✅
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.price = res.data;
          // ✅ Admin fee add — backend already add karta hai distance
          // sirf officer counter booking ke liye +25
        }
      }
    });
  }
  // submitBooking() {
  //   if (!this.form.receiverName || !this.form.receiverMobile
  //     || !this.form.receiverAddress) {
  //     this.error = 'Please fill all required fields.';
  //     return;
  //   }
  //   this.submitting = true;
  //   this.error = '';
  //   this.bookingService.counterBooking(this.form).subscribe({
  //     next: (res: any) => {
  //       this.submitting = false;
  //       if (res.success) {
  //         this.createdBooking = res.data;
  //         this.success = true;
  //         this.toast.success(
  //           'Counter booking created: '
  //           + res.data.bookingId);
  //       } else {
  //         this.error = res.message;
  //       }
  //     },
  //     error: (err: any) => {
  //       this.submitting = false;
  //       this.error = err.error?.message
  //         || 'Booking failed.';
  //     }
  //   });
  // }


  submitBooking() {

    this.error = '';

    // Receiver Name
    if (!this.form.receiverName?.trim()) {
      this.toast.error('Receiver name is required');
      return;
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(this.form.receiverMobile)) {
      this.toast.error('Enter valid 10-digit mobile number');
      return;
    }

    // Address
    if (!this.form.receiverAddress?.trim()) {
      this.toast.error('Delivery address is required');
      return;
    }

    if (this.form.receiverAddress.trim().length < 10) {
      this.toast.error('Address is too short');
      return;
    }

    // PIN validation
    if (this.form.receiverPin) {

      const pinRegex = /^[1-9][0-9]{5}$/;

      if (!pinRegex.test(this.form.receiverPin)) {
        this.toast.error('Enter valid 6-digit PIN code');
        return;
      }
    }

    // Parcel Weight
    if (!this.form.parcelWeightGrams ||
      this.form.parcelWeightGrams <= 0) {

      this.toast.error('Parcel weight must be greater than 0');
      return;
    }

    // Max weight check
    if (this.form.parcelWeightGrams > 50000) {
      this.toast.error('Maximum allowed weight is 50kg');
      return;
    }

    // Parcel description
    if (!this.form.parcelContentsDescription?.trim()) {
      this.toast.error('Parcel contents description required');
      return;
    }

    // Pickup Time validation
    if (this.form.pickupTime) {

      const pickup = new Date(this.form.pickupTime);
      const now = new Date();

      if (pickup <= now) {
        this.toast.error('Pickup time must be in future');
        return;
      }
    }

    // Origin validation
    if (!this.form.originLat || !this.form.originLng) {
      this.toast.error('Please select origin location');
      return;
    }

    // Destination validation
    if (!this.form.destLat || !this.form.destLng) {
      this.toast.error('Please select destination location');
      return;
    }

    // Same location validation
    const sameLocation =
      Math.abs(this.form.originLat - this.form.destLat) < 0.0001 &&
      Math.abs(this.form.originLng - this.form.destLng) < 0.0001;

    if (sameLocation) {
      this.toast.error(
        'Origin and destination cannot be same'
      );
      return;
    }

    // Route validation
    if (!this.routes.length) {
      this.toast.error('Please generate route');
      return;
    }

    // Customer ID validation (optional)
    if (this.form.customerId?.trim()) {

      const custRegex = /^CUST-\d+$/i;

      if (!custRegex.test(this.form.customerId.trim())) {
        this.toast.error(
          'Customer ID format should be like CUST-1001'
        );
        return;
      }
    }

    // Price validation
    if (!this.price) {
      this.toast.error('Unable to calculate price');
      return;
    }

    // SUBMIT
    this.submitting = true;

    this.bookingService.counterBooking(this.form).subscribe({

      next: (res: any) => {

        this.submitting = false;

        if (res.success) {

          this.createdBooking = res.data;

          this.success = true;

          this.toast.success(
            'Counter booking created: ' +
            res.data.bookingId
          );

        } else {

          this.error = res.message;
        }
      },

      error: (err: any) => {

        this.submitting = false;

        this.error =
          err.error?.message || 'Booking failed.';
      }

    });
  }



  resetForm() {
    this.success = false;
    this.error = '';
    this.createdBooking = null;
    this.form = {
      customerId: '', receiverName: '',
      receiverAddress: '', receiverPin: '',
      receiverMobile: '', parcelWeightGrams: 500,
      parcelContentsDescription: '',
      deliveryType: 'STANDARD',
      packingPreference: 'BASIC',
      pickupTime: '', paymentMode: 'CASH',
      originLat: 0, originLng: 0,
      destLat: 0, destLng: 0
    };
    this.calculatePrice();
  }
}



