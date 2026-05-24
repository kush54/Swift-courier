// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { BookingService } from '../../../services/booking.service';
// import { ToastService } from '../../../services/toast.service';

// declare var L: any;

// @Component({
//   selector: 'app-tracking',
//   template: `
//   <div style="min-height:100vh;background:var(--bg-primary)">
//     <div style="background:var(--bg-secondary);
//       border-bottom:1px solid var(--border-subtle);
//       padding:16px 32px;display:flex;
//       align-items:center;justify-content:space-between">
//       <div style="display:flex;align-items:center;gap:12px">
//         <span style="font-size:24px">🚀</span>
//         <span style="font-family:var(--font-display);
//           font-size:1.2rem;font-weight:800;
//           background:var(--gradient-accent);
//           -webkit-background-clip:text;
//           -webkit-text-fill-color:transparent;
//           background-clip:text">
//           Swift Courier
//         </span>
//       </div>
//       <span style="font-size:14px;color:var(--text-secondary)">
//         Parcel Tracking
//       </span>
//     </div>

//     <div style="max-width:900px;margin:0 auto;padding:40px 24px">
//       <div style="text-align:center;margin-bottom:40px">
//         <h2 style="font-size:2rem;margin-bottom:8px">
//           Track Your Parcel
//         </h2>
//         <p style="color:var(--text-secondary)">
//           Enter your booking ID to get real-time updates
//         </p>
//       </div>

//       <div style="display:flex;gap:8px;
//         max-width:500px;margin:0 auto 40px">
//         <input class="form-control" type="text"
//           [(ngModel)]="bookingId"
//           placeholder="e.g. BK-20240001-0001"
//           (keyup.enter)="track()">
//         <button class="btn btn-primary"
//           (click)="track()" [disabled]="loading">
//           <div *ngIf="loading" class="spinner"
//             style="width:16px;height:16px;border-width:2px">
//           </div>
//           <span class="material-icons" *ngIf="!loading">
//             search
//           </span>
//         </button>
//       </div>

//       <div *ngIf="error" class="alert alert-error"
//         style="max-width:500px;margin:0 auto 24px">
//         <span class="material-icons"
//           style="font-size:18px">error</span>
//         {{error}}
//       </div>

//       <div *ngIf="tracking" class="animate-in">
//         <!-- Status Banner -->
//         <div class="status-banner"
//           [class]="'status-' + tracking.status">
//           <div style="font-size:40px">
//             {{getStatusIcon(tracking.status)}}
//           </div>
//           <div>
//             <div style="font-size:13px;font-weight:700;
//               text-transform:uppercase;
//               letter-spacing:1px;opacity:0.8">
//               Current Status
//             </div>
//             <div style="font-size:1.8rem;
//               font-family:var(--font-display);
//               font-weight:800">
//               {{tracking.status}}
//             </div>
//           </div>
//           <div style="margin-left:auto;text-align:right">
//             <div style="font-size:13px;opacity:0.8">
//               Booking ID
//             </div>
//             <div style="font-family:var(--font-display);
//               font-weight:700;font-size:1.1rem">
//               {{tracking.bookingId}}
//             </div>
//           </div>
//         </div>

//         <!-- Timeline -->
//         <div class="card" style="margin-bottom:24px">
//           <h3 style="margin-bottom:20px">
//             Delivery Timeline
//           </h3>
//           <div class="track-timeline">
//             <div class="tl-item"
//               *ngFor="let step of timelineSteps"
//               [class.completed]="isCompleted(step.status)"
//               [class.active]="tracking.status===step.status">
//               <div class="tl-dot">{{step.icon}}</div>
//               <div class="tl-line"
//                 *ngIf="step.status!=='DELIVERED'">
//               </div>
//               <div class="tl-content">
//                 <div class="tl-title">{{step.label}}</div>
//                 <div class="tl-sub">{{step.desc}}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <!-- Map -->
//         <div class="card" style="margin-bottom:24px">
//           <h3 style="margin-bottom:16px">
//             Live Location Map
//           </h3>
//           <div id="track-map" style="height:380px;
//             border-radius:var(--radius-md);overflow:hidden">
//           </div>
//         </div>

//         <!-- Details (Officer only) -->
//         <div class="card" *ngIf="tracking.receiverName">
//           <h3 style="margin-bottom:16px">
//             Shipment Details
//           </h3>
//           <div class="grid grid-2">
//             <div class="detail-row">
//               <span class="detail-label">Receiver</span>
//               <span>{{tracking.receiverName}}</span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Address</span>
//               <span style="font-size:13px">
//                 {{tracking.receiverAddress}}
//               </span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Courier</span>
//               <span>
//                 {{tracking.courierName || 'Not assigned'}}
//               </span>
//             </div>
//             <div class="detail-row">
//               <span class="detail-label">Amount</span>
//               <span style="color:var(--accent-success);
//                 font-weight:600">
//                 ₹{{tracking.totalServiceCost}}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   `,
//   styles: [`
//     .status-banner { display:flex; align-items:center; gap:20px;
//       padding:24px 28px; border-radius:var(--radius-lg);
//       margin-bottom:24px; color:white; }
//     .status-NEW { background:linear-gradient(135deg,#0052cc,#0073e6); }
//     .status-BOOKED { background:linear-gradient(135deg,#5b21b6,#7c3aed); }
//     .status-SCHEDULED { background:linear-gradient(135deg,#b45309,#d97706); }
//     .status-PICKEDUP { background:linear-gradient(135deg,#c2410c,#ea580c); }
//     .status-INTRANSIT { background:linear-gradient(135deg,#b45309,#f59e0b); }
//     .status-DELIVERED { background:linear-gradient(135deg,#065f46,#10b981); }
//     .status-CANCELLED { background:linear-gradient(135deg,#991b1b,#ef4444); }

//     .track-timeline { display:flex; gap:0; }
//     .tl-item { display:flex; flex-direction:column;
//       align-items:center; flex:1; position:relative; }
//     .tl-dot { width:44px; height:44px; border-radius:50%;
//       border:2px solid var(--border-subtle);
//       background:var(--bg-surface); display:flex;
//       align-items:center; justify-content:center;
//       font-size:18px; z-index:1; transition:all 0.3s; }
//     .tl-item.completed .tl-dot { border-color:var(--accent-success);
//       background:rgba(16,185,129,0.15); }
//     .tl-item.active .tl-dot { border-color:var(--accent-primary);
//       background:rgba(0,212,255,0.15);
//       box-shadow:0 0 16px rgba(0,212,255,0.4); }
//     .tl-line { position:absolute; top:22px; left:50%;
//       width:100%; height:2px;
//       background:var(--border-subtle); z-index:0; }
//     .tl-item.completed .tl-line {
//       background:var(--accent-success); }
//     .tl-content { text-align:center; margin-top:8px; }
//     .tl-title { font-size:12px; font-weight:700; }
//     .tl-sub { font-size:10px; color:var(--text-secondary); }

//     .detail-row { display:flex; flex-direction:column; gap:4px;
//       padding:12px 0;
//       border-bottom:1px solid var(--border-subtle); }
//     .detail-label { font-size:11px; font-weight:700;
//       text-transform:uppercase; color:var(--text-secondary);
//       letter-spacing:0.5px; }
//   `]
// })
// export class TrackingComponent implements OnInit {
//   bookingId = '';
//   tracking: any = null;
//   loading = false;
//   error = '';
//   private map: any;

//   timelineSteps = [
//     { status:'NEW', icon:'📝', label:'Booked',
//       desc:'Order placed' },
//     { status:'BOOKED', icon:'💳', label:'Paid',
//       desc:'Payment done' },
//     { status:'SCHEDULED', icon:'📅', label:'Scheduled',
//       desc:'Pickup scheduled' },
//     { status:'PICKEDUP', icon:'📦', label:'Picked Up',
//       desc:'With courier' },
//     { status:'INTRANSIT', icon:'🚚', label:'In Transit',
//       desc:'On the way' },
//     { status:'DELIVERED', icon:'✅', label:'Delivered',
//       desc:'Delivered!' }
//   ];

//   statusOrder = [
//     'NEW','BOOKED','SCHEDULED',
//     'PICKEDUP','INTRANSIT','DELIVERED'
//   ];

//   constructor(
//     private route: ActivatedRoute,
//     private bookingService: BookingService,
//     private toast: ToastService
//   ) {}

//   ngOnInit() {
//     const id = this.route.snapshot.params['bookingId'];
//     if (id) { this.bookingId = id; this.track(); }
//   }

//   track() {
//     if (!this.bookingId) {
//       this.error = 'Please enter a booking ID'; return;
//     }
//     this.loading = true; this.error = '';
//     this.bookingService.trackBooking(this.bookingId).subscribe({
//       next: (res: any) => {
//         this.loading = false;
//         if (res.success) {
//           this.tracking = res.data;
//           setTimeout(() => this.initMap(), 300);
//         } else {
//           this.error = 'Booking not found.';
//         }
//       },
//       error: () => {
//         this.loading = false;
//         this.error = 'Booking not found.';
//       }
//     });
//   }

//   initMap() {
//     if (this.map) { this.map.remove(); this.map = null; }
//     const lat = this.tracking.currentLat || 22.9734;
//     const lng = this.tracking.currentLng || 78.6569;
//     this.map = L.map('track-map').setView([lat, lng], 10);
//     L.tileLayer(
//       'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//       { attribution: '© OpenStreetMap' }
//     ).addTo(this.map);

//     const bounds: any[] = [];

//     if (this.tracking.originLat) {
//       const icon = L.divIcon({
//         html: `<div style="background:#00d4ff;width:14px;
//           height:14px;border-radius:50%;
//           border:3px solid white;
//           box-shadow:0 0 8px rgba(0,212,255,0.8)"></div>`,
//         iconSize:[14,14], className:''
//       });
//       L.marker(
//         [this.tracking.originLat, this.tracking.originLng],
//         { icon }
//       ).addTo(this.map).bindPopup('📍 Origin');
//       bounds.push(
//         [this.tracking.originLat, this.tracking.originLng]);
//     }

//     if (this.tracking.destLat) {
//       const icon = L.divIcon({
//         html: `<div style="background:#ef4444;width:14px;
//           height:14px;border-radius:50%;
//           border:3px solid white;
//           box-shadow:0 0 8px rgba(239,68,68,0.8)"></div>`,
//         iconSize:[14,14], className:''
//       });
//       L.marker(
//         [this.tracking.destLat, this.tracking.destLng],
//         { icon }
//       ).addTo(this.map).bindPopup('🎯 Destination');
//       bounds.push(
//         [this.tracking.destLat, this.tracking.destLng]);
//     }

//     if (this.tracking.currentLat) {
//       const icon = L.divIcon({
//         html: `<div style="background:#10b981;width:18px;
//           height:18px;border-radius:50%;
//           border:3px solid white;
//           box-shadow:0 0 12px rgba(16,185,129,0.9)"></div>`,
//         iconSize:[18,18], className:''
//       });
//       L.marker(
//         [this.tracking.currentLat, this.tracking.currentLng],
//         { icon }
//       ).addTo(this.map)
//       .bindPopup('🚚 Current Location').openPopup();
//       bounds.push(
//         [this.tracking.currentLat, this.tracking.currentLng]);
//     }

//     if (this.tracking.originLat && this.tracking.destLat) {
//       L.polyline([
//         [this.tracking.originLat, this.tracking.originLng],
//         [this.tracking.destLat, this.tracking.destLng]
//       ], {
//         color:'#00d4ff', weight:3,
//         dashArray:'8,6', opacity:0.7
//       }).addTo(this.map);
//     }

//     if (bounds.length > 0) {
//       this.map.fitBounds(bounds, { padding:[40,40] });
//     }
//   }

//   isCompleted(status: string): boolean {
//     const current = this.statusOrder.indexOf(
//       this.tracking?.status);
//     const check = this.statusOrder.indexOf(status);
//     return check <= current;
//   }

//   getStatusIcon(status: string): string {
//     const icons: any = {
//       NEW:'📝', BOOKED:'💳', SCHEDULED:'📅',
//       PICKEDUP:'📦', INTRANSIT:'🚚',
//       DELIVERED:'✅', CANCELLED:'❌'
//     };
//     return icons[status] || '📦';
//   }
// }



import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';

declare var L: any;

@Component({
  selector: 'app-tracking',
  template: `
  <div style="min-height:100vh;background:var(--cream)">
    <!-- Header -->
    <div style="background:var(--white);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:28px;height:28px;background:var(--amber);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px">🚀</div>
        <span style="font-weight:800;font-size:1rem;color:var(--ink)">Swift Courier</span>
      </div>
      <span style="font-size:13px;color:var(--ink3)">Parcel Tracking</span>
    </div>

    <div style="max-width:820px;margin:0 auto;padding:36px 20px">
      <!-- Search Bar -->
      <div style="text-align:center;margin-bottom:36px">
        <h2 style="font-size:1.8rem;font-weight:800;color:var(--ink);margin-bottom:6px">Track Your Parcel</h2>
        <p style="color:var(--ink3);font-size:13px;margin-bottom:20px">Enter your booking ID for live status updates</p>
        <div style="display:flex;gap:8px;max-width:460px;margin:0 auto">
          <input class="form-control" [(ngModel)]="bookingId" placeholder="e.g. BK-20240101-0001" (keyup.enter)="track()" style="font-size:14px">
          <button class="btn btn-primary" (click)="track()" [disabled]="loading" style="flex-shrink:0">
            <div *ngIf="loading" class="spinner" style="width:14px;height:14px;border-width:2px"></div>
            <span class="material-icons" *ngIf="!loading" style="font-size:17px">search</span>
          </button>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert alert-error" style="max-width:460px;margin:0 auto 24px">
        <span class="material-icons" style="font-size:16px;flex-shrink:0">error_outline</span>{{error}}
      </div>

      <!-- Result -->
      <div *ngIf="data" class="ani">
        <!-- Status Banner -->
        <div class="status-ban" [class]="'sb-'+data.status">
          <div style="font-size:36px">{{statusIcon(data.status)}}</div>
          <div style="flex:1">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.75;margin-bottom:2px">Status</div>
            <div style="font-size:1.5rem;font-weight:800">{{data.status}}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;opacity:0.7;margin-bottom:2px">Booking</div>
            <div style="font-weight:800;font-size:1rem">{{data.bookingId}}</div>
            <div style="font-size:11px;opacity:0.7;margin-top:2px">{{data.bookingDate|slice:0:10}}</div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card" style="margin-bottom:16px">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:18px">Delivery Timeline</h3>
          <div class="timeline">
            <div class="tl-item" *ngFor="let s of steps" [class.done]="isDone(s.status)" [class.cur]="data.status===s.status">
              <div class="tl-dot">{{s.icon}}</div>
              <div class="tl-lbl">{{s.label}}</div>
            </div>
          </div>
        </div>

        <!-- Map — only shows current location for customer, NO route details -->
        <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">
          <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">
            <span class="material-icons" style="color:var(--amber);font-size:17px">location_on</span>
            <span style="font-weight:700;font-size:14px">Live Location</span>
            <div *ngIf="data.currentLat" style="margin-left:auto;display:flex;align-items:center;gap:5px;font-size:11px;color:var(--teal);font-weight:700">
              <div class="live-dot"></div> Live
            </div>
            <span *ngIf="!data.currentLat" style="margin-left:auto;font-size:11px;color:var(--ink4)">Awaiting location data</span>
          </div>
          <div id="track-map" style="height:300px"></div>
        </div>

        <!-- Info (masked for customer — no route, no courier details beyond status) -->
        <div class="card">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:14px">Shipment Info</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="info-chip">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--ink4);margin-bottom:3px">Booking ID</div>
              <div style="font-weight:700;color:var(--amber)">{{data.bookingId}}</div>
            </div>
            <div class="info-chip">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--ink4);margin-bottom:3px">Date</div>
              <div style="font-weight:600">{{data.bookingDate|slice:0:10}}</div>
            </div>
            <div class="info-chip" style="grid-column:1/-1">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--ink4);margin-bottom:3px">Status</div>
              <span class="badge badge-{{data.status}}">{{data.status}}</span>
            </div>
          </div>
          <div *ngIf="data.status==='DELIVERED'" style="margin-top:16px;background:var(--teal-light);border:1px solid rgba(13,124,110,0.2);border-radius:var(--r-lg);padding:14px;display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">🎉</span>
            <div>
              <div style="font-weight:700;color:var(--teal)">Delivered Successfully!</div>
              <div style="font-size:12px;color:var(--ink3)">Thank you for choosing Swift Courier.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .status-ban { display:flex; align-items:center; gap:16px; padding:20px 22px; border-radius:var(--r-xl); margin-bottom:16px; color:white; }
    .sb-NEW { background:var(--blue); }
    .sb-BOOKED { background:var(--amber); }
    .sb-SCHEDULED { background:var(--gold); }
    .sb-PICKEDUP { background:#e65100; }
    .sb-INTRANSIT { background:#bf360c; }
    .sb-DELIVERED { background:var(--teal); }
    .sb-CANCELLED { background:var(--red); }
    .info-chip { background:var(--cream); border:1px solid var(--border); border-radius:var(--r-md); padding:10px 12px; }
  `]
})
export class TrackingComponent implements OnInit, OnDestroy {
  bookingId = '';
  data: any = null;
  loading = false;
  error = '';
  private map: any;
  private isOfficer = false;

  steps = [
    { status:'NEW', icon:'📝', label:'Booked' },
    { status:'BOOKED', icon:'💳', label:'Paid' },
    { status:'SCHEDULED', icon:'📅', label:'Scheduled' },
    { status:'PICKEDUP', icon:'📦', label:'Picked Up' },
    { status:'INTRANSIT', icon:'🚚', label:'In Transit' },
    { status:'DELIVERED', icon:'✅', label:'Delivered' }
  ];
  order = ['NEW','BOOKED','SCHEDULED','PICKEDUP','INTRANSIT','DELIVERED'];

  constructor(
    private route: ActivatedRoute,
    private bsvc: BookingService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.isOfficer = this.auth.getUser()?.role === 'OFFICER';
    const id = this.route.snapshot.params['bookingId'];
    if (id) { this.bookingId = id; this.track(); }
  }

  ngOnDestroy() { if (this.map) this.map.remove(); }

  track() {
    if (!this.bookingId.trim()) { this.error = 'Enter a booking ID'; return; }
    this.loading = true; this.error = '';
    this.bsvc.trackBooking(this.bookingId.trim()).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.data = res.data;
          setTimeout(() => this.initMap(), 300);
        } else { this.error = 'Booking not found.'; }
      },
      error: () => { this.loading = false; this.error = 'Booking not found.'; }
    });
  }

  initMap() {
    if (this.map) { this.map.remove(); this.map = null; }
    const lat = this.data?.currentLat || 22.9734;
    const lng = this.data?.currentLng || 78.6569;
    this.map = L.map('track-map').setView([lat, lng], this.data?.currentLat ? 13 : 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(this.map);

    // Customer: ONLY show current courier location — no origin/dest/route
    if (this.data?.currentLat && this.data?.currentLng) {
      const icon = L.divIcon({
        html:`<div style="width:18px;height:18px;border-radius:50%;background:var(--teal, #0d7c6e);border:3px solid #fff;box-shadow:0 0 0 4px rgba(13,124,110,0.2)"></div>`,
        iconSize:[18,18], iconAnchor:[9,9], className:''
      });
      L.marker([this.data.currentLat, this.data.currentLng], { icon })
        .addTo(this.map).bindPopup('🚚 Courier Location').openPopup();
    }
  }

  isDone(s: string): boolean {
    return this.order.indexOf(s) <= this.order.indexOf(this.data?.status || '');
  }
  statusIcon(s: string): string {
    const m: any = { NEW:'📝', BOOKED:'💳', SCHEDULED:'📅', PICKEDUP:'📦', INTRANSIT:'🚚', DELIVERED:'✅', CANCELLED:'❌' };
    return m[s] || '📦';
  }
}