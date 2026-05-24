import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-officer-dashboard',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <h2>Officer Dashboard 🛡️</h2>
          <p>Manage all bookings and deliveries</p>
        </div>

        <div class="grid grid-4" style="margin-bottom:32px">
          <div class="stat-card accent-blue">
            <div class="stat-icon"
              style="background:rgba(0,212,255,0.15)">📦</div>
            <div class="stat-value text-accent">
              {{stats.total}}
            </div>
            <div class="stat-label">Total Bookings</div>
          </div>
          <div class="stat-card accent-orange">
            <div class="stat-icon"
              style="background:rgba(245,158,11,0.15)">🔄</div>
            <div class="stat-value"
              style="color:var(--accent-warning)">
              {{stats.active}}
            </div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-card accent-green">
            <div class="stat-icon"
              style="background:rgba(16,185,129,0.15)">✅</div>
            <div class="stat-value"
              style="color:var(--accent-success)">
              {{stats.delivered}}
            </div>
            <div class="stat-label">Delivered</div>
          </div>
          <div class="stat-card accent-purple">
            <div class="stat-icon"
              style="background:rgba(124,58,237,0.15)">🆕</div>
            <div class="stat-value" style="color:#a78bfa">
              {{stats.newBookings}}
            </div>
            <div class="stat-label">New Today</div>
          </div>
        </div>

        <div class="grid grid-2" style="margin-bottom:24px">
          <div class="card">
            <h3 style="margin-bottom:20px">Quick Actions</h3>
            <div style="display:flex;flex-direction:column;gap:12px">
              <button class="btn btn-primary"
                (click)="router.navigate(['/officer/counter-book'])">
                <span class="material-icons">add_circle</span>
                Counter Booking
              </button>
              <button class="btn btn-secondary"
                (click)="router.navigate(['/officer/bookings'])">
                <span class="material-icons">list_alt</span>
                View All Bookings
              </button>
              <button class="btn btn-ghost"
                (click)="router.navigate(['/officer/live-tracking'])">
                <span class="material-icons">gps_fixed</span>
                Live GPS Tracking
              </button>
              <button class="btn btn-secondary"
                (click)="router.navigate(['/track'])">
                <span class="material-icons">search</span>
                Track Any Parcel
              </button>
            </div>
          </div>

          <div class="card">
            <h3 style="margin-bottom:20px">
              Recent Bookings
            </h3>
            <div *ngIf="loading" class="loading-overlay"
              style="padding:20px">
              <div class="spinner"></div>
            </div>
            <div *ngFor="let b of recentBookings"
              class="booking-row">
              <div style="flex:1">
                <div style="font-weight:600;font-size:13px;
                  color:var(--accent-primary)">
                  {{b.bookingId}}
                </div>
                <div style="font-size:12px;
                  color:var(--text-secondary)">
                  {{b.customerId}} →
                  {{b.receiverName}}
                </div>
              </div>
              <span class="badge badge-{{b.status}}">
                {{b.status}}
              </span>
            </div>
            <div *ngIf="!loading && recentBookings.length===0"
              style="text-align:center;padding:20px;
              color:var(--text-secondary);font-size:14px">
              No bookings yet
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom:16px">
            Delivery Status Overview
          </h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div class="status-pill"
              *ngFor="let s of statusList"
              [style.borderColor]="s.color">
              <span [style.color]="s.color">{{s.icon}}</span>
              <span style="font-weight:600">{{s.label}}</span>
              <span style="font-size:18px;font-weight:800;
                font-family:var(--font-display)"
                [style.color]="s.color">
                {{stats[s.key] || 0}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
 styles: [`
  .booking-row {
    display:flex;
    align-items:center;
    gap:12px;
    padding:10px 0;
    border-bottom:1px solid var(--border-subtle);
  }

  .booking-row:last-child {
    border-bottom:none;
  }

  .status-pill {
    display:flex;
    align-items:center;
    gap:10px;
    padding:12px 20px;
    border-radius:var(--radius-md);
    border:1px solid;
    background:var(--bg-surface);
    font-size:14px;
  }

  /* FIXED GRID */
  .grid {
    display:grid;
    gap:20px;
    width:100%;
  }

  .grid-4 {
    grid-template-columns:repeat(4, 1fr);
  }

  .grid-2 {
    grid-template-columns:repeat(2, 1fr);
  }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .grid-4 {
      grid-template-columns:repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .grid-4,
    .grid-2 {
      grid-template-columns:1fr;
    }
  }

  .stat-card {
    background:var(--bg-surface);
    border:1px solid var(--border-subtle);
    border-radius:20px;
    padding:24px;
    display:flex;
    flex-direction:column;
    gap:12px;
    min-height:160px;
    transition:0.2s ease;
  }

  .stat-card:hover {
    transform:translateY(-4px);
  }

  .stat-icon {
    width:52px;
    height:52px;
    border-radius:14px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:24px;
  }

  .stat-value {
    font-size:2rem;
    font-weight:800;
    line-height:1;
    font-family:var(--font-display);
  }

  .stat-label {
    color:var(--text-secondary);
    font-size:14px;
    font-weight:500;
  }
`]
})
export class OfficerDashboardComponent implements OnInit {
  user: any;
  loading = false;
  recentBookings: any[] = [];
  stats: any = {
    total:0, active:0, delivered:0,
    newBookings:0, booked:0, scheduled:0,
    intransit:0, cancelled:0
  };

  statusList = [
    { key:'newBookings', label:'New', icon:'🆕',
      color:'var(--accent-primary)' },
    { key:'booked', label:'Booked', icon:'📋',
      color:'#a78bfa' },
    { key:'scheduled', label:'Scheduled', icon:'📅',
      color:'var(--accent-warning)' },
    { key:'intransit', label:'In Transit', icon:'🚚',
      color:'var(--accent-orange)' },
    { key:'delivered', label:'Delivered', icon:'✅',
      color:'var(--accent-success)' },
    { key:'cancelled', label:'Cancelled', icon:'❌',
      color:'var(--accent-danger)' }
  ];

  constructor(
    public router: Router,
    private auth: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getAllBookings({}, 0, 10).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.recentBookings = res.data.content || [];
          this.stats.total = res.data.totalElements || 0;
          this.recentBookings.forEach((b: any) => {
            const s = b.status;
            if (s==='NEW') this.stats.newBookings++;
            else if (s==='BOOKED') this.stats.booked++;
            else if (s==='SCHEDULED') this.stats.scheduled++;
            else if (s==='INTRANSIT') {
              this.stats.intransit++;
              this.stats.active++;
            }
            else if (s==='DELIVERED') this.stats.delivered++;
            else if (s==='CANCELLED') this.stats.cancelled++;
          });
        }
      },
      error: () => { this.loading = false; }
    });
  }
}