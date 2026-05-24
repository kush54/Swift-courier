import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import {
  GpsTrackerService,
  GpsPosition
} from '../../../services/gps-tracker.service';
import { GeocodingService } from '../../../services/geocoding.service';
import { ToastService } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

declare var L: any;

@Component({
  selector: 'app-live-tracking',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar" style="width:100%">
      <div class="page-content" style="max-width:100%">

        <div class="page-header">
          <h2>Live GPS Tracking 🛰️</h2>
          <p>Real-time courier tracking with route optimization</p>
        </div>

        <!-- Main Layout -->
        <div style="display:grid;
          grid-template-columns:320px 1fr;
          gap:18px;align-items:start">

          <!-- Left Panel -->
          <div style="display:flex;
            flex-direction:column;gap:14px">

            <!-- Search -->
            <div class="card" style="padding:18px">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;
                letter-spacing:1px;
                color:var(--text-secondary);
                margin-bottom:10px">
                Load Booking
              </div>
              <div style="display:flex;gap:8px">
                <input class="form-control"
                  [(ngModel)]="searchId"
                  placeholder="Booking ID..."
                  style="flex:1"
                  (keyup.enter)="loadTracking()">
                <button class="btn btn-primary btn-sm"
                  (click)="loadTracking()">
                  <span class="material-icons"
                    style="font-size:16px">search</span>
                </button>
              </div>
            </div>

            <!-- Booking Info -->
            <div class="card" style="padding:18px"
              *ngIf="tracking">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--cyan);margin-bottom:12px">
                Booking Info
              </div>
              <div class="irow" *ngFor="let r of infoRows">
                <span class="ilabel">{{r.label}}</span>
                <span [style.color]="r.color||'inherit'"
                  style="font-weight:600;font-size:13px;
                  text-align:right;max-width:160px;
                  overflow:hidden;text-overflow:ellipsis">
                  {{r.value}}
                </span>
              </div>
            </div>

            <!-- GPS Control -->
            <div class="card" style="padding:18px"
              *ngIf="tracking">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--text-secondary);
                margin-bottom:12px">
                Courier GPS Control
              </div>

              <div *ngIf="!gpsActive">
                <p style="font-size:12px;
                  color:var(--text-secondary);
                  margin-bottom:12px;line-height:1.6">
                  Start GPS tracking to broadcast
                  courier's live location to customers
                  via WebSocket.
                </p>
                <button class="btn btn-success"
                  style="width:100%;
                  justify-content:center"
                  (click)="startGps()">
                  <span class="material-icons">
                    gps_fixed
                  </span>
                  Start Live GPS
                </button>
              </div>

              <div *ngIf="gpsActive">
                <div style="display:flex;
                  align-items:center;gap:8px;
                  margin-bottom:12px">
                  <div class="gps-dot"></div>
                  <span style="font-size:13px;
                    color:var(--green);font-weight:700">
                    GPS Active
                  </span>
                  <span style="font-size:11px;
                    color:var(--text-muted);
                    margin-left:auto">
                    {{updateCount}} updates
                  </span>
                </div>
                <div style="background:var(--bg-surface);
                  border-radius:var(--r-md);
                  padding:10px 12px;
                  font-size:12px;
                  color:var(--text-secondary);
                  margin-bottom:12px">
                  📍 {{currentLat|number:'1.5-5'}},
                  {{currentLng|number:'1.5-5'}}
                </div>
                <button class="btn btn-danger btn-sm"
                  style="width:100%;justify-content:center"
                  (click)="stopGps()">
                  <span class="material-icons"
                    style="font-size:16px">
                    gps_off
                  </span>
                  Stop GPS
                </button>
              </div>
            </div>

            <!-- Manual GPS -->
            <div class="card" style="padding:18px"
              *ngIf="tracking">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--text-secondary);
                margin-bottom:10px">
                Manual Location Push
              </div>
              <div style="display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;margin-bottom:10px">
                <div class="form-group" style="margin:0">
                  <label>Lat</label>
                  <input class="form-control"
                    type="number" step="0.0001"
                    [(ngModel)]="manualLat"
                    placeholder="22.7196">
                </div>
                <div class="form-group" style="margin:0">
                  <label>Lng</label>
                  <input class="form-control"
                    type="number" step="0.0001"
                    [(ngModel)]="manualLng"
                    placeholder="75.8577">
                </div>
              </div>
              <button class="btn btn-ghost btn-sm"
                style="width:100%;justify-content:center"
                (click)="pushManualGps()">
                <span class="material-icons"
                  style="font-size:15px">my_location</span>
                Push Location
              </button>
              <div style="font-size:11px;
                color:var(--text-muted);
                margin-top:8px;text-align:center">
                Or click on map to set location
              </div>
            </div>

            <!-- Status Update -->
            <div class="card" style="padding:18px"
              *ngIf="tracking">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--text-secondary);
                margin-bottom:10px">
                Update Status
              </div>
              <select class="form-control"
                [(ngModel)]="newStatus"
                style="margin-bottom:10px">
                <option value="PICKEDUP">
                  📦 Picked Up
                </option>
                <option value="INTRANSIT">
                  🚚 In Transit
                </option>
                <option value="DELIVERED">
                  ✅ Delivered
                </option>
              </select>
              <button class="btn btn-purple btn-sm"
                style="width:100%;justify-content:center"
                (click)="updateStatus()">
                <span class="material-icons"
                  style="font-size:15px">update</span>
                Update
              </button>
            </div>

            <!-- Routes Panel -->
            <div class="card" style="padding:18px"
              *ngIf="routes.length > 0">
              <div style="font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1px;
                color:var(--text-secondary);
                margin-bottom:10px">
                Route Options
              </div>
              <div *ngFor="let r of routes; let i=index"
                class="route-card"
                [class.sel]="selRoute===i"
                (click)="selectRoute(i)">
                <div style="display:flex;
                  align-items:center;gap:8px">
                  <div style="width:10px;height:10px;
                    border-radius:50%;flex-shrink:0"
                    [style.background]="rColors[i]">
                  </div>
                  <div style="flex:1">
                    <div style="font-weight:700;
                      font-size:13px;
                      display:flex;align-items:center;
                      gap:6px">
                      Route {{i+1}}
                      <span *ngIf="i===0"
                        style="font-size:9px;
                        background:rgba(0,255,136,0.15);
                        color:var(--green);
                        padding:2px 8px;
                        border-radius:10px">
                        FASTEST
                      </span>
                    </div>
                    <div style="font-size:11px;
                      color:var(--text-secondary)">
                      {{(r.distance/1000)|number:'1.1-1'}}km
                      · ~{{(r.duration/60)|number:'1.0-0'}}min
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- MAP - Right Side -->
          <div class="card"
            style="padding:0;overflow:hidden;
            position:sticky;top:20px">
            <!-- Map Header -->
            <div style="padding:14px 18px;
              border-bottom:1px solid var(--border);
              display:flex;align-items:center;gap:10px">
              <span class="material-icons"
                style="color:var(--cyan);font-size:18px">
                satellite_alt
              </span>
              <span style="font-weight:700;font-size:14px">
                Live Map
              </span>
              <div style="margin-left:auto;
                display:flex;align-items:center;
                gap:14px;font-size:12px">
                <div style="display:flex;
                  align-items:center;gap:5px">
                  <div style="width:10px;height:10px;
                    border-radius:50%;
                    background:var(--cyan)"></div>
                  Origin
                </div>
                <div style="display:flex;
                  align-items:center;gap:5px">
                  <div style="width:10px;height:10px;
                    border-radius:50%;
                    background:var(--pink)"></div>
                  Destination
                </div>
                <div style="display:flex;
                  align-items:center;gap:5px">
                  <div class="gps-dot"
                    style="width:10px;height:10px">
                  </div>
                  Courier
                </div>
                <div *ngIf="gpsActive"
                  style="display:flex;align-items:center;
                  gap:5px;color:var(--green);font-weight:700">
                  <div class="gps-dot"
                    style="width:8px;height:8px">
                  </div>
                  LIVE
                </div>
              </div>
            </div>

            <div id="live-map"
              style="height:700px;width:100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .irow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px solid var(--border);
      &:last-child { border-bottom: none; }
    }
    .ilabel {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }
    .route-card {
      padding: 10px;
      border-radius: var(--r-md);
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
      margin-bottom: 6px;
      &:hover { background: var(--bg-surface); }
      &.sel {
        background: rgba(0,245,255,0.06);
        border-color: var(--border-active);
      }
    }
  `]
})
export class LiveTrackingComponent
  implements OnInit, OnDestroy {

  searchId = '';
  tracking: any = null;
  gpsActive = false;
  currentLat = 0;
  currentLng = 0;
  manualLat = 0;
  manualLng = 0;
  newStatus = 'INTRANSIT';
  updateCount = 0;
  routes: any[] = [];
  selRoute = 0;
  rColors = ['#00ff88', '#00f5ff', '#ff6b35', '#8b5cf6'];

  infoRows: any[] = [];

  private map: any;
  private courierMarker: any;
  private originMarker: any;
  private destMarker: any;
  private routeLayers: any[] = [];
  private gpsSub!: Subscription;
  private trailPoints: any[] = [];
  private trailLine: any;

  constructor(
    private bookingService: BookingService,
    private gpsService: GpsTrackerService,
    private geoService: GeocodingService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    setTimeout(() => this.initMap(), 200);
  }

  ngOnDestroy() {
    this.stopGps();
    if (this.map) this.map.remove();
  }

  initMap() {
    this.map = L.map('live-map').setView(
      [22.9734, 78.6569], 5);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap' }
    ).addTo(this.map);

    // Click map to set manual position
    this.map.on('click', (e: any) => {
      if (!this.tracking) return;
      this.manualLat =
        parseFloat(e.latlng.lat.toFixed(6));
      this.manualLng =
        parseFloat(e.latlng.lng.toFixed(6));
      this.updateCourierMarker(
        this.manualLat, this.manualLng);
    });
  }

  loadTracking() {
    if (!this.searchId.trim()) {
      this.toast.error('Enter a booking ID'); return;
    }

    this.bookingService
      .trackBooking(this.searchId.trim())
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.tracking = res.data;
            this.buildInfoRows();
            this.renderMap();
            if (this.tracking.originLat
              && this.tracking.destLat) {
              this.fetchRoutes();
            }
            this.toast.success('Booking loaded!');
          } else {
            this.toast.error('Booking not found');
          }
        },
        error: () =>
          this.toast.error('Booking not found')
      });
  }

  buildInfoRows() {
    const t = this.tracking;
    this.infoRows = [
      {
        label: 'ID', value: t.bookingId,
        color: 'var(--cyan)'
      },
      {
        label: 'Status', value: t.status,
        color: 'var(--green)'
      },
      {
        label: 'Customer',
        value: t.customerName || 'N/A'
      },
      {
        label: 'Receiver',
        value: t.receiverName || 'N/A'
      },
      {
        label: 'Courier',
        value: t.courierName || 'Not assigned'
      },
      {
        label: 'Amount',
        value: t.totalServiceCost
          ? '₹' + t.totalServiceCost : 'N/A',
        color: 'var(--green)'
      }
    ];
  }

  renderMap() {
    const t = this.tracking;

    // Clear existing
    [this.originMarker,
    this.destMarker,
    this.courierMarker].forEach(m => {
      if (m) this.map.removeLayer(m);
    });

    const bounds: any[] = [];

    // Origin marker
    if (t.originLat && t.originLng) {
      const icon = L.divIcon({
        html: `<div style="width:16px;height:16px;
          border-radius:50%;background:#00f5ff;
          border:3px solid #fff;
          box-shadow:0 0 12px rgba(0,245,255,0.8)">
          </div>`,
        iconSize: [16, 16], className: ''
      });
      this.originMarker = L.marker(
        [t.originLat, t.originLng], { icon })
        .addTo(this.map)
        .bindPopup(`<b>📍 Origin</b>`);
      bounds.push([t.originLat, t.originLng]);
    }

    // Destination marker
    if (t.destLat && t.destLng) {
      const icon = L.divIcon({
        html: `<div style="width:16px;height:16px;
          border-radius:50%;background:#ff2d78;
          border:3px solid #fff;
          box-shadow:0 0 12px rgba(255,45,120,0.8)">
          </div>`,
        iconSize: [16, 16], className: ''
      });
      this.destMarker = L.marker(
        [t.destLat, t.destLng], { icon })
        .addTo(this.map)
        .bindPopup(`<b>🎯 Destination</b>
          <br>${t.receiverAddress || ''}`);
      bounds.push([t.destLat, t.destLng]);
    }

    // Courier current position
    if (t.currentLat && t.currentLng) {
      this.updateCourierMarker(
        t.currentLat, t.currentLng);
      this.manualLat = t.currentLat;
      this.manualLng = t.currentLng;
      bounds.push([t.currentLat, t.currentLng]);
    }

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  updateCourierMarker(lat: number, lng: number) {
    if (this.courierMarker) {
      this.map.removeLayer(this.courierMarker);
    }

    const icon = L.divIcon({
      html: `
        <div style="position:relative">
          <div style="width:22px;height:22px;
            border-radius:50%;background:#00ff88;
            border:3px solid #fff;
            box-shadow:0 0 0 6px rgba(0,255,136,0.2);
            z-index:2;position:relative">
          </div>
          <div style="position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            font-size:10px;text-align:center;
            line-height:1;z-index:3;
            font-weight:900;color:#000">
            🚚
          </div>
        </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      className: ''
    });

    this.courierMarker = L.marker([lat, lng], { icon })
      .addTo(this.map)
      .bindPopup(`🚚 Courier Location<br>
        ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

    // Add to trail
    this.trailPoints.push([lat, lng]);
    if (this.trailLine) {
      this.map.removeLayer(this.trailLine);
    }
    if (this.trailPoints.length > 1) {
      this.trailLine = L.polyline(
        this.trailPoints, {
        color: '#00ff88',
        weight: 2,
        opacity: 0.6,
        dashArray: '4,4'
      }
      ).addTo(this.map);
    }

    this.currentLat = lat;
    this.currentLng = lng;
  }

  fetchRoutes() {
    const t = this.tracking;
    if (!t.originLat || !t.destLat) return;

    this.routeLayers.forEach(l => this.map.removeLayer(l));
    this.routeLayers = [];

    this.geoService.getRoutes(
      t.originLat, t.originLng,
      t.destLat, t.destLng
    ).subscribe({
      next: (res: any) => {
        // if (res.routes?.length) {
        //   this.routes = res.routes;
        //   this.drawRoutes();
        // }
        if (res.routes && res.routes.length) {
          // ✅ Distance ke basis pe sort karo
          this.routes = res.routes.sort(
            (a: any, b: any) => a.distance - b.distance
          );
          this.drawRoutes();
        }
      },
      error: () => {
        // Draw straight line fallback
        this.drawFallbackLine();
      }
    });
  }

  drawRoutes() {
    this.routes.forEach((route: any, i: number) => {
      const coords = this.geoService.decodePolyline(
        route.geometry.coordinates);
      const line = L.polyline(coords, {
        color: this.rColors[i],
        weight: i === 0 ? 6 : 3,
        opacity: i === 0 ? 0.9 : 0.45,
        dashArray: i === 0 ? null : '10,8'
      }).addTo(this.map);

      if (i === 0) {
        line.bindPopup(
          `🏆 Shortest Route<br>
          ${(route.distance / 1000).toFixed(1)} km · 
          ~${Math.round(route.duration / 60)} min`);
      }
      this.routeLayers.push(line);
    });

    if (this.routeLayers.length) {
      const group = L.featureGroup(this.routeLayers);
      this.map.fitBounds(
        group.getBounds(), { padding: [50, 50] });
    }
  }

  drawFallbackLine() {
    const t = this.tracking;
    const line = L.polyline([
      [t.originLat, t.originLng],
      [t.destLat, t.destLng]
    ], {
      color: '#00ff88', weight: 4,
      dashArray: '10,8', opacity: 0.7
    }).addTo(this.map);
    this.routeLayers.push(line);

    const dist = this.haversine(
      t.originLat, t.originLng,
      t.destLat, t.destLng);
    this.routes = [{
      distance: dist * 1000,
      duration: (dist / 60) * 3600
    }];
  }

  selectRoute(i: number) {
    this.selRoute = i;
    this.routeLayers.forEach((l, idx) => {
      l.setStyle({
        weight: idx === i ? 6 : 3,
        opacity: idx === i ? 0.9 : 0.35
      });
      if (idx === i) l.bringToFront();
    });
  }

  startGps() {
    if (!this.tracking) {
      this.toast.error('Load a booking first'); return;
    }
    this.gpsActive = true;
    this.trailPoints = [];
    this.updateCount = 0;
    this.toast.success(
      'GPS tracking started for '
      + this.tracking.bookingId);

    this.gpsSub = this.gpsService.startTracking(
      this.tracking.bookingId
    ).subscribe((pos: GpsPosition) => {
      this.updateCourierMarker(pos.lat, pos.lng);
      this.updateCount++;
    });
  }

  stopGps() {
    this.gpsActive = false;
    this.gpsService.stopTracking();
    if (this.gpsSub) this.gpsSub.unsubscribe();
    this.toast.info('GPS tracking stopped');
  }

  pushManualGps() {
    if (!this.manualLat || !this.manualLng) {
      this.toast.error('Enter coordinates'); return;
    }
    if (!this.tracking) {
      this.toast.error('Load a booking first'); return;
    }

    this.bookingService.updateGps(
      this.tracking.bookingId,
      this.manualLat,
      this.manualLng
    ).subscribe({
      next: () => {
        this.updateCourierMarker(
          this.manualLat, this.manualLng);
        this.toast.success('Location pushed!');
      },
      error: () => this.toast.error('Push failed')
    });
  }

  updateStatus() {
    if (!this.tracking) return;
    this.bookingService.updateStatus(
      this.tracking.bookingId,
      {
        status: this.newStatus,
        currentLat: this.currentLat,
        currentLng: this.currentLng
      }
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.tracking.status = this.newStatus;
          this.buildInfoRows();
          this.toast.success(
            'Status → ' + this.newStatus);
        }
      },
      error: () =>
        this.toast.error('Status update failed')
    });
  }

  haversine(lat1: number, lng1: number,
    lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(
      Math.sqrt(a), Math.sqrt(1 - a));
  }
}