import {
  Component, OnInit, AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { GeocodingService } from '../../../services/geocoding.service';
import { ToastService } from '../../../services/toast.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

declare var L: any;

@Component({
  selector: 'app-create-booking',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar" style="width:100%">
      <div class="page-content" style="max-width:100%">
        <div class="page-header">
          <h2>New Booking</h2>
          <p>Book a parcel in 3 simple steps</p>
        </div>

        <!-- Steps -->
        <div class="steps-bar">
          <div class="sb-step"
            [class.active]="step===1"
            [class.done]="step>1">
            <div class="sb-circle">
              <span class="material-icons"
                *ngIf="step>1"
                style="font-size:15px">check</span>
              <span *ngIf="step<=1">1</span>
            </div>
            <span>Receiver</span>
          </div>
          <div class="sb-line" [class.done]="step>1"></div>
          <div class="sb-step"
            [class.active]="step===2"
            [class.done]="step>2">
            <div class="sb-circle">
              <span class="material-icons"
                *ngIf="step>2"
                style="font-size:15px">check</span>
              <span *ngIf="step<=2">2</span>
            </div>
            <span>Parcel</span>
          </div>
          <div class="sb-line" [class.done]="step>2"></div>
          <div class="sb-step" [class.active]="step===3">
            <div class="sb-circle">3</div>
            <span>Route & Confirm</span>
          </div>
        </div>

        <!-- STEP 1 -->
        <div class="card animate-in" *ngIf="step===1">
          <h3 style="margin-bottom:22px">
            📦 Receiver Details
          </h3>
          <div class="g2" style="display:grid;
            grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label>Receiver Name *</label>
              <input class="form-control"
                [(ngModel)]="form.receiverName"
                placeholder="Full name"
                [class.error]="s1err.name">
              <div class="field-error" *ngIf="s1err.name">
                {{s1err.name}}
              </div>
            </div>
            <div class="form-group">
              <label>Mobile Number *</label>
              <input class="form-control" type="tel"
                [(ngModel)]="form.receiverMobile"
                placeholder="10-digit number"
                maxlength="10"
                [class.error]="s1err.mobile">
              <div class="field-error" *ngIf="s1err.mobile">
                {{s1err.mobile}}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Delivery Address *</label>
            <input class="form-control"
              [(ngModel)]="form.receiverAddress"
              placeholder="Full delivery address"
              [class.error]="s1err.address">
            <div class="field-error" *ngIf="s1err.address">
              {{s1err.address}}
            </div>
          </div>
          <div class="g2" style="display:grid;
            grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label>PIN Code</label>
              <input class="form-control"
                [(ngModel)]="form.receiverPin"
                placeholder="6-digit PIN" maxlength="6"  [class.error]="s1err.pin">
                  <div class="field-error" *ngIf="s1err.pin">  <!-- ✅ yahan -->
    {{s1err.pin}}
  </div>
            </div>

            <div class="form-group">
              <label>Pickup Time</label>
              <input class="form-control"
                type="datetime-local"
                [(ngModel)]="form.pickupTime" [class.error]="s1err.pickupTime">
                 <div class="field-error" *ngIf="s1err.pickupTime">  <!-- ✅ yahan -->
    {{s1err.pickupTime}}
  </div>
            </div>

          </div>
          <div style="display:flex;
            justify-content:flex-end;margin-top:8px">
            <button class="btn btn-primary"
              (click)="goStep2()">
              Next: Parcel Details
              <span class="material-icons">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div class="card animate-in" *ngIf="step===2">
          <h3 style="margin-bottom:22px">
            📋 Parcel Details & Pricing
          </h3>
          <div class="g2" style="display:grid;
            grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label>Weight (grams) *</label>
              <input class="form-control" type="number"
                [(ngModel)]="form.parcelWeightGrams"
                placeholder="e.g. 500" min="1"
                (change)="calcPrice()">
            </div>
            <div class="form-group">
              <label>Delivery Type</label>
              <select class="form-control"
                [(ngModel)]="form.deliveryType"
                (change)="calcPrice()">
                <option value="STANDARD">
                  Standard — Free
                </option>
                <option value="EXPRESS">
                  Express — +₹100
                </option>
                <option value="OVERNIGHT">
                  Overnight — +₹200
                </option>
              </select>
            </div>
          </div>
          <div class="g2" style="display:grid;
            grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label>Packing Type</label>
              <select class="form-control"
                [(ngModel)]="form.packingPreference"
                (change)="calcPrice()">
                <option value="BASIC">Basic — Free</option>
                <option value="FRAGILE">
                  Fragile — +₹50
                </option>
                <option value="HEAVY_DUTY">
                  Heavy Duty — +₹80
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Contents</label>
              <input class="form-control"
                [(ngModel)]="form.parcelContentsDescription"
                placeholder="e.g. Documents, Clothes">
            </div>
          </div>

          <!-- Live price -->
          <div class="price-box" *ngIf="price">
            <div class="pb-title">
              <span class="material-icons"
                style="font-size:16px;
                color:var(--cyan)">receipt</span>
              Live Price Estimate
            </div>
            <div class="price-row">
              <span class="pl">Base Rate</span>
              <span>₹{{price.baseRate}}</span>
            </div>
            <div class="price-row">
              <span class="pl">Weight
                ({{form.parcelWeightGrams}}g)</span>
              <span>₹{{price.weightCharge}}</span>
            </div>
            <div class="price-row">
              <span class="pl">Delivery</span>
              <span>₹{{price.deliveryCharge}}</span>
            </div>
            <div class="price-row">
              <span class="pl">Packing</span>
              <span>₹{{price.packingCharge}}</span>
            </div>
            <div class="price-row">
              <span class="pl">GST 18%</span>
              <span>₹{{price.taxAmount}}</span>
            </div>
            <div class="price-row total">
              <span>Total</span>
              <span>₹{{price.totalServiceCost}}</span>
            </div>
          </div>

          <div style="display:flex;
            justify-content:space-between;margin-top:16px">
            <button class="btn btn-secondary"
              (click)="step=1">
              <span class="material-icons">
                arrow_back
              </span>Back
            </button>
            <button class="btn btn-primary"
              (click)="goStep3()">
              Next: Set Route
              <span class="material-icons">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        <!-- STEP 3: FULL WIDTH MAP -->
        <div *ngIf="step===3" class="animate-in">
          <div style="display:grid;
            grid-template-columns:340px 1fr;
            gap:18px;align-items:start">

            <!-- Left controls -->
            <div style="display:flex;
              flex-direction:column;gap:16px">

              <!-- Origin Search -->
              <div class="card" style="padding:18px">
                <div style="font-size:11px;font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1px;color:var(--cyan);
                  margin-bottom:12px;
                  display:flex;align-items:center;gap:6px">
                  <div style="width:10px;height:10px;
                    border-radius:50%;
                    background:var(--cyan)"></div>
                  Origin (Pickup)
                </div>
                <div class="autocomplete-wrap">
                  <input class="form-control"
                    [(ngModel)]="originQuery"
                    placeholder="Search city or area..."
                    (input)="onOriginInput()"
                    (focus)="showOriginList=true">
                  <div class="autocomplete-list"
                    *ngIf="showOriginList
                      && originSuggestions.length">
                    <div class="ac-item"
                      *ngFor="let s of originSuggestions"
                      (click)="selectOrigin(s)">
                      <span class="material-icons"
                        style="font-size:14px;
                        color:var(--cyan);flex-shrink:0">
                        place
                      </span>
                      {{s.display_name | slice:0:55}}...
                    </div>
                  </div>
                </div>
                <div *ngIf="form.originLat"
                  style="margin-top:8px;font-size:11px;
                  color:var(--green);
                  display:flex;align-items:center;gap:4px">
                  <span class="material-icons"
                    style="font-size:13px">check_circle</span>
                  {{form.originLat|number:'1.4-4'}},
                  {{form.originLng|number:'1.4-4'}}
                </div>
              </div>

              <!-- Destination Search -->
              <div class="card" style="padding:18px">
                <div style="font-size:11px;font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1px;color:var(--pink);
                  margin-bottom:12px;
                  display:flex;align-items:center;gap:6px">
                  <div style="width:10px;height:10px;
                    border-radius:50%;
                    background:var(--pink)"></div>
                  Destination (Delivery)
                </div>
                <div class="autocomplete-wrap">
                  <input class="form-control"
                    [(ngModel)]="destQuery"
                    placeholder="Search city or area..."
                    (input)="onDestInput()"
                    (focus)="showDestList=true">
                  <div class="autocomplete-list"
                    *ngIf="showDestList
                      && destSuggestions.length">
                    <div class="ac-item"
                      *ngFor="let s of destSuggestions"
                      (click)="selectDest(s)">
                      <span class="material-icons"
                        style="font-size:14px;
                        color:var(--pink);flex-shrink:0">
                        place
                      </span>
                      {{s.display_name | slice:0:55}}...
                    </div>
                  </div>
                </div>
                <div *ngIf="form.destLat"
                  style="margin-top:8px;font-size:11px;
                  color:var(--green);
                  display:flex;align-items:center;gap:4px">
                  <span class="material-icons"
                    style="font-size:13px">check_circle</span>
                  {{form.destLat|number:'1.4-4'}},
                  {{form.destLng|number:'1.4-4'}}
                </div>
              </div>

          

              <!-- Price summary -->
              <div class="card" style="padding:18px"
                *ngIf="price">
                <div style="display:flex;
                  justify-content:space-between;
                  align-items:center;margin-bottom:4px">
                  <span style="font-size:12px;
                    color:var(--text-secondary)">
                    Total Amount
                  </span>
                  <span style="font-family:var(--font-display);
                    font-size:1.6rem;font-weight:900;
                    color:var(--cyan);
                    letter-spacing:-0.03em">
                    ₹{{price.totalServiceCost}}
                  </span>
                </div>
                <div style="font-size:12px;
                  color:var(--text-muted)">
                  {{form.deliveryType}} ·
                  {{form.parcelWeightGrams}}g ·
                  {{form.packingPreference}}
                </div>
              </div>

              <div style="display:flex;
                flex-direction:column;gap:8px">
                <button class="btn btn-secondary"
                  (click)="step=2">
                  <span class="material-icons">
                    arrow_back
                  </span>Back
                </button>
                <button class="btn btn-primary btn-lg"
                  (click)="submitBooking()"
                  [disabled]="submitting
                    || !form.originLat || !form.destLat">
                  <div *ngIf="submitting" class="spinner"
                    style="width:16px;height:16px;
                    border-width:2px"></div>
                  <span class="material-icons"
                    *ngIf="!submitting">
                    check_circle
                  </span>
                  {{submitting?'Creating...':'Confirm Booking'}}
                </button>
              </div>
            </div>

            <!-- Map Full Height -->
            <div class="card" style="padding:0;
              overflow:hidden;position:sticky;top:20px">
              <div style="padding:14px 18px;
                border-bottom:1px solid var(--border);
                display:flex;align-items:center;
                justify-content:space-between">
                <div style="display:flex;
                  align-items:center;gap:8px;
                  font-weight:600;font-size:14px">
                  <span class="material-icons"
                    style="color:var(--cyan);font-size:18px">
                    map
                  </span>
                  Route Map
                </div>
                <div style="display:flex;gap:12px;
                  font-size:12px;color:var(--text-secondary)">
                  <span *ngIf="routes.length">
                    {{routes.length}} route(s) found
                  </span>
                  <span *ngIf="!form.originLat">
                    🔵 Search origin above
                  </span>
                  <span *ngIf="form.originLat
                    && !form.destLat">
                    🔴 Search destination above
                  </span>
                </div>
              </div>
              <div id="booking-map"
                style="height:600px;width:100%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .steps-bar {
      display: flex; align-items: center;
      margin-bottom: 28px; max-width: 500px;
    }
    .sb-step {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 600;
      color: var(--text-muted);
      .sb-circle {
        width: 32px; height: 32px; border-radius: 50%;
        border: 2px solid var(--border);
        background: var(--bg-surface);
        display: flex; align-items: center;
        justify-content: center;
        font-size: 13px; font-weight: 700;
        transition: all 0.3s; flex-shrink: 0;
      }
      &.active { color: var(--cyan);
        .sb-circle { border-color: var(--cyan);
          background: rgba(0,245,255,0.1); color: var(--cyan); }
      }
      &.done { color: var(--green);
        .sb-circle { border-color: var(--green);
          background: var(--green); color: #000; }
      }
    }
    .sb-line { flex: 1; height: 2px;
      background: var(--border); margin: 0 8px;
      transition: background 0.3s;
      &.done { background: var(--green); }
    }
    .price-box { background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg); padding: 18px;
      margin-top: 16px;
      .pb-title { font-size: 11px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.8px;
        color: var(--text-secondary); margin-bottom: 12px;
        display: flex; align-items: center; gap: 6px; }
    }
    .route-item {
      padding: 10px 12px; border-radius: var(--r-md);
      cursor: pointer; transition: all 0.15s;
      border: 1px solid transparent; margin-bottom: 6px;
      &:hover { background: var(--bg-surface); }
      &.selected { background: rgba(0,245,255,0.06);
        border-color: var(--border-active); }
    }
        // styles mein add karo
.field-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
    .r-dot { width: 10px; height: 10px; border-radius: 50%;
      flex-shrink: 0; }
  `]
})
export class CreateBookingComponent
  implements OnInit, OnDestroy {
  step = 1;
  submitting = false;
  price: any = null;
  routes: any[] = [];
  selectedRoute = 0;
  routeColors = ['#00ff88', '#00f5ff', '#ff6b35', '#8b5cf6'];
  routeLayers: any[] = [];

  originQuery = '';
  destQuery = '';
  originSuggestions: any[] = [];
  destSuggestions: any[] = [];
  showOriginList = false;
  showDestList = false;

  private originSearch$ = new Subject<string>();
  private destSearch$ = new Subject<string>();
  private map: any;
  private originMarker: any;
  private destMarker: any;
  private mapReady = false;

  s1err: any = {};

  form: any = {
    receiverName: '', receiverAddress: '',
    receiverPin: '', receiverMobile: '',
    parcelWeightGrams: 500,
    parcelContentsDescription: '',
    deliveryType: 'STANDARD',
    packingPreference: 'BASIC',
    pickupTime: '',
    originLat: 0, originLng: 0,
    destLat: 0, destLng: 0
  };

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private geoService: GeocodingService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.calcPrice();

    this.originSearch$.pipe(
      debounceTime(400),
      switchMap(q => this.geoService.searchPlaces(q))
    ).subscribe(results => {
      this.originSuggestions = results;
    });

    this.destSearch$.pipe(
      debounceTime(400),
      switchMap(q => this.geoService.searchPlaces(q))
    ).subscribe(results => {
      this.destSuggestions = results;
    });

    document.addEventListener('click',
      this.closeDropdowns.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click',
      this.closeDropdowns.bind(this));
    if (this.map) this.map.remove();
  }

  closeDropdowns(e: any) {
    if (!e.target.closest('.autocomplete-wrap')) {
      this.showOriginList = false;
      this.showDestList = false;
    }
  }

  onOriginInput() {
    this.showOriginList = true;
    this.originSearch$.next(this.originQuery);
  }
  getShortestDistance(): number {
    return Math.min(...this.routes.map((r: any) => r.distance));
  }

  getLongestDistance(): number {
    return Math.max(...this.routes.map((r: any) => r.distance));
  }
  onDestInput() {
    this.showDestList = true;
    this.destSearch$.next(this.destQuery);
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
    this.calcPrice(); // ✅ ek baar
  }
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
    this.calcPrice(); // ✅ ek baar
  }
  }

  placeOriginMarker() {
    if (!this.map) return;
    if (this.originMarker) this.map.removeLayer(this.originMarker);
    const icon = L.divIcon({
      html: `<div style="width:14px;height:14px;
        border-radius:50%;background:#00f5ff;
        border:3px solid #fff;
        box-shadow:0 0 10px rgba(0,245,255,0.8)"></div>`,
      iconSize: [14, 14], className: ''
    });
    this.originMarker = L.marker(
      [this.form.originLat, this.form.originLng],
      { icon }
    ).addTo(this.map).bindPopup('📍 Origin: ' + this.originQuery);
    this.map.setView(
      [this.form.originLat, this.form.originLng], 12);
  }

  placeDestMarker() {
    if (!this.map) return;
    if (this.destMarker) this.map.removeLayer(this.destMarker);
    const icon = L.divIcon({
      html: `<div style="width:14px;height:14px;
        border-radius:50%;background:#ff2d78;
        border:3px solid #fff;
        box-shadow:0 0 10px rgba(255,45,120,0.8)"></div>`,
      iconSize: [14, 14], className: ''
    });
    this.destMarker = L.marker(
      [this.form.destLat, this.form.destLng],
      { icon }
    ).addTo(this.map).bindPopup('🎯 Dest: ' + this.destQuery);
  }

  // fetchRoutes() {
  //   this.routeLayers.forEach(l => this.map.removeLayer(l));
  //   this.routeLayers = [];
  //   this.routes = [];

  //   this.geoService.getRoutes(
  //     this.form.originLat, this.form.originLng,
  //     this.form.destLat, this.form.destLng
  //   ).subscribe({
  //     next: (res: any) => {
  //       if (res.routes && res.routes.length) {
  //         this.routes = res.routes;
  //         this.drawRoutes();
  //       }
  //     },
  //     error: () => {
  //       // Fallback: straight line
  //       this.drawStraightLine();
  //       this.toast.info(
  //         'Road routing unavailable. Showing straight line.');
  //     }
  //   });
  // }


//   fetchRoutes() {
//   this.routeLayers.forEach(l => this.map.removeLayer(l));
//   this.routeLayers = [];
//   this.routes = [];

//   this.geoService.getRoutes(
//     this.form.originLat, this.form.originLng,
//     this.form.destLat, this.form.destLng
//   ).subscribe({
//     next: (res: any) => {
//       if (res.routes && res.routes.length) {
//         let routes = res.routes;

//         // ✅ Agar sirf 1 route hai toh synthetic routes banao
//         if (routes.length === 1) {
//           const base = routes[0];
//           routes = [
//             base,
//             {
//               ...base,
//               distance: base.distance * 1.12,
//               duration: base.duration * 1.18,
//               geometry: base.geometry // same line, different style
//             },
//             {
//               ...base,
//               distance: base.distance * 1.25,
//               duration: base.duration * 1.35,
//               geometry: base.geometry
//             }
//           ];
//         }

//         // ✅ Distance ke basis pe sort
//         this.routes = routes.sort(
//           (a: any, b: any) => a.distance - b.distance
//         );
//         this.drawRoutes();
//       }
//     },
//     error: () => {
//       this.drawStraightLine();
//       this.toast.info('Road routing unavailable. Showing straight line.');
//     }
//   });
// }


fetchRoutes() {
  // ✅ Customer ko routes nahi chahiye — sirf straight line
  this.routeLayers.forEach(l => this.map.removeLayer(l));
  this.routeLayers = [];
  this.routes = [];
  this.drawStraightLine(); // ✅ bas origin to dest line
}

  drawRoutes() {
    this.routes.forEach((route: any, i: number) => {
      const coords = this.geoService.decodePolyline(
        route.geometry.coordinates);
      const line = L.polyline(coords, {
        color: this.routeColors[i] || '#8b5cf6',
        weight: i === 0 ? 5 : 3,
        opacity: i === 0 ? 0.9 : 0.5,
        dashArray: i === 0 ? null : '8,6'
      }).addTo(this.map);
      this.routeLayers.push(line);
    });

    if (this.routeLayers.length > 0) {
      const group = L.featureGroup(this.routeLayers);
      this.map.fitBounds(group.getBounds(),
        { padding: [40, 40] });
    }
  }

  drawStraightLine() {
    const line = L.polyline([
      [this.form.originLat, this.form.originLng],
      [this.form.destLat, this.form.destLng]
    ], {
      color: '#00ff88', weight: 4,
      dashArray: '10,8', opacity: 0.8
    }).addTo(this.map);
    this.routeLayers.push(line);
    this.map.fitBounds(line.getBounds(),
      { padding: [40, 40] });
  }

  selectRouteItem(i: number) {
    this.selectedRoute = i;
    this.routeLayers.forEach((l, idx) => {
      l.setStyle({
        weight: idx === i ? 5 : 3,
        opacity: idx === i ? 0.9 : 0.4
      });
    });
  }

  // goStep2() {
  //   this.s1err = {};
  //   if (!this.form.receiverName)
  //     this.s1err.name = 'Name required';
  //   if (!this.form.receiverMobile
  //     || !/^[6-9]\d{9}$/.test(this.form.receiverMobile))
  //     this.s1err.mobile = 'Valid 10-digit mobile required';
  //   if (!this.form.receiverAddress)
  //     this.s1err.address = 'Address required';
  //   if (Object.keys(this.s1err).length > 0) return;
  //   this.step = 2;
  // }

  goStep2() {
    this.s1err = {};

    if (!this.form.receiverName?.trim())
      this.s1err.name = 'Name required';

    if (!this.form.receiverMobile
      || !/^[6-9]\d{9}$/.test(this.form.receiverMobile))
      this.s1err.mobile = 'Valid 10-digit mobile required';

    if (!this.form.receiverAddress?.trim())
      this.s1err.address = 'Address required';

    // ✅ PIN validation — 6 digits
    if (this.form.receiverPin
      && !/^\d{6}$/.test(this.form.receiverPin))
      this.s1err.pin = 'PIN must be 6 digits';

    // ✅ Pickup time — required + future time
    if (!this.form.pickupTime) {
      this.s1err.pickupTime = 'Pickup time required';
    } else if (new Date(this.form.pickupTime) <= new Date()) {
      this.s1err.pickupTime = 'Pickup time must be in future';
    }

    if (Object.keys(this.s1err).length > 0) return;
    this.step = 2;
  }

  goStep3() {
    if (!this.form.parcelWeightGrams) {
      this.toast.error('Enter parcel weight'); return;
    }
    this.step = 3;
    setTimeout(() => this.initMap(), 300);
  }

  initMap() {
    if (this.map) {
      this.map.remove(); this.map = null;
    }
    this.map = L.map('booking-map').setView(
      [22.9734, 78.6569], 5);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors' }
    ).addTo(this.map);
    this.mapReady = true;

    // Re-place markers if already set
    if (this.form.originLat) this.placeOriginMarker();
    if (this.form.destLat) this.placeDestMarker();
    if (this.form.originLat && this.form.destLat)
      this.fetchRoutes();
  }

  // calcPrice() {
  //   if (!this.form.parcelWeightGrams) return;
  //   this.bookingService.calculateCost({
  //     parcelWeightGrams: this.form.parcelWeightGrams,
  //     deliveryType: this.form.deliveryType,
  //     packingPreference: this.form.packingPreference
  //   }).subscribe({
  //     next: (res: any) => {
  //       if (res.success) this.price = res.data;
  //     }
  //   });
  // }

  calcPrice() {
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
      if (res.success) this.price = res.data;
    }
  });
}

  submitBooking() {
    if (!this.form.originLat || !this.form.destLat) {
      this.toast.error(
        'Please set both origin and destination'); return;
    }
    this.submitting = true;
    this.bookingService.createBooking(this.form).subscribe({
      next: (res: any) => {
        this.submitting = false;
        if (res.success) {
          this.toast.success(
            'Booking created! Proceeding to payment...');
          setTimeout(() => this.router.navigate(
            ['/customer/payment',
              res.data.bookingId]), 1000);
        } else { this.toast.error(res.message); }
      },
      error: (err: any) => {
        this.submitting = false;
        this.toast.error(
          err.error?.message || 'Booking failed.');
      }
    });
  }
}