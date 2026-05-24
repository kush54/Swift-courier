import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-booking-history',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <h2>My Bookings</h2>
          <p>View and manage all your shipments</p>
        </div>

        <div *ngIf="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Loading bookings...</span>
        </div>

        <div *ngIf="!loading">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Receiver</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of bookings">
                  <td>
                    <span style="font-weight:600;
                      color:var(--accent-primary)">
                      {{b.bookingId}}
                    </span>
                  </td>
                  <td style="color:var(--text-secondary);font-size:13px">
                    {{b.bookingDate | slice:0:10}}
                  </td>
                  <td style="font-weight:500">{{b.receiverName}}</td>
                  <td style="color:var(--text-secondary);font-size:13px;
                    max-width:150px;overflow:hidden;
                    text-overflow:ellipsis;white-space:nowrap">
                    {{b.deliveredAddress}}
                  </td>
                  <td>
                    <span style="font-size:12px;
                      color:var(--text-secondary)">
                      {{b.deliveryType}}
                    </span>
                  </td>
                  <td style="font-weight:600;color:var(--accent-success)">
                    ₹{{b.amountPaid}}
                  </td>
                  <td>
                    <span class="badge badge-{{b.status}}">
                      {{b.status}}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-ghost btn-sm"
                        (click)="track(b.bookingId)">
                        <span class="material-icons"
                          style="font-size:14px">location_on</span>
                      </button>
                      <button class="btn btn-secondary btn-sm"
                        (click)="downloadInvoice(b.bookingId)"
                        *ngIf="b.status==='DELIVERED'||b.status==='BOOKED'">
                        <span class="material-icons"
                          style="font-size:14px">download</span>
                      </button>
                      <button class="btn btn-danger btn-sm"
                        (click)="cancel(b.bookingId)"
                        *ngIf="b.status==='NEW'||b.status==='BOOKED'">
                        <span class="material-icons"
                          style="font-size:14px">cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="bookings.length===0">
                  <td colspan="8" style="text-align:center;
                    padding:40px;color:var(--text-secondary)">
                    No bookings found.
                    <a (click)="router.navigate(['/customer/book'])"
                      style="color:var(--accent-primary);
                      cursor:pointer;margin-left:6px">
                      Create your first booking!
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="changePage(currentPage-1)"
              [disabled]="currentPage===0">
              <span class="material-icons"
                style="font-size:16px">chevron_left</span>
            </button>
            <button *ngFor="let p of pages"
              [class.active]="p===currentPage"
              (click)="changePage(p)">{{p+1}}</button>
            <button (click)="changePage(currentPage+1)"
              [disabled]="currentPage===totalPages-1">
              <span class="material-icons"
                style="font-size:16px">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  currentPage = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    public router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.bookingService.getHistory(this.currentPage, 10).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.bookings = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.pages = Array.from(
            { length: this.totalPages }, (_, i) => i);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  changePage(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.currentPage = p; this.load();
  }

  track(id: string) { this.router.navigate(['/track', id]); }

  cancel(bookingId: string) {
    if (!confirm('Cancel this booking?')) return;
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success('Booking cancelled!'); this.load();
        } else { this.toast.error(res.message); }
      },
      error: () => this.toast.error('Cancel failed.')
    });
  }

  downloadInvoice(bookingId: string) {
    this.bookingService.downloadInvoice(bookingId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${bookingId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Invoice downloaded!');
      },
      error: () => this.toast.error('Invoice download failed.')
    });
  }
}