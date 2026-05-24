import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  template: `
  <div class="reg-page">
    <div class="reg-left">
      <div class="brand">
        <div class="brand-mark">🚀</div>
        <span class="brand-name">Swift</span>
      </div>
      <h2 style="font-size:2rem;font-weight:900;
        letter-spacing:-0.04em;margin-bottom:12px;
        line-height:1.1">
        Join thousands<br>
        <span class="grad">shipping smarter</span>
      </h2>
      <p style="color:var(--text-secondary);font-size:13px;
        line-height:1.7;max-width:300px;margin-bottom:32px">
        Create your free account and get a unique
        Customer ID instantly.
      </p>
      <div class="perks">
        <div class="perk" *ngFor="let p of perks">
          <div class="perk-ico"
            [style.background]="p.bg">
            {{p.icon}}
          </div>
          <div>
            <div style="font-weight:700;font-size:13px">
              {{p.title}}
            </div>
            <div style="font-size:12px;
              color:var(--text-secondary);margin-top:2px">
              {{p.desc}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reg-right">
      <div class="reg-form-box">
        <h3 style="font-size:1.4rem;margin-bottom:4px">
          Create Account
        </h3>
        <p style="color:var(--text-secondary);
          font-size:13px;margin-bottom:28px">
          All fields marked * are required
        </p>

        <div *ngIf="apiError" class="alert alert-error">
          <span class="material-icons"
            style="font-size:16px;flex-shrink:0">
            error
          </span>
          {{apiError}}
        </div>

        <div *ngIf="successMsg" class="alert alert-success">
          <span class="material-icons"
            style="font-size:16px;flex-shrink:0">
            check_circle
          </span>
          <div>
            <div style="font-weight:700">
              Registration Successful!
            </div>
            <div style="margin-top:2px">{{successMsg}}</div>
          </div>
        </div>

        <form (ngSubmit)="onRegister()" *ngIf="!successMsg">
          <div class="g2" style="display:grid;
            grid-template-columns:1fr 1fr;gap:14px">
            <div class="form-group" style="margin:0">
              <label>Full Name *</label>
              <input class="form-control"
                type="text"
                [(ngModel)]="f.customerName"
                name="customerName"
                placeholder="Your full name"
                [class.error]="errs.customerName"
                (blur)="validateName()">
              <div class="field-error"
                *ngIf="errs.customerName">
                {{errs.customerName}}
              </div>
            </div>
            <div class="form-group" style="margin:0">
              <label>Mobile * (10 digits)</label>
              <input class="form-control"
                type="tel"
                [(ngModel)]="f.mobileNumber"
                name="mobileNumber"
                placeholder="9XXXXXXXXX"
                maxlength="10"
                [class.error]="errs.mobileNumber"
                [class.success]="mobileOk"
                (blur)="validateMobile()">
              <div class="field-error"
                *ngIf="errs.mobileNumber">
                {{errs.mobileNumber}}
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top:14px">
            <label>Email Address *</label>
            <input class="form-control"
              type="email"
              [(ngModel)]="f.email"
              name="email"
              placeholder="your@email.com"
              [class.error]="errs.email"
              [class.success]="emailOk"
              (blur)="validateEmail()">
            <div class="field-error" *ngIf="errs.email">
              {{errs.email}}
            </div>
          </div>

          <div class="form-group">
            <label>Address</label>
            <input class="form-control"
              type="text"
              [(ngModel)]="f.address"
              name="address"
              placeholder="Your city / full address">
          </div>

          <div class="form-group">
            <label>Password *</label>
            <div style="position:relative">
              <input class="form-control"
                [type]="showPass?'text':'password'"
                [(ngModel)]="f.password"
                name="password"
                placeholder="Create strong password"
                [class.error]="errs.password"
                (input)="checkPassword()"
                style="padding-right:44px">
              <button type="button"
                (click)="showPass=!showPass"
                style="position:absolute;right:12px;
                top:50%;transform:translateY(-50%);
                background:none;border:none;
                cursor:pointer;
                color:var(--text-muted)">
                <span class="material-icons"
                  style="font-size:17px">
                  {{showPass?'visibility_off':'visibility'}}
                </span>
              </button>
            </div>

            <!-- Password strength -->
            <div class="pwd-strength" *ngIf="f.password">
              <div class="strength-bars">
                <div *ngFor="let b of [0,1,2,3]"
                  class="sbar"
                  [style.background]="b < pwdScore
                    ? pwdColor : 'var(--border)'">
                </div>
              </div>
              <span [style.color]="pwdColor"
                style="font-size:11px;font-weight:700">
                {{pwdLabel}}
              </span>
            </div>

            <div class="field-error" *ngIf="errs.password">
              {{errs.password}}
            </div>

            <div class="field-hint">
              Min 8 chars · uppercase · lowercase ·
               number · special char (&#64;#$%^&+=!)
            </div>
          </div>

          <button class="btn btn-primary btn-lg"
            type="submit"
            [disabled]="loading"
            style="width:100%;justify-content:center">
            <div *ngIf="loading" class="spinner"
              style="width:16px;height:16px;
              border-width:2px"></div>
            <span class="material-icons"
              *ngIf="!loading">person_add</span>
            {{loading?'Creating...':'Create Account'}}
          </button>
        </form>

        <p style="text-align:center;margin-top:20px;
          font-size:13px;color:var(--text-secondary)">
          Already have an account?
          <a (click)="router.navigate(['/login'])"
            style="color:var(--cyan);cursor:pointer;
            font-weight:700;margin-left:4px">
            Sign in →
          </a>
        </p>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .reg-page {
      min-height: 100vh;
      display: flex;
      background: var(--bg-primary);
    }

    .reg-left {
      width: 420px;
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -80px; right: -80px;
        width: 300px; height: 300px;
        background: radial-gradient(
          circle, rgba(139,92,246,0.08), transparent 70%);
        pointer-events: none;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 48px;
    }

    .brand-mark {
      width: 36px; height: 36px;
      background: var(--grad-primary);
      border-radius: var(--r-md);
      display: flex; align-items: center;
      justify-content: center; font-size: 17px;
    }

    .brand-name {
      font-family: var(--font-display);
      font-size: 1.2rem; font-weight: 900;
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .grad {
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .perks {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .perk {
      display: flex;
      align-items: flex-start;
      gap: 14px;

      .perk-ico {
        width: 38px; height: 38px;
        border-radius: var(--r-md);
        display: flex; align-items: center;
        justify-content: center;
        font-size: 17px;
        flex-shrink: 0;
      }
    }

    .reg-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      overflow-y: auto;
    }

    .reg-form-box {
      width: 100%;
      max-width: 460px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--r-2xl);
      padding: 36px;
      box-shadow: var(--shadow-md);
    }

    .pwd-strength {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }

    .strength-bars {
      display: flex;
      gap: 4px;
    }

    .sbar {
      width: 36px; height: 3px;
      border-radius: 2px;
      transition: background 0.3s;
    }

    @media(max-width:900px) {
      .reg-left { display: none; }
    }
  `]
})
export class RegisterComponent {
  f = {
    customerName: '', email: '',
    mobileNumber: '', address: '',
    password: '', preferences: ''
  };

  errs: any = {};
  loading = false;
  apiError = '';
  successMsg = '';
  showPass = false;
  emailOk = false;
  mobileOk = false;
  pwdScore = 0;
  pwdLabel = '';
  pwdColor = '';

  perks = [
    { icon:'🆔', title:'Auto Customer ID',
      desc:'Unique CUST-XXXX generated instantly',
      bg:'rgba(0,245,255,0.1)' },
    { icon:'📍', title:'GPS Tracking',
      desc:'Track every parcel in real-time',
      bg:'rgba(0,255,136,0.1)' },
    { icon:'💳', title:'Secure Payments',
      desc:'Encrypted card processing',
      bg:'rgba(139,92,246,0.1)' },
    { icon:'📄', title:'PDF Invoices',
      desc:'Download anytime from dashboard',
      bg:'rgba(255,107,53,0.1)' }
  ];

  constructor(
    public router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  validateName() {
    if (!this.f.customerName || this.f.customerName.length < 2) {
      this.errs.customerName = 'Min 2 characters required';
    } else { delete this.errs.customerName; }
  }

  validateEmail() {
    const re = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!this.f.email) {
      this.errs.email = 'Email is required';
      this.emailOk = false;
    } else if (!re.test(this.f.email)) {
      this.errs.email = 'Invalid email format';
      this.emailOk = false;
    } else {
      delete this.errs.email;
      this.emailOk = true;
    }
  }

  validateMobile() {
    const re = /^[6-9]\d{9}$/;
    if (!this.f.mobileNumber) {
      this.errs.mobileNumber = 'Mobile is required';
      this.mobileOk = false;
    } else if (!re.test(this.f.mobileNumber)) {
      this.errs.mobileNumber =
        'Must be 10 digits starting with 6-9';
      this.mobileOk = false;
    } else {
      delete this.errs.mobileNumber;
      this.mobileOk = true;
    }
  }

  checkPassword() {
    const p = this.f.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[@#$%^&+=!]/.test(p)) score++;
    this.pwdScore = score;

    const labels = ['Weak','Fair','Good','Strong'];
    const colors = [
      'var(--pink)','var(--orange)',
      'var(--yellow)','var(--green)'
    ];
    this.pwdLabel = labels[score-1] || 'Too short';
    this.pwdColor = score > 0
      ? colors[score-1] : 'var(--text-muted)';

    const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    if (!re.test(p)) {
      this.errs.password =
        'Need uppercase, lowercase, number & special char';
    } else {
      delete this.errs.password;
    }
  }

  validateAll(): boolean {
    this.validateName();
    this.validateEmail();
    this.validateMobile();
    this.checkPassword();
    return Object.keys(this.errs).length === 0;
  }

  onRegister() {
    this.apiError = '';
    if (!this.validateAll()) return;
    this.loading = true;

    this.auth.register(this.f).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.successMsg = res.data.message;
          this.toast.success(
            'Account created! ID: ' + res.data.customerId);
          setTimeout(() =>
            this.router.navigate(['/login']), 3000);
        } else { this.apiError = res.message; }
      },
      error: (err: any) => {
        this.loading = false;
        this.apiError =
          err.error?.message || 'Registration failed.';
      }
    });
  }
}