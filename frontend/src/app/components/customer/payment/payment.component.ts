// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { BookingService } from '../../../services/booking.service';
// import { ToastService } from '../../../services/toast.service';

// @Component({
//   selector: 'app-payment',
//   template: `
//   <div class="page-wrapper" style="display:flex">
//     <app-sidebar></app-sidebar>
//     <div class="main-with-sidebar">
//       <div class="page-content">
//         <div class="page-header">
//           <h2>Secure Payment</h2>
//           <p>Complete your booking payment</p>
//         </div>

//         <div style="max-width:560px;margin:0 auto">

//           <div *ngIf="success" class="card"
//             style="text-align:center;padding:48px">
//             <div style="font-size:64px;margin-bottom:16px">✅</div>
//             <h2 style="color:var(--accent-success);margin-bottom:8px">
//               Payment Successful!
//             </h2>
//             <p style="color:var(--text-secondary);margin-bottom:8px">
//               Transaction ID:
//               <strong style="color:var(--text-primary)">
//                 {{result?.transactionId}}
//               </strong>
//             </p>
//             <p style="color:var(--text-secondary);margin-bottom:24px">
//               Invoice:
//               <strong style="color:var(--text-primary)">
//                 {{result?.invoiceNumber}}
//               </strong>
//             </p>
//             <div style="display:flex;gap:12px;justify-content:center">
//               <button class="btn btn-primary"
//                 (click)="router.navigate(['/customer/history'])">
//                 <span class="material-icons">history</span>
//                 View Bookings
//               </button>
//               <button class="btn btn-secondary"
//                 (click)="downloadInvoice()">
//                 <span class="material-icons">download</span>
//                 Download Invoice
//               </button>
//             </div>
//           </div>

//           <div class="card" *ngIf="!success">
//             <div style="display:flex;align-items:center;gap:12px;
//               margin-bottom:28px">
//               <div style="width:44px;height:44px;
//                 background:var(--gradient-accent);
//                 border-radius:var(--radius-md);
//                 display:flex;align-items:center;
//                 justify-content:center;font-size:20px">💳</div>
//               <div>
//                 <div style="font-weight:700">Booking ID</div>
//                 <div style="color:var(--accent-primary);
//                   font-family:var(--font-display);font-size:1.1rem">
//                   {{bookingId}}
//                 </div>
//               </div>
//             </div>

//             <div *ngIf="error" class="alert alert-error">
//               <span class="material-icons"
//                 style="font-size:18px">error</span>
//               {{error}}
//             </div>

//             <form (ngSubmit)="onPay()">
//               <div class="form-group">
//                 <label>Cardholder Name</label>
//                 <input class="form-control" type="text"
//                   [(ngModel)]="form.cardholderName"
//                   name="cardholderName"
//                   placeholder="Name on card" required>
//               </div>

//               <div class="form-group">
//                 <label>Card Number</label>
//                 <input class="form-control" type="text"
//                   [(ngModel)]="form.cardNumber"
//                   name="cardNumber"
//                   placeholder="1234 5678 9012 3456"
//                   maxlength="19"
//                   (input)="formatCard($event)"
//                   required>
//               </div>

//               <div class="grid grid-2">
//                 <div class="form-group">
//                   <label>Expiry Date</label>
//                   <input class="form-control" type="text"
//                     [(ngModel)]="form.expiryDate"
//                     name="expiryDate"
//                     placeholder="MM/YY" maxlength="5" required>
//                 </div>
//                 <div class="form-group">
//                   <label>CVV</label>
//                   <input class="form-control" type="password"
//                     [(ngModel)]="form.cvv" name="cvv"
//                     placeholder="•••" maxlength="3" required>
//                 </div>
//               </div>

//               <div style="background:var(--bg-surface);
//                 border:1px solid var(--border-active);
//                 border-radius:var(--radius-md);padding:16px 20px;
//                 display:flex;justify-content:space-between;
//                 align-items:center;margin-bottom:24px">
//                 <span style="color:var(--text-secondary)">
//                   Amount to Pay
//                 </span>
//                 <span style="font-family:var(--font-display);
//                   font-size:1.8rem;font-weight:800;
//                   color:var(--accent-primary)">
//                   ₹{{amount}}
//                 </span>
//               </div>

//               <button class="btn btn-primary" type="submit"
//                 [disabled]="loading"
//                 style="width:100%;justify-content:center;
//                 font-size:16px;padding:16px">
//                 <div *ngIf="loading" class="spinner"
//                   style="width:18px;height:18px;border-width:2px">
//                 </div>
//                 <span class="material-icons" *ngIf="!loading">
//                   lock
//                 </span>
//                 {{loading ? 'Processing...' : 'Pay ₹' + amount}}
//               </button>

//               <div style="display:flex;align-items:center;
//                 justify-content:center;gap:8px;margin-top:16px;
//                 font-size:12px;color:var(--text-muted)">
//                 <span class="material-icons"
//                   style="font-size:14px">security</span>
//                 256-bit SSL encrypted payment
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   `
// })
// export class PaymentComponent implements OnInit {
//   bookingId = '';
//   amount = 0;
//   loading = false;
//   error = '';
//   success = false;
//   result: any = null;

//   form = {
//     cardholderName: '', cardNumber: '',
//     expiryDate: '', cvv: ''
//   };

//   constructor(
//     private route: ActivatedRoute,
//     public router: Router,
//     private bookingService: BookingService,
//     private toast: ToastService
//   ) {}

//   ngOnInit() {
//     this.bookingId = this.route.snapshot.params['bookingId'];
//     this.bookingService.trackBooking(this.bookingId).subscribe({
//       next: (res: any) => {
//         if (res.success) {
//           this.amount = res.data.totalServiceCost || 0;
//         }
//       }
//     });
//   }

//   formatCard(e: any) {
//     let val = e.target.value.replace(/\D/g, '');
//     val = val.match(/.{1,4}/g)?.join(' ') || val;
//     this.form.cardNumber = val;
//   }

//   onPay() {
//     if (!this.form.cardholderName || !this.form.cardNumber
//       || !this.form.expiryDate || !this.form.cvv) {
//       this.error = 'Please fill all card details.'; return;
//     }
//     this.loading = true; this.error = '';
//     const cleanCard = this.form.cardNumber.replace(/\s/g, '');

//     this.bookingService.processPayment({
//       bookingId: this.bookingId,
//       cardholderName: this.form.cardholderName,
//       cardNumber: cleanCard,
//       expiryDate: this.form.expiryDate,
//       cvv: this.form.cvv,
//       amount: this.amount
//     }).subscribe({
//       next: (res: any) => {
//         this.loading = false;
//         if (res.success) {
//           this.result = res.data;
//           this.success = true;
//           this.toast.success('Payment successful!');
//         } else { this.error = res.message; }
//       },
//       error: (err: any) => {
//         this.loading = false;
//         this.error = err.error?.message || 'Payment failed.';
//       }
//     });
//   }

//   downloadInvoice() {
//     this.bookingService.downloadInvoice(this.bookingId).subscribe({
//       next: (blob: Blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `invoice-${this.bookingId}.pdf`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//       }
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-payment',
  template: `
  <div class="page-wrapper" style="display:flex">
    <app-sidebar></app-sidebar>
    <div class="main-with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <h2>Secure Payment</h2>
          <p>Complete your booking payment</p>
        </div>

        <div style="max-width:580px;margin:0 auto">

          <!-- SUCCESS STATE -->
          <div *ngIf="success" class="card success-card">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Payment Successful!</h2>
            <div class="success-info">
              <div class="info-row">
                <span class="info-label">Transaction ID</span>
                <span class="info-value">{{result?.transactionId}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Invoice</span>
                <span class="info-value">{{result?.invoiceNumber}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Amount Paid</span>
                <span class="info-value amount-paid">₹{{amount}}</span>
              </div>
            </div>
            <div class="success-actions">
              <button class="btn btn-primary"
                (click)="router.navigate(['/customer/history'])">
                <span class="material-icons">history</span>
                View Bookings
              </button>
              <button class="btn btn-secondary"
                (click)="downloadInvoice()">
                <span class="material-icons">download</span>
                Download Invoice
              </button>
            </div>
          </div>

          <!-- PAYMENT FORM -->
          <div *ngIf="!success">

            <!-- Booking Info Bar -->
            <div class="booking-bar">
              <div style="display:flex;align-items:center;gap:10px">
                <span class="material-icons"
                  style="color:var(--cyan)">confirmation_number</span>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:0.8px">
                    Booking ID
                  </div>
                  <div style="font-weight:700;color:var(--cyan);
                    font-family:var(--font-display)">
                    {{bookingId}}
                  </div>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:11px;color:var(--text-muted);
                  text-transform:uppercase;letter-spacing:0.8px">
                  Amount Due
                </div>
                <div style="font-family:var(--font-display);
                  font-size:1.6rem;font-weight:900;
                  color:var(--cyan)">
                  ₹{{amount}}
                </div>
              </div>
            </div>

            <!-- Card Preview -->
            <div class="card-preview">
              <div style="display:flex;justify-content:space-between;
                align-items:flex-start;margin-bottom:20px">
                <div class="card-chip"></div>
                <div style="font-size:22px;opacity:0.7;
                  letter-spacing:2px;font-weight:900">
                  VISA
                </div>
              </div>
              <div class="card-number-display">
                {{form.cardNumber || '•••• •••• •••• ••••'}}
              </div>
              <div style="display:flex;
                justify-content:space-between;
                align-items:flex-end;margin-top:16px">
                <div>
                  <div class="card-label">Cardholder</div>
                  <div class="card-value">
                    {{form.cardholderName || 'YOUR NAME'}}
                  </div>
                </div>
                <div style="text-align:right">
                  <div class="card-label">Expires</div>
                  <div class="card-value">
                    {{form.expiryDate || 'MM/YY'}}
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Card -->
            <div class="card" style="padding:28px">

              <div *ngIf="error" class="alert alert-error"
                style="margin-bottom:20px">
                <span class="material-icons"
                  style="font-size:16px;flex-shrink:0">
                  error_outline
                </span>
                {{error}}
              </div>

              <form (ngSubmit)="onPay()" autocomplete="off">

                <div class="form-group">
                  <label>Cardholder Name</label>
                  <div class="input-wrap">
                    <span class="material-icons ii">person</span>
                    <input class="form-control ipad"
                      type="text"
                      [(ngModel)]="form.cardholderName"
                      name="cardholderName"
                      placeholder="Name as on card"
                      [class.error]="submitted && !form.cardholderName">
                  </div>
                  <div class="field-error"
                    *ngIf="submitted && !form.cardholderName">
                    Cardholder name is required
                  </div>
                </div>

                <div class="form-group">
                  <label>Card Number</label>
                  <div class="input-wrap">
                    <span class="material-icons ii">credit_card</span>
                    <input class="form-control ipad"
                      type="text"
                      [(ngModel)]="form.cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      (input)="formatCard($event)"
                      [class.error]="submitted && !isCardValid()">
                  </div>
                  <div class="field-error"
                    *ngIf="submitted && !isCardValid()">
                    Enter valid 16-digit card number
                  </div>
                </div>

                <div style="display:grid;
                  grid-template-columns:1fr 1fr;gap:16px">
                  <div class="form-group">
                    <label>Expiry Date</label>
                    <div class="input-wrap">
                      <span class="material-icons ii">
                        calendar_today
                      </span>
                      <input class="form-control ipad"
                        type="text"
                        [(ngModel)]="form.expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxlength="5"
                        (input)="formatExpiry($event)"
                        [class.error]="submitted
                          && !isExpiryValid()">
                    </div>
                  <div class="field-error" *ngIf="submitted && !isExpiryValid()">
  Enter a valid future expiry date
</div>
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <div class="input-wrap">
                      <span class="material-icons ii">lock</span>
                      <input class="form-control ipad"
                        type="password"
                        [(ngModel)]="form.cvv"
                        name="cvv"
                        placeholder="•••"
                        maxlength="3"
                        [class.error]="submitted
                          && form.cvv.length !== 3">
                    </div>
                    <div class="field-error"
                      *ngIf="submitted && form.cvv.length !== 3">
                      3-digit CVV required
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary pay-btn"
                  type="submit" [disabled]="loading">
                  <div *ngIf="loading" class="spinner"
                    style="width:18px;height:18px;
                    border-width:2px"></div>
                  <span class="material-icons"
                    *ngIf="!loading">lock</span>
                  {{loading ? 'Processing...' : 'Pay ₹' + amount}}
                </button>

                <div class="security-badge">
                  <span class="material-icons"
                    style="font-size:15px">verified_user</span>
                  256-bit SSL encrypted · Secure payment
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .booking-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 16px 20px;
      margin-bottom: 16px;
    }

    /* Card Preview */
    .card-preview {
      background: linear-gradient(
        135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 16px;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);

      &::before {
        content: '';
        position: absolute;
        top: -60px; right: -60px;
        width: 220px; height: 220px;
        background: rgba(255,255,255,0.04);
        border-radius: 50%;
      }
      &::after {
        content: '';
        position: absolute;
        bottom: -40px; left: -40px;
        width: 160px; height: 160px;
        background: rgba(0,245,255,0.06);
        border-radius: 50%;
      }
    }

    .card-chip {
      width: 42px; height: 30px;
      background: linear-gradient(
        135deg, #ffd700 0%, #ffa500 100%);
      border-radius: 6px;
      position: relative;
      z-index: 1;

      &::after {
        content: '';
        position: absolute;
        top: 50%; left: 0; right: 0;
        height: 1px;
        background: rgba(0,0,0,0.2);
        transform: translateY(-50%);
      }
    }

    .card-number-display {
      font-size: 1.25rem;
      letter-spacing: 3px;
      font-family: 'Courier New', monospace;
      margin-top: 16px;
      position: relative; z-index: 1;
    }

    .card-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.6;
      margin-bottom: 3px;
    }

    .card-value {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative; z-index: 1;
    }

    /* Input */
    .input-wrap {
      position: relative;
      .ii {
        position: absolute;
        left: 12px; top: 50%;
        transform: translateY(-50%);
        font-size: 17px;
        color: var(--text-muted);
        pointer-events: none;
      }
      .ipad { padding-left: 40px; }
    }

    .field-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }

    /* Pay Button */
    .pay-btn {
      width: 100%;
      justify-content: center;
      font-size: 16px;
      padding: 16px;
      margin-top: 8px;
      background: linear-gradient(
        135deg, #00b4d8, #0077b6);
      border: none;
      letter-spacing: 0.5px;

      &:hover:not(:disabled) {
        background: linear-gradient(
          135deg, #00c4e8, #0088c6);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0,180,216,0.35);
      }
    }

    /* Security Badge */
    .security-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 14px;
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Success */
    .success-card {
      text-align: center;
      padding: 48px 40px;
    }

    .success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .success-title {
      color: #22c55e;
      margin-bottom: 24px;
    }

    .success-info {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 20px;
      margin-bottom: 28px;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);

      &:last-child { border-bottom: none; }
    }

    .info-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .info-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .amount-paid {
      color: #22c55e;
      font-size: 1.2rem;
    }

    .success-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  `]
})
export class PaymentComponent implements OnInit {
  bookingId = '';
  amount = 0;
  loading = false;
  error = '';
  success = false;
  result: any = null;
  submitted = false;

  form = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.bookingId = this.route.snapshot.params['bookingId'];
    this.bookingService.trackBooking(this.bookingId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.amount = res.data.totalServiceCost || 0;
        }
      }
    });
  }

  formatCard(e: any) {
    let val = e.target.value.replace(/\D/g, '');
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    this.form.cardNumber = val;
  }

  formatExpiry(e: any) {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    this.form.expiryDate = val;
  }

  isCardValid(): boolean {
    return this.form.cardNumber.replace(/\s/g, '').length === 16;
  }

  // isExpiryValid(): boolean {
  //   return /^\d{2}\/\d{2}$/.test(this.form.expiryDate);
  // }
  isExpiryValid(): boolean {
    if (!/^\d{2}\/\d{2}$/.test(this.form.expiryDate)) return false;

    const [mm, yy] = this.form.expiryDate.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // last 2 digits
    const currentMonth = now.getMonth() + 1;

    // ✅ Future check
    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;

    return true;
  }

  onPay() {
    this.submitted = true;
    this.error = '';

    if (!this.form.cardholderName || !this.isCardValid()
      || !this.isExpiryValid() || this.form.cvv.length !== 3) {
      this.error = 'Please fix the errors above.';
      return;
    }

    this.loading = true;
    const cleanCard = this.form.cardNumber.replace(/\s/g, '');

    this.bookingService.processPayment({
      bookingId: this.bookingId,
      cardholderName: this.form.cardholderName,
      cardNumber: cleanCard,
      expiryDate: this.form.expiryDate,
      cvv: this.form.cvv,
      amount: this.amount
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.result = res.data;
          this.success = true;
          this.toast.success('Payment successful!');
        } else {
          this.error = res.message;
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Payment failed.';
      }
    });
  }

  downloadInvoice() {
    this.bookingService.downloadInvoice(this.bookingId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${this.bookingId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}