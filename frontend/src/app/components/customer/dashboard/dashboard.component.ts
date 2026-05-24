// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
// import { BookingService } from '../../../services/booking.service';

// @Component({
//   selector: 'app-customer-dashboard',
//   template: `
//   <div class="page-wrapper" style="display:flex">
//     <app-sidebar></app-sidebar>
//     <div class="main-with-sidebar">
//       <div class="page-content">
//         <div class="page-header">
//           <h2>Welcome back, {{user?.customerName}}! 👋</h2>
//           <p>Here's an overview of your shipments</p>
//         </div>

//         <div class="grid grid-4" style="margin-bottom:32px">
//           <div class="stat-card accent-blue">
//             <div class="stat-icon"
//               style="background:rgba(0,212,255,0.15)">📦</div>
//             <div class="stat-value text-accent">{{stats.total}}</div>
//             <div class="stat-label">Total Bookings</div>
//           </div>
//           <div class="stat-card accent-green">
//             <div class="stat-icon"
//               style="background:rgba(16,185,129,0.15)">✅</div>
//             <div class="stat-value"
//               style="color:var(--accent-success)">
//               {{stats.delivered}}
//             </div>
//             <div class="stat-label">Delivered</div>
//           </div>
//           <div class="stat-card accent-orange">
//             <div class="stat-icon"
//               style="background:rgba(245,158,11,0.15)">🚚</div>
//             <div class="stat-value"
//               style="color:var(--accent-warning)">
//               {{stats.active}}
//             </div>
//             <div class="stat-label">Active</div>
//           </div>
//           <div class="stat-card accent-purple">
//             <div class="stat-icon"
//               style="background:rgba(124,58,237,0.15)">❌</div>
//             <div class="stat-value"
//               style="color:#a78bfa">
//               {{stats.cancelled}}
//             </div>
//             <div class="stat-label">Cancelled</div>
//           </div>
//         </div>

//         <div class="grid grid-2">
//           <div class="card">
//             <h3 style="margin-bottom:20px">Quick Actions</h3>
//             <div style="display:flex;flex-direction:column;gap:12px">
//               <button class="btn btn-primary"
//                 (click)="router.navigate(['/customer/book'])">
//                 <span class="material-icons">add_box</span>
//                 Book New Parcel
//               </button>
//               <button class="btn btn-secondary"
//                 (click)="router.navigate(['/customer/history'])">
//                 <span class="material-icons">history</span>
//                 View All Bookings
//               </button>
//               <button class="btn btn-ghost"
//                 (click)="router.navigate(['/track'])">
//                 <span class="material-icons">location_on</span>
//                 Track a Parcel
//               </button>
//             </div>
//           </div>

//           <div class="card">
//             <h3 style="margin-bottom:20px">Recent Bookings</h3>
//             <div *ngIf="loading" class="loading-overlay"
//               style="padding:20px">
//               <div class="spinner"></div>
//             </div>
//             <div *ngIf="!loading && recentBookings.length === 0"
//               style="text-align:center;padding:20px;
//               color:var(--text-secondary)">
//               No bookings yet.
//               <a (click)="router.navigate(['/customer/book'])"
//                 style="color:var(--accent-primary);cursor:pointer">
//                 Create your first booking!
//               </a>
//             </div>
//             <div *ngFor="let b of recentBookings"
//               class="booking-item">
//               <div style="display:flex;justify-content:space-between;
//                 align-items:center">
//                 <div>
//                   <div style="font-weight:600;font-size:14px">
//                     {{b.bookingId}}
//                   </div>
//                   <div style="font-size:12px;color:var(--text-secondary)">
//                     To: {{b.receiverName}}
//                   </div>
//                 </div>
//                 <span class="badge badge-{{b.status}}">
//                   {{b.status}}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div class="card mt-3">
//           <h3 style="margin-bottom:8px">Your Customer ID</h3>
//           <p style="color:var(--text-secondary);font-size:14px;
//             margin-bottom:16px">
//             Share this ID when visiting our counter
//           </p>
//           <div style="background:var(--bg-surface);
//             border:1px solid var(--border-active);
//             border-radius:var(--radius-md);padding:16px 20px;
//             display:inline-flex;align-items:center;gap:12px">
//             <span class="material-icons"
//               style="color:var(--accent-primary)">badge</span>
//             <span style="font-family:var(--font-display);
//               font-size:1.4rem;font-weight:700;
//               color:var(--accent-primary)">
//               {{user?.customerId}}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   `,
//   styles: [`
//     .booking-item { padding:12px 0; border-bottom:1px solid var(--border-subtle);
//       &:last-child { border-bottom:none; } }
//     .mt-3 { margin-top:24px; }
//   `]
// })
// export class CustomerDashboardComponent implements OnInit {
//   user: any;
//   loading = false;
//   recentBookings: any[] = [];
//   stats = { total:0, delivered:0, active:0, cancelled:0 };

//   constructor(
//     public router: Router,
//     private auth: AuthService,
//     private bookingService: BookingService
//   ) {}

//   ngOnInit() {
//     this.user = this.auth.getUser();
//     this.loadBookings();
//   }

//   loadBookings() {
//     this.loading = true;
//     this.bookingService.getHistory(0, 5).subscribe({
//       next: (res: any) => {
//         this.loading = false;
//         if (res.success) {
//           this.recentBookings = res.data.content || [];
//           this.recentBookings.forEach((b: any) => {
//             this.stats.total++;
//             if (b.status === 'DELIVERED') this.stats.delivered++;
//             else if (b.status === 'CANCELLED') this.stats.cancelled++;
//             else this.stats.active++;
//           });
//         }
//       },
//       error: () => { this.loading = false; }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-customer-dashboard',
  template: `
  <div style="display:flex;background:var(--cream);min-height:100vh">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar" style="width:100%">
      <!-- Topbar -->
      <div class="topbar">
        <div>
          <div class="tb-title">Dashboard</div>
          <div style="font-size:11px;color:var(--ink3)">{{today}}</div>
        </div>
        <div class="tb-spacer"></div>
        <button class="btn btn-primary btn-sm" (click)="r.navigate(['/customer/book'])">
          <span class="material-icons" style="font-size:15px">add</span>
          New Booking
        </button>
      </div>

      <div class="page-content">
        <!-- Welcome -->
        <div style="margin-bottom:24px">
          <h2 style="font-size:1.5rem;font-weight:800;color:var(--ink)">
            Good {{greeting}}, {{user?.customerName?.split(' ')[0]}} 👋
          </h2>
          <p style="color:var(--ink3);font-size:13px;margin-top:3px">Here's what's happening with your shipments.</p>
        </div>

        <!-- Stats -->
        <div class="grid g4 mb3">
          <div class="stat-card c-amber">
            <div class="s-ico" style="background:var(--amber-light)">📦</div>
            <div class="s-val">{{stats.total}}</div>
            <div class="s-lbl">Total Bookings</div>
          </div>
          <div class="stat-card c-teal">
            <div class="s-ico" style="background:var(--teal-light)">✅</div>
            <div class="s-val" style="color:var(--teal)">{{stats.delivered}}</div>
            <div class="s-lbl">Delivered</div>
          </div>
          <div class="stat-card c-gold">
            <div class="s-ico" style="background:var(--gold-light)">🚚</div>
            <div class="s-val" style="color:var(--gold)">{{stats.active}}</div>
            <div class="s-lbl">Active</div>
          </div>
          <div class="stat-card c-blue">
            <div class="s-ico" style="background:var(--blue-light)">🆕</div>
            <div class="s-val" style="color:var(--blue)">{{stats.pending}}</div>
            <div class="s-lbl">Pending Payment</div>
          </div>
        </div>

        <div class="grid g2">
          <!-- Quick actions -->
          <div class="card">
            <h3 style="font-size:15px;font-weight:700;margin-bottom:16px">Quick Actions</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="qa-btn" (click)="r.navigate(['/customer/book'])">
                <div class="qa-ico" style="background:var(--amber-light)">
                  <span class="material-icons" style="color:var(--amber);font-size:18px">add_box</span>
                </div>
                <div>
                  <div style="font-weight:700;font-size:13px">Book New Parcel</div>
                  <div style="font-size:11px;color:var(--ink3)">Create a new shipment</div>
                </div>
                <span class="material-icons" style="margin-left:auto;color:var(--ink4);font-size:18px">chevron_right</span>
              </button>
              <button class="qa-btn" (click)="r.navigate(['/customer/history'])">
                <div class="qa-ico" style="background:var(--blue-light)">
                  <span class="material-icons" style="color:var(--blue);font-size:18px">receipt_long</span>
                </div>
                <div>
                  <div style="font-weight:700;font-size:13px">Booking History</div>
                  <div style="font-size:11px;color:var(--ink3)">View all shipments</div>
                </div>
                <span class="material-icons" style="margin-left:auto;color:var(--ink4);font-size:18px">chevron_right</span>
              </button>
              <button class="qa-btn" (click)="r.navigate(['/track'])">
                <div class="qa-ico" style="background:var(--teal-light)">
                  <span class="material-icons" style="color:var(--teal);font-size:18px">location_on</span>
                </div>
                <div>
                  <div style="font-weight:700;font-size:13px">Track Parcel</div>
                  <div style="font-size:11px;color:var(--ink3)">Live tracking on map</div>
                </div>
                <span class="material-icons" style="margin-left:auto;color:var(--ink4);font-size:18px">chevron_right</span>
              </button>
            </div>

            <!-- Customer ID Card -->
            <div style="margin-top:20px;background:var(--amber);border-radius:var(--r-lg);padding:16px">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.7);margin-bottom:4px">Your Customer ID</div>
              <div style="font-size:1.4rem;font-weight:800;color:#fff;letter-spacing:-0.02em">{{user?.customerId}}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px">Use this at our counter or share with us</div>
            </div>
          </div>

          <!-- Recent bookings -->
          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
              <h3 style="font-size:15px;font-weight:700">Recent Bookings</h3>
              <button class="btn btn-ghost btn-sm" (click)="r.navigate(['/customer/history'])">View all</button>
            </div>

            <div *ngIf="loading" class="loading-center" style="padding:28px">
              <div class="spinner"></div>
            </div>

            <div *ngIf="!loading && recent.length===0" style="text-align:center;padding:28px;color:var(--ink3)">
              <div style="font-size:32px;margin-bottom:8px">📭</div>
              <div style="font-size:13px">No bookings yet.</div>
              <button class="btn btn-primary btn-sm mt2" (click)="r.navigate(['/customer/book'])">Make your first booking</button>
            </div>

            <div *ngFor="let b of recent" class="rb-row" (click)="trackBooking(b.bookingId)">
              <div style="width:36px;height:36px;background:var(--cream2);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">{{getIcon(b.status)}}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:13px;color:var(--ink)">{{b.bookingId}}</div>
                <div style="font-size:11px;color:var(--ink3);margin-top:1px">→ {{b.receiverName}} · {{b.bookingDate|slice:0:10}}</div>
              </div>
              <span class="badge badge-{{b.status}}">{{b.status}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .qa-btn { display:flex; align-items:center; gap:12px; padding:12px; border-radius:var(--r-lg); border:1px solid var(--border); background:var(--white); cursor:pointer; transition:all 0.15s; width:100%; text-align:left;
      &:hover { background:var(--cream); border-color:var(--border2); transform:translateX(2px); }
    }
    .qa-ico { width:38px; height:38px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rb-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.12s; border-radius:var(--r-md); padding:10px 8px; margin:0 -8px;
      &:last-child { border-bottom:none; }
      &:hover { background:var(--cream); }
    }
    .mb3 { margin-bottom:22px; }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  user: any;
  loading = false;
  recent: any[] = [];
  today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
  greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
  stats = { total:0, delivered:0, active:0, pending:0 };

  constructor(public r: Router, private auth: AuthService, private bsvc: BookingService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.load();
  }

  load() {
    this.loading = true;
    this.bsvc.getHistory(0, 8).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.recent = res.data.content || [];
          this.stats.total = res.data.totalElements || this.recent.length;
          this.recent.forEach((b: any) => {
            if (b.status === 'DELIVERED') this.stats.delivered++;
            else if (b.status === 'NEW') this.stats.pending++;
            else if (!['CANCELLED'].includes(b.status)) this.stats.active++;
          });
        }
      },
      error: () => { this.loading = false; }
    });
  }

  trackBooking(id: string) { this.r.navigate(['/track', id]); }

  getIcon(status: string): string {
    const m: any = { NEW:'🆕', BOOKED:'💳', SCHEDULED:'📅', PICKEDUP:'📦', INTRANSIT:'🚚', DELIVERED:'✅', CANCELLED:'❌' };
    return m[status] || '📦';
  }
}