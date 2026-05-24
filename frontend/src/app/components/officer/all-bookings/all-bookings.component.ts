// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { BookingService } from '../../../services/booking.service';
// import { ToastService } from '../../../services/toast.service';

// @Component({
//   selector: 'app-all-bookings',
//   template: `
//   <div class="page-wrapper" style="display:flex">
//     <app-sidebar></app-sidebar>
//     <div class="main-with-sidebar">
//       <div class="page-content">
//         <div class="page-header">
//           <h2>All Bookings</h2>
//           <p>Search, filter and manage all shipments</p>
//         </div>

//         <!-- Filters -->
//         <div class="card" style="margin-bottom:24px">
//           <div style="display:flex;gap:12px;flex-wrap:wrap;
//             align-items:flex-end">
//             <div class="form-group" style="margin:0;flex:1;
//               min-width:160px">
//               <label>Booking ID</label>
//               <input class="form-control" type="text"
//                 [(ngModel)]="filters.bookingId"
//                 placeholder="BK-20240001">
//             </div>
//             <div class="form-group" style="margin:0;flex:1;
//               min-width:160px">
//               <label>Customer ID</label>
//               <input class="form-control" type="text"
//                 [(ngModel)]="filters.customerId"
//                 placeholder="CUST-1001">
//             </div>
//             <div class="form-group" style="margin:0;flex:1;
//               min-width:140px">
//               <label>Status</label>
//               <select class="form-control"
//                 [(ngModel)]="filters.status">
//                 <option value="">All Status</option>
//                 <option value="NEW">New</option>
//                 <option value="BOOKED">Booked</option>
//                 <option value="SCHEDULED">Scheduled</option>
//                 <option value="PICKEDUP">Picked Up</option>
//                 <option value="INTRANSIT">In Transit</option>
//                 <option value="DELIVERED">Delivered</option>
//                 <option value="CANCELLED">Cancelled</option>
//               </select>
//             </div>
//             <div style="display:flex;gap:8px">
//               <button class="btn btn-primary"
//                 (click)="search()">
//                 <span class="material-icons">search</span>
//                 Search
//               </button>
//               <button class="btn btn-secondary"
//                 (click)="clearFilters()">
//                 <span class="material-icons">clear</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div *ngIf="loading" class="loading-overlay">
//           <div class="spinner"></div>
//           <span>Loading bookings...</span>
//         </div>

//         <div *ngIf="!loading">
//           <div class="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Booking ID</th>
//                   <th>Customer</th>
//                   <th>Receiver</th>
//                   <th>Weight</th>
//                   <th>Type</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr *ngFor="let b of bookings">
//                   <td>
//                     <span style="font-weight:600;
//                       color:var(--accent-primary);
//                       font-size:13px">
//                       {{b.bookingId}}
//                     </span>
//                   </td>
//                   <td>
//                     <div style="font-size:13px;font-weight:500">
//                       {{b.customerId}}
//                     </div>
//                     <div style="font-size:11px;
//                       color:var(--text-secondary)">
//                       {{b.customerName}}
//                     </div>
//                   </td>
//                   <td>
//                     <div style="font-size:13px">
//                       {{b.receiverName}}
//                     </div>
//                     <div style="font-size:11px;
//                       color:var(--text-secondary);
//                       max-width:120px;overflow:hidden;
//                       text-overflow:ellipsis;white-space:nowrap">
//                       {{b.receiverAddress}}
//                     </div>
//                   </td>
//                   <td style="font-size:13px">
//                     {{b.parcelWeightGrams}}g
//                   </td>
//                   <td>
//                     <span style="font-size:11px;
//                       color:var(--text-secondary)">
//                       {{b.deliveryType}}
//                     </span>
//                   </td>
//                   <td style="font-weight:600;
//                     color:var(--accent-success)">
//                     ₹{{b.totalServiceCost}}
//                   </td>
//                   <td>
//                     <span class="badge badge-{{b.status}}">
//                       {{b.status}}
//                     </span>
//                   </td>
//                   <td style="font-size:12px;
//                     color:var(--text-secondary)">
//                     {{b.bookingDate | slice:0:10}}
//                   </td>
//                   <td>
//                     <div style="display:flex;gap:4px">
//                       <button class="btn btn-ghost btn-sm"
//                         title="Schedule Pickup"
//                         (click)="openSchedule(b)"
//                         *ngIf="b.status==='BOOKED'">
//                         <span class="material-icons"
//                           style="font-size:14px">
//                           schedule
//                         </span>
//                       </button>
//                       <button class="btn btn-secondary btn-sm"
//                         title="Update Status"
//                         (click)="openStatus(b)"
//                         *ngIf="b.status==='SCHEDULED'||
//                           b.status==='PICKEDUP'||
//                           b.status==='INTRANSIT'">
//                         <span class="material-icons"
//                           style="font-size:14px">
//                           update
//                         </span>
//                       </button>
//                       <button class="btn btn-ghost btn-sm"
//                         title="Track"
//                         (click)="router.navigate(['/track',b.bookingId])">
//                         <span class="material-icons"
//                           style="font-size:14px">
//                           location_on
//                         </span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr *ngIf="bookings.length===0">
//                   <td colspan="9"
//                     style="text-align:center;padding:40px;
//                     color:var(--text-secondary)">
//                     No bookings found
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div class="pagination" *ngIf="totalPages>1">
//             <button (click)="changePage(currentPage-1)"
//               [disabled]="currentPage===0">
//               <span class="material-icons"
//                 style="font-size:16px">chevron_left</span>
//             </button>
//             <button *ngFor="let p of pages"
//               [class.active]="p===currentPage"
//               (click)="changePage(p)">{{p+1}}</button>
//             <button (click)="changePage(currentPage+1)"
//               [disabled]="currentPage===totalPages-1">
//               <span class="material-icons"
//                 style="font-size:16px">chevron_right</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

//   <!-- Schedule Modal -->
//   <div class="modal-overlay" *ngIf="showSchedule"
//     (click)="showSchedule=false">
//     <div class="modal-box" (click)="$event.stopPropagation()">
//       <h3 style="margin-bottom:20px">📅 Schedule Pickup</h3>
//       <div class="form-group">
//         <label>Courier Name</label>
//         <input class="form-control" type="text"
//           [(ngModel)]="scheduleForm.courierName"
//           placeholder="Delivery person name">
//       </div>
//       <div class="form-group">
//         <label>Courier Asset ID</label>
//         <input class="form-control" type="text"
//           [(ngModel)]="scheduleForm.courierAssetId"
//           placeholder="e.g. VH-001">
//       </div>
//       <div class="form-group">
//         <label>Pickup Date & Time</label>
//         <input class="form-control" type="datetime-local"
//           [(ngModel)]="scheduleForm.scheduledPickupDate">
//       </div>
//       <div class="form-group">
//         <label>Expected Delivery Date</label>
//         <input class="form-control" type="datetime-local"
//           [(ngModel)]="scheduleForm.scheduledDropoffDate">
//       </div>
//       <div style="display:flex;gap:12px;justify-content:flex-end">
//         <button class="btn btn-secondary"
//           (click)="showSchedule=false">Cancel</button>
//         <button class="btn btn-primary"
//           (click)="submitSchedule()">
//           <span class="material-icons">check</span>
//           Schedule
//         </button>
//       </div>
//     </div>
//   </div>

//   <!-- Status Modal -->
//   <div class="modal-overlay" *ngIf="showStatusModal"
//     (click)="showStatusModal=false">
//     <div class="modal-box" (click)="$event.stopPropagation()">
//       <h3 style="margin-bottom:20px">🔄 Update Status</h3>
//       <p style="color:var(--text-secondary);
//         margin-bottom:16px;font-size:14px">
//         Booking: <strong>{{selectedBooking?.bookingId}}</strong>
//       </p>
//       <div class="form-group">
//         <label>New Status</label>
//         <select class="form-control"
//           [(ngModel)]="newStatus">
//           <option value="PICKEDUP">Picked Up</option>
//           <option value="INTRANSIT">In Transit</option>
//           <option value="DELIVERED">Delivered</option>
//         </select>
//       </div>
//       <div style="display:flex;gap:12px;justify-content:flex-end">
//         <button class="btn btn-secondary"
//           (click)="showStatusModal=false">Cancel</button>
//         <button class="btn btn-success"
//           (click)="submitStatus()">
//           <span class="material-icons">update</span>
//           Update
//         </button>
//       </div>
//     </div>
//   </div>
//   `,
//   styles: [`
//     .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0;
//       background:rgba(0,0,0,0.7); display:flex; align-items:center;
//       justify-content:center; z-index:1000; }
//     .modal-box { background:var(--bg-card);
//       border:1px solid var(--border-subtle);
//       border-radius:var(--radius-xl); padding:32px;
//       width:100%; max-width:460px;
//       box-shadow:0 20px 60px rgba(0,0,0,0.5); }
//   `]
// })
// export class AllBookingsComponent implements OnInit {
//   bookings: any[] = [];
//   loading = false;
//   currentPage = 0;
//   totalPages = 0;
//   pages: number[] = [];
//   filters = { bookingId:'', customerId:'', status:'' };
//   showSchedule = false;
//   showStatusModal = false;
//   selectedBooking: any = null;
//   newStatus = 'PICKEDUP';
//   scheduleForm = {
//     courierName:'', courierAssetId:'',
//     scheduledPickupDate:'', scheduledDropoffDate:''
//   };

//   constructor(
//     public router: Router,
//     private bookingService: BookingService,
//     private toast: ToastService
//   ) {}

//   ngOnInit() { this.load(); }

//   load() {
//     this.loading = true;
//     this.bookingService.getAllBookings(
//       this.filters, this.currentPage, 10).subscribe({
//       next: (res: any) => {
//         this.loading = false;
//         if (res.success) {
//           this.bookings = res.data.content || [];
//           this.totalPages = res.data.totalPages || 0;
//           this.pages = Array.from(
//             { length: this.totalPages }, (_, i) => i);
//         }
//       },
//       error: () => { this.loading = false; }
//     });
//   }

//   search() { this.currentPage = 0; this.load(); }

//   clearFilters() {
//     this.filters = { bookingId:'', customerId:'', status:'' };
//     this.currentPage = 0; this.load();
//   }

//   changePage(p: number) {
//     if (p < 0 || p >= this.totalPages) return;
//     this.currentPage = p; this.load();
//   }

//   openSchedule(b: any) {
//     this.selectedBooking = b;
//     this.showSchedule = true;
//   }

//   submitSchedule() {
//     if (!this.scheduleForm.courierName) {
//       this.toast.error('Enter courier name'); return;
//     }
//     this.bookingService.schedulePickup(
//       this.selectedBooking.bookingId,
//       this.scheduleForm
//     ).subscribe({
//       next: (res: any) => {
//         if (res.success) {
//           this.toast.success('Pickup scheduled!');
//           this.showSchedule = false; this.load();
//         }
//       },
//       error: () => this.toast.error('Schedule failed.')
//     });
//   }

//   openStatus(b: any) {
//     this.selectedBooking = b;
//     this.showStatusModal = true;
//   }

//   submitStatus() {
//     this.bookingService.updateStatus(
//       this.selectedBooking.bookingId,
//       { status: this.newStatus }
//     ).subscribe({
//       next: (res: any) => {
//         if (res.success) {
//           this.toast.success('Status updated!');
//           this.showStatusModal = false; this.load();
//         }
//       },
//       error: () => this.toast.error('Update failed.')
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-all-bookings',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>

    <div class="main-with-sidebar">
      <div class="page-content">

        <div class="page-header">
          <h2>All Bookings</h2>
          <p>Search, filter and manage all shipments</p>
        </div>

        <!-- FILTERS -->
        <div class="card filter-card">

          <div class="filters-grid">

            <div class="form-group">
              <label>Booking ID</label>

              <input class="form-control"
                type="text"
                [(ngModel)]="filters.bookingId"
                placeholder="BK-20240001">
            </div>

            <div class="form-group">
              <label>Customer ID</label>

              <input class="form-control"
                type="text"
                [(ngModel)]="filters.customerId"
                placeholder="CUST-1001">
            </div>

            <div class="form-group">
              <label>Status</label>

              <select class="form-control"
                [(ngModel)]="filters.status">

                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="BOOKED">Booked</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PICKEDUP">Picked Up</option>
                <option value="INTRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>

              </select>
            </div>

            <div class="filter-actions">

              <button class="btn btn-primary"
                (click)="search()">

                <span class="material-icons">
                  search
                </span>

                Search
              </button>

              <button class="btn btn-secondary"
                (click)="clearFilters()">

                <span class="material-icons">
                  clear
                </span>

                Clear
              </button>

            </div>

          </div>

        </div>

        <!-- LOADING -->
        <div *ngIf="loading" class="loading-overlay">

          <div class="spinner"></div>

          <span>Loading bookings...</span>

        </div>

        <!-- TABLE -->
        <div *ngIf="!loading">

          <div class="table-container">

            <table>

              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Receiver</th>
                  <th>Weight</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                <tr *ngFor="let b of bookings">

                  <td>
                    <div class="booking-id">
                      {{b.bookingId}}
                    </div>
                  </td>

                  <td>

                    <div class="primary-text">
                      {{b.customerId}}
                    </div>

                    <div class="secondary-text">
                      {{b.customerName}}
                    </div>

                  </td>

                  <td>

                    <div class="primary-text">
                      {{b.receiverName}}
                    </div>

                    <div class="secondary-text ellipsis">
                      {{b.receiverAddress}}
                    </div>

                  </td>

                  <td>
                    {{b.parcelWeightGrams}}g
                  </td>

                  <td>
                    {{b.deliveryType}}
                  </td>

                  <td class="price">
                    ₹{{b.totalServiceCost}}
                  </td>

                  <td>

                    <span class="badge badge-{{b.status}}">
                      {{b.status}}
                    </span>

                  </td>

                  <td>
                    {{b.bookingDate | slice:0:10}}
                  </td>

                  <td>

                    <div class="actions">

                      <!-- SCHEDULE -->
                      <button
                        *ngIf="b.status==='BOOKED'"
                        class="btn btn-primary btn-sm"
                        (click)="openSchedule(b)">

                        <span class="material-icons">
                          schedule
                        </span>

                      </button>

                      <!-- UPDATE -->
                      <button
                        *ngIf="b.status==='SCHEDULED' ||
                          b.status==='PICKEDUP' ||
                          b.status==='INTRANSIT'"
                        class="btn btn-secondary btn-sm"
                        (click)="openStatus(b)">

                        <span class="material-icons">
                          update
                        </span>

                      </button>

                      <!-- TRACK -->
                      <button
                        class="btn btn-ghost btn-sm"
                        (click)="router.navigate(['/track',b.bookingId])">

                        <span class="material-icons">
                          location_on
                        </span>

                      </button>

                    </div>

                  </td>

                </tr>

                <tr *ngIf="bookings.length===0">

                  <td colspan="9" class="empty-row">
                    No bookings found
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <!-- PAGINATION -->
          <div class="pagination" *ngIf="totalPages>1">

            <button
              (click)="changePage(currentPage-1)"
              [disabled]="currentPage===0">

              <span class="material-icons">
                chevron_left
              </span>

            </button>

            <button
              *ngFor="let p of pages"
              [class.active]="p===currentPage"
              (click)="changePage(p)">

              {{p+1}}

            </button>

            <button
              (click)="changePage(currentPage+1)"
              [disabled]="currentPage===totalPages-1">

              <span class="material-icons">
                chevron_right
              </span>

            </button>

          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- SCHEDULE MODAL -->
  <div class="modal-overlay"
    *ngIf="showSchedule"
    (click)="showSchedule=false">

    <div class="modal-box schedule-modal"
      (click)="$event.stopPropagation()">

      <div class="modal-header">

        <h3>📅 Schedule Pickup</h3>

        <button class="close-btn"
          (click)="showSchedule=false">

          ✕

        </button>

      </div>

      <div class="booking-info">

        <div>
          <span class="label">Booking ID</span>

          <strong>
            {{selectedBooking?.bookingId}}
          </strong>
        </div>

        <div>
          <span class="label">Receiver</span>

          <strong>
            {{selectedBooking?.receiverName}}
          </strong>
        </div>

      </div>

      <div class="form-group">

        <label>Select Courier *</label>

        <select class="form-control"
          [(ngModel)]="scheduleForm.courierName"
          (change)="selectCourier(scheduleForm.courierName)">

          <option value="">
            Choose Courier
          </option>

          <option
            *ngFor="let c of couriers"
            [value]="c.name">

            {{c.name}} • {{c.assetId}}

          </option>

        </select>

      </div>

      <div class="form-group">

        <label>Vehicle / Asset ID</label>

        <input class="form-control"
          type="text"
          [(ngModel)]="scheduleForm.courierAssetId"
          readonly>

      </div>

      <div class="grid-2">

        <div class="form-group">

          <label>Pickup Date *</label>

          <input class="form-control"
            type="datetime-local"
            [(ngModel)]="scheduleForm.scheduledPickupDate">

        </div>

        <div class="form-group">

          <label>Expected Delivery *</label>

          <input class="form-control"
            type="datetime-local"
            [(ngModel)]="scheduleForm.scheduledDropoffDate">

        </div>

      </div>

      <div class="schedule-summary">

        <div class="summary-row">

          <span>Status After Schedule</span>

          <span class="badge badge-SCHEDULED">
            SCHEDULED
          </span>

        </div>

        <div class="summary-row">

          <span>Assigned Vehicle</span>

          <strong>
            {{scheduleForm.courierAssetId || '--'}}
          </strong>

        </div>

      </div>

      <div class="modal-actions">

        <button class="btn btn-secondary"
          (click)="showSchedule=false">

          Cancel

        </button>

        <button class="btn btn-primary"
          (click)="submitSchedule()">

          <span class="material-icons">
            check_circle
          </span>

          Confirm Schedule

        </button>

      </div>

    </div>

  </div>

  <!-- STATUS MODAL -->
  <div class="modal-overlay"
    *ngIf="showStatusModal"
    (click)="showStatusModal=false">

    <div class="modal-box"
      (click)="$event.stopPropagation()">

      <h3 style="margin-bottom:20px">
        🔄 Update Status
      </h3>

      <p class="secondary-text"
        style="margin-bottom:20px">

        Booking:
        <strong>
          {{selectedBooking?.bookingId}}
        </strong>

      </p>

      <div class="form-group">

        <label>New Status</label>

        <select class="form-control"
          [(ngModel)]="newStatus">

          <option value="PICKEDUP">
            Picked Up
          </option>

          <option value="INTRANSIT">
            In Transit
          </option>

          <option value="DELIVERED">
            Delivered
          </option>

        </select>

      </div>

      <div class="modal-actions">

        <button class="btn btn-secondary"
          (click)="showStatusModal=false">

          Cancel

        </button>

        <button class="btn btn-success"
          (click)="submitStatus()">

          <span class="material-icons">
            update
          </span>

          Update

        </button>

      </div>

    </div>

  </div>
  `,
  styles: [`
    .filter-card {
      margin-bottom: 24px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      align-items: end;
    }

    .filter-actions {
      display: flex;
      gap: 10px;
    }

    .booking-id {
      font-weight: 700;
      color: var(--accent-primary);
      font-size: 13px;
    }

    input[type="datetime-local"] {
  width: 100%;
  min-height: 56px;
}

    .primary-text {
      font-size: 13px;
      font-weight: 600;
    }

    .secondary-text {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .ellipsis {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .price {
      font-weight: 700;
      color: var(--accent-success);
    }

    .actions {
      display: flex;
      gap: 6px;
    }

    .empty-row {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.72);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  overflow-y: auto;

  z-index: 2000;
}

.modal-box::-webkit-scrollbar {
  width: 8px;
}

.modal-box::-webkit-scrollbar-track {
  background: transparent;
}

.modal-box::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 20px;
}

.modal-box {
  width: 100%;
  max-width: 980px;

  background: #ffffff;
  color: #111827;

  border-radius: 24px;
  padding: 32px;

  position: relative;

  border: 1px solid rgba(255,255,255,0.08);

  box-shadow:
    0 25px 80px rgba(0,0,0,0.45),
    0 0 0 1px rgba(255,255,255,0.04);

  /* IMPORTANT FIX */
  max-height: 92vh;
  overflow-y: auto;

  animation: modalPop 0.22s ease;
}

  @keyframes modalPop {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-box .form-control {
    background: #ffffff !important;
    border: 1px solid #d1d5db !important;
    color: #111827 !important;

    height: 56px;
    border-radius: 14px;

    font-size: 15px;
    padding: 0 16px;

    box-shadow: none;
  }

  .modal-box .form-control:focus {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.15);
  }

  .modal-box label {
    display: block;
    margin-bottom: 10px;

    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: #374151;
  }

  .schedule-summary {
    margin-top: 24px;

    background: #f0fdf4;
    border: 1px solid #86efac;

    border-radius: 18px;
    padding: 20px;
  }

  .schedule-summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .schedule-summary-row:last-child {
    margin-bottom: 0;
  }

  .status-pill {
    background: #dcfce7;
    color: #15803d;

    padding: 6px 14px;
    border-radius: 999px;

    font-size: 12px;
    font-weight: 700;
  }

 

    .close-btn {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 18px;
      color: var(--text-secondary);
    }

    .booking-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 16px;
      border-radius: 16px;
      background: var(--bg-surface);
      margin-bottom: 24px;
    }

    .label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

   .grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
}

.schedule-summary {
  margin-top: 28px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(0,255,136,0.06);
  border: 1px solid rgba(0,255,136,0.15);
}

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

  .modal-actions {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
}

    @media (max-width: 900px) {

      .filters-grid {
        grid-template-columns: 1fr 1fr;
      }

    }

    @media (max-width: 768px) {

      .filters-grid,
      .grid-2,
      .booking-info {
        grid-template-columns: 1fr;
      }

      .filter-actions,
      .modal-actions {
        flex-direction: column;
      }

      .filter-actions button,
      .modal-actions button {
        width: 100%;
      }

      .modal-box {
        padding: 20px;
      }

    }
  `]
})
export class AllBookingsComponent implements OnInit {

  bookings: any[] = [];

  loading = false;

  currentPage = 0;

  totalPages = 0;

  pages: number[] = [];

  filters = {
    bookingId: '',
    customerId: '',
    status: ''
  };

  showSchedule = false;

  showStatusModal = false;

  selectedBooking: any = null;

  newStatus = 'PICKEDUP';

  couriers = [
    {
      name: 'Rahul Sharma',
      assetId: 'VH-101'
    },
    {
      name: 'Amit Verma',
      assetId: 'VH-102'
    },
    {
      name: 'Sanjay Patel',
      assetId: 'VH-103'
    }
  ];

  scheduleForm = {
    courierName: '',
    courierAssetId: '',
    scheduledPickupDate: '',
    scheduledDropoffDate: ''
  };

  constructor(
    public router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {

    this.loading = true;

    this.bookingService.getAllBookings(
      this.filters,
      this.currentPage,
      10
    ).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.success) {

          this.bookings = res.data.content || [];

          this.totalPages = res.data.totalPages || 0;

          this.pages = Array.from(
            { length: this.totalPages },
            (_, i) => i
          );
        }
      },

      error: () => {
        this.loading = false;
      }

    });
  }

  search() {
    this.currentPage = 0;
    this.load();
  }

  clearFilters() {

    this.filters = {
      bookingId: '',
      customerId: '',
      status: ''
    };

    this.currentPage = 0;

    this.load();
  }

  changePage(p: number) {

    if (p < 0 || p >= this.totalPages) {
      return;
    }

    this.currentPage = p;

    this.load();
  }

  openSchedule(b: any) {

    this.selectedBooking = b;

    this.showSchedule = true;

    this.scheduleForm = {
      courierName: '',
      courierAssetId: '',
      scheduledPickupDate: '',
      scheduledDropoffDate: ''
    };
  }

  selectCourier(name: string) {

    const courier = this.couriers.find(
      c => c.name === name
    );

    if (courier) {

      this.scheduleForm.courierName = courier.name;

      this.scheduleForm.courierAssetId =
        courier.assetId;
    }
  }

  // submitSchedule() {

  //   if (!this.scheduleForm.courierName) {
  //     this.toast.error('Please select courier');
  //     return;
  //   }

  //   if (!this.scheduleForm.scheduledPickupDate) {
  //     this.toast.error('Pickup date required');
  //     return;
  //   }

  //   if (!this.scheduleForm.scheduledDropoffDate) {
  //     this.toast.error('Delivery date required');
  //     return;
  //   }

  //   this.bookingService.schedulePickup(
  //     this.selectedBooking.bookingId,
  //     this.scheduleForm
  //   ).subscribe({

  //     next: (res: any) => {

  //       if (res.success) {

  //         this.toast.success('Pickup scheduled!');

  //         this.showSchedule = false;

  //         this.load();
  //       }
  //     },

  //     error: () => {
  //       this.toast.error('Schedule failed.');
  //     }

  //   });
  // }



  submitSchedule() {

  if (!this.scheduleForm.courierName) {
    this.toast.error('Please select courier');
    return;
  }

  if (!this.scheduleForm.scheduledPickupDate) {
    this.toast.error('Pickup date required');
    return;
  }

  if (!this.scheduleForm.scheduledDropoffDate) {
    this.toast.error('Delivery date required');
    return;
  }

  // =========================
  // DATE VALIDATIONS
  // =========================

  const now = new Date();

  const pickupDate = new Date(
    this.scheduleForm.scheduledPickupDate
  );

  const deliveryDate = new Date(
    this.scheduleForm.scheduledDropoffDate
  );

  // pickup must be future
  if (pickupDate <= now) {

    this.toast.error(
      'Pickup date & time must be in future'
    );

    return;
  }

  // delivery must be future
  if (deliveryDate <= now) {

    this.toast.error(
      'Delivery date & time must be in future'
    );

    return;
  }

  // delivery must be greater than pickup
  if (deliveryDate <= pickupDate) {

    this.toast.error(
      'Delivery date must be after pickup date'
    );

    return;
  }

  // optional:
  // minimum 1 hour difference

  const diffMs =
    deliveryDate.getTime() -
    pickupDate.getTime();

  const diffHours =
    diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {

    this.toast.error(
      'Delivery should be at least 1 hour after pickup'
    );

    return;
  }

  // =========================

  this.bookingService.schedulePickup(
    this.selectedBooking.bookingId,
    this.scheduleForm
  ).subscribe({

    next: (res: any) => {

      if (res.success) {

        this.toast.success(
          'Pickup scheduled!'
        );

        this.showSchedule = false;

        this.load();
      }
    },

    error: () => {

      this.toast.error(
        'Schedule failed.'
      );
    }

  });
}

  openStatus(b: any) {

    this.selectedBooking = b;

    this.showStatusModal = true;
  }

  submitStatus() {

    this.bookingService.updateStatus(
      this.selectedBooking.bookingId,
      {
        status: this.newStatus
      }
    ).subscribe({

      next: (res: any) => {

        if (res.success) {

          this.toast.success('Status updated!');

          this.showStatusModal = false;

          this.load();
        }
      },

      error: () => {
        this.toast.error('Update failed.');
      }

    });
  }
}