// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';

// @Component({
//   selector: 'app-sidebar',
//   template: `
//     <nav class="sidebar">
//       <div class="logo">
//         <div class="logo-icon">🚀</div>
//         <div class="logo-text">Swift</div>
//       </div>

//       <ng-container *ngIf="user?.role === 'CUSTOMER'">
//         <div class="nav-section-label">Customer Menu</div>
//         <button class="nav-item" [class.active]="isActive('/customer/dashboard')"
//           (click)="nav('/customer/dashboard')">
//           <span class="material-icons nav-icon">dashboard</span> Dashboard
//         </button>
//         <button class="nav-item" [class.active]="isActive('/customer/book')"
//           (click)="nav('/customer/book')">
//           <span class="material-icons nav-icon">add_box</span> New Booking
//         </button>
//         <button class="nav-item" [class.active]="isActive('/customer/history')"
//           (click)="nav('/customer/history')">
//           <span class="material-icons nav-icon">history</span> My Bookings
//         </button>
//         <button class="nav-item" [class.active]="isActive('/track')"
//           (click)="nav('/track')">
//           <span class="material-icons nav-icon">location_on</span> Track Parcel
//         </button>
//       </ng-container>

//       <ng-container *ngIf="user?.role === 'OFFICER'">
//         <div class="nav-section-label">Operations</div>
//         <button class="nav-item" [class.active]="isActive('/officer/dashboard')"
//           (click)="nav('/officer/dashboard')">
//           <span class="material-icons nav-icon">dashboard</span> Dashboard
//         </button>
//         <button class="nav-item" [class.active]="isActive('/officer/bookings')"
//           (click)="nav('/officer/bookings')">
//           <span class="material-icons nav-icon">list_alt</span> All Bookings
//         </button>
//         <button class="nav-item" [class.active]="isActive('/officer/counter-book')"
//           (click)="nav('/officer/counter-book')">
//           <span class="material-icons nav-icon">add_circle</span> Counter Booking
//         </button>
//         <button class="nav-item" [class.active]="isActive('/officer/live-tracking')"
//           (click)="nav('/officer/live-tracking')">
//           <span class="material-icons nav-icon">gps_fixed</span> Live Tracking
//         </button>
//         <button class="nav-item" [class.active]="isActive('/track')"
//           (click)="nav('/track')">
//           <span class="material-icons nav-icon">search</span> Track Parcel
//         </button>
//       </ng-container>

//       <div class="spacer"></div>

//       <div class="user-card">
//         <div class="avatar">{{user?.customerName?.charAt(0) || 'U'}}</div>
//         <div class="user-info">
//           <div class="user-name">{{user?.customerName}}</div>
//           <div class="user-role">{{user?.role}}</div>
//         </div>
//         <button (click)="logout()"
//           style="background:none;border:none;cursor:pointer;
//           color:var(--text-secondary);padding:4px">
//           <span class="material-icons" style="font-size:18px">logout</span>
//         </button>
//       </div>
//     </nav>
//   `
// })
// export class SidebarComponent implements OnInit {
//   user: any;
//   constructor(private auth: AuthService, private router: Router) {}
//   ngOnInit() { this.user = this.auth.getUser(); }
//   nav(path: string) { this.router.navigate([path]); }
//   isActive(path: string): boolean { return this.router.url.startsWith(path); }
//   logout() { this.auth.logout(); this.router.navigate(['/login']); }
// }



import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService, Notification } from '../../../services/Notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  template: `
  <nav class="sidebar">
    <div class="logo">
      <div class="logo-mark">🚀</div>
      <span class="logo-text">Swift</span>
    </div>

    <ng-container *ngIf="user?.role==='CUSTOMER'">
      <div class="nav-label">Menu</div>
      <button class="nav-item" [class.active]="is('/customer/dashboard')" (click)="go('/customer/dashboard')">
        <span class="material-icons nav-icon">grid_view</span> Dashboard
      </button>
      <button class="nav-item" [class.active]="is('/customer/book')" (click)="go('/customer/book')">
        <span class="material-icons nav-icon">add_box</span> New Booking
      </button>
      <button class="nav-item" [class.active]="is('/customer/history')" (click)="go('/customer/history')">
        <span class="material-icons nav-icon">receipt_long</span> My Bookings
      </button>
      <button class="nav-item" [class.active]="is('/track')" (click)="go('/track')">
        <span class="material-icons nav-icon">location_on</span> Track Parcel
      </button>
    </ng-container>

    <ng-container *ngIf="user?.role==='OFFICER'">
      <div class="nav-label">Operations</div>
      <button class="nav-item" [class.active]="is('/officer/dashboard')" (click)="go('/officer/dashboard')">
        <span class="material-icons nav-icon">grid_view</span> Dashboard
      </button>
      <button class="nav-item" [class.active]="is('/officer/bookings')" (click)="go('/officer/bookings')">
        <span class="material-icons nav-icon">list_alt</span> All Bookings
      </button>
      <button class="nav-item" [class.active]="is('/officer/counter-book')" (click)="go('/officer/counter-book')">
        <span class="material-icons nav-icon">point_of_sale</span> Counter Booking
      </button>
      <button class="nav-item" [class.active]="is('/officer/live-tracking')" (click)="go('/officer/live-tracking')">
        <span class="material-icons nav-icon">satellite_alt</span> Live Tracking
      </button>
      <button class="nav-item" [class.active]="is('/track')" (click)="go('/track')">
        <span class="material-icons nav-icon">search</span> Track Parcel
      </button>
    </ng-container>

    <div class="spacer"></div>

    <!-- Notification Bell (Customer only) -->
    <div class="notif-area" *ngIf="user?.role==='CUSTOMER'">
      <button class="notif-btn" (click)="toggleNotif($event)">
        <span class="material-icons" style="font-size:20px;color:var(--ink3)">notifications</span>
        <div class="notif-badge" *ngIf="unread > 0">{{unread > 9 ? '9+' : unread}}</div>
      </button>
      <span style="font-size:13px;color:var(--ink3);font-weight:500">Notifications</span>

      <!-- Panel -->
      <div class="notif-panel" *ngIf="showNotifs" (click)="$event.stopPropagation()">
        <div class="np-head">
          <span style="font-weight:700;font-size:14px">Notifications</span>
          <button class="btn btn-sm" style="padding:4px 8px;font-size:11px;background:var(--cream2);color:var(--ink3);border:none" (click)="markRead()">Mark all read</button>
        </div>
        <div class="np-list">
          <div *ngFor="let n of notifs" class="np-item" [class.unread]="!n.read">
            <div class="ni-icon">{{getIcon(n.type)}}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:var(--ink)">{{n.title}}</div>
              <div style="font-size:12px;color:var(--ink3);margin-top:2px;line-height:1.4">{{n.body}}</div>
              <div style="font-size:10px;color:var(--ink4);margin-top:4px">{{n.timestamp | date:'dd MMM, h:mm a'}}</div>
            </div>
          </div>
          <div *ngIf="notifs.length===0" style="padding:24px;text-align:center;color:var(--ink4);font-size:13px">
            No notifications yet
          </div>
        </div>
      </div>
    </div>

    <div class="user-pill">
      <div class="av">{{user?.customerName?.charAt(0)||'U'}}</div>
      <div style="flex:1;min-width:0">
        <div class="ui-name">{{user?.customerName}}</div>
        <div class="ui-role">{{user?.role}}</div>
      </div>
      <button (click)="logout()" style="background:none;border:none;cursor:pointer;color:var(--ink4);padding:2px;display:flex" title="Logout">
        <span class="material-icons" style="font-size:17px">logout</span>
      </button>
    </div>
  </nav>
  `,
  styles: [`
    .notif-area { display:flex; align-items:center; gap:8px; padding:8px 10px; margin-bottom:6px; position:relative; }
    .notif-btn { background:none; border:none; cursor:pointer; padding:4px; position:relative; display:flex; align-items:center; border-radius:var(--r-md); transition:background 0.12s;
      &:hover { background:var(--cream2); }
    }
    .notif-badge { position:absolute; top:-1px; right:-1px; min-width:16px; height:16px; border-radius:8px; background:var(--red); color:#fff; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; padding:0 3px; border:2px solid var(--white); }
    .notif-panel { position:absolute; bottom:100%; left:0; width:300px; margin-bottom:8px; background:var(--white); border:1px solid var(--border); border-radius:var(--r-xl); box-shadow:var(--shadow-lg); z-index:300; overflow:hidden; }
    .np-head { padding:12px 14px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; background:var(--cream); }
    .np-list { max-height:260px; overflow-y:auto; }
    .np-item { display:flex; gap:10px; padding:11px 14px; border-bottom:1px solid var(--border); transition:background 0.1s; cursor:pointer;
      &:last-child { border-bottom:none; }
      &:hover { background:var(--cream); }
      &.unread { background:var(--amber-light); }
    }
    .ni-icon { font-size:18px; flex-shrink:0; margin-top:1px; }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: any;
  notifs: Notification[] = [];
  unread = 0;
  showNotifs = false;
  private sub!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifSvc: NotificationService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    if (this.user?.role === 'CUSTOMER') {
      this.notifSvc.connectForCustomer(this.user.customerId);
    }
    this.sub = this.notifSvc.notifs$.subscribe(ns => {
      this.notifs = ns.slice(0, 20);
      this.unread = ns.filter(n => !n.read).length;
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  @HostListener('document:click')
  onDocClick() { this.showNotifs = false; }

  toggleNotif(e: Event) {
    e.stopPropagation();
    this.showNotifs = !this.showNotifs;
  }

  markRead() { this.notifSvc.markAllRead(); }

  getIcon(type: string): string {
    return type === 'status' ? '📦' : type === 'payment' ? '💳' : '📬';
  }

  go(path: string) { this.router.navigate([path]); }
  is(path: string): boolean { return this.router.url.startsWith(path); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}