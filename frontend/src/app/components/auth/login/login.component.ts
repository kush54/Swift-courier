import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="login-page">
    <!-- Left Panel -->
    <div class="left-panel">
      <div class="left-inner">
        <div class="brand">
        
          <span class="brand-name">Swift</span>
        </div>

        <div class="hero-text">
          <div class="eyebrow">Courier Platform</div>
          <h1>Move parcels<br>at the speed<br>
            <span class="grad">of trust.</span>
          </h1>
          <p>Real-time GPS tracking, instant booking,
            and seamless delivery management — all
            in one place.</p>
        </div>

        <div class="feature-list">
          <div class="feat" *ngFor="let f of features">
            <div class="feat-dot"
              [style.background]="f.color"></div>
            <span>{{f.text}}</span>
          </div>
        </div>


        <div class="demo-credentials">
  <div class="demo-label">Quick Access</div>

  <div class="demo-cards">

    <div class="demo-card"
      (click)="fill('demo&#64;swiftcourier.com','Demo&#64;1234')">

      <div class="dc-icon">👤</div>

      <div>
        <div class="dc-role">Customer</div>

        <div class="dc-cred">
          demo&#64;swiftcourier.com
        </div>
      </div>
    </div>

    <div class="demo-card"
      (click)="fill('officer&#64;swiftcourier.com','Officer&#64;123')">

      <div class="dc-icon">🛡️</div>

      <div>
        <div class="dc-role">Officer</div>

        <div class="dc-cred">
          officer&#64;swiftcourier.com
        </div>
      </div>
    </div>

  </div>
</div>
  </div>    
  </div>    

    <!-- Right Panel -->
    <div class="right-panel">
      <div class="form-box">
        <div style="margin-bottom:32px">
          <h2 style="font-size:1.6rem;margin-bottom:6px">
            Welcome back
          </h2>
          <p style="color:var(--text-secondary);font-size:13px">
            Sign in with your email or Customer ID
          </p>
        </div>

        <div *ngIf="error" class="alert alert-error">
          <span class="material-icons"
            style="font-size:16px;flex-shrink:0">
            error_outline
          </span>
          {{error}}
        </div>

        <form (ngSubmit)="onLogin()" autocomplete="off">
          <div class="form-group">
            <label>Email or Customer ID</label>
            <div class="input-icon-wrap">
              <span class="material-icons ii">
                alternate_email
              </span>
              <input class="form-control ipad"
                type="text"
                [(ngModel)]="form.emailOrId"
                name="emailOrId"
                placeholder="email@example.com or CUST-1001"
                [class.error]="submitted && !form.emailOrId"
                autocomplete="off">
            </div>
            <div class="field-error"
              *ngIf="submitted && !form.emailOrId">
              This field is required
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-icon-wrap">
              <span class="material-icons ii">lock</span>
              <input class="form-control ipad"
                [type]="showPass?'text':'password'"
                [(ngModel)]="form.password"
                name="password"
                placeholder="Your password"
                [class.error]="submitted && !form.password"
                autocomplete="off">
              <button type="button"
                class="eye-btn"
                (click)="showPass=!showPass">
                <span class="material-icons"
                  style="font-size:17px">
                  {{showPass?'visibility_off':'visibility'}}
                </span>
              </button>
            </div>
            <div class="field-error"
              *ngIf="submitted && !form.password">
              This field is required
            </div>
          </div>

          <button class="btn btn-primary btn-lg"
            type="submit"
            [disabled]="loading"
            style="width:100%;
            justify-content:center;margin-top:8px">
            <div *ngIf="loading" class="spinner"
              style="width:16px;height:16px;
              border-width:2px"></div>
            <span class="material-icons"
              *ngIf="!loading">login</span>
            {{loading?'Signing in...':'Sign In'}}
          </button>
        </form>

        <div class="divider" style="margin:24px 0">
          <span style="background:var(--bg-card);
            padding:0 12px;color:var(--text-muted);
            font-size:12px;position:relative;z-index:1">
            OR
          </span>
        </div>

        <button class="btn btn-secondary"
          style="width:100%;justify-content:center"
          (click)="router.navigate(['/track'])">
          <span class="material-icons">
            location_searching
          </span>
          Track without login
        </button>

        <p style="text-align:center;margin-top:24px;
          font-size:13px;color:var(--text-secondary)">
          New here?
          <a (click)="router.navigate(['/register'])"
            style="color:var(--cyan);cursor:pointer;
            font-weight:700;margin-left:4px">
            Create account →
          </a>
        </p>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      background: var(--bg-primary);
    }

    .left-panel {
      width: 480px;
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -100px; left: -100px;
        width: 400px; height: 400px;
        background: radial-gradient(
          circle, rgba(0,245,255,0.06) 0%, transparent 70%);
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -100px; right: -100px;
        width: 350px; height: 350px;
        background: radial-gradient(
          circle, rgba(139,92,246,0.07) 0%, transparent 70%);
        pointer-events: none;
      }
    }

    .left-inner {
      position: relative;
      z-index: 1;
      width: 100%;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 48px;
    }

    .brand-mark {
      width: 38px; height: 38px;
      background: var(--grad-primary);
      border-radius: var(--r-md);
      display: flex; align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .brand-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #00f5ff 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(0, 245, 255, 0.4));
}

    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--cyan);
      margin-bottom: 12px;
    }

    .hero-text {
      margin-bottom: 36px;

      h1 {
        font-size: 2.4rem;
        font-weight: 900;
        line-height: 1.08;
        margin-bottom: 14px;
        letter-spacing: -0.04em;
      }

      .grad {
        background: var(--grad-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 1.7;
        max-width: 320px;
      }
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 36px;
    }

    .feat {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--text-secondary);

      .feat-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }

    .demo-credentials { }
    .demo-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .demo-cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .demo-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        border-color: var(--border-active);
        background: rgba(0,245,255,0.04);
      }

      .dc-icon { font-size: 20px; }
      .dc-role {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .dc-cred {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 1px;
      }
    }
.brand-name {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ff8c00 0%, #ff4500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.5));
}
    /* Right Panel */
    .right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .form-box {
      width: 100%;
      max-width: 400px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--r-2xl);
      padding: 40px;
      box-shadow: var(--shadow-md);
    }

    .input-icon-wrap {
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
      .eye-btn {
        position: absolute;
        right: 12px; top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        padding: 2px;
        &:hover { color: var(--text-primary); }
      }
    }

    .divider {
      height: 1px;
      background: var(--border);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media(max-width:900px) {
      .left-panel { display: none; }
    }
  `]
})
export class LoginComponent {
  form = { emailOrId: '', password: '' };
  loading = false;
  error = '';
  showPass = false;
  submitted = false;

  features = [
    { text: 'Real-time GPS parcel tracking',
      color: 'var(--cyan)' },
    { text: 'Instant PDF invoice generation',
      color: 'var(--green)' },
    { text: 'Multi-route shortest path navigation',
      color: 'var(--purple)' },
    { text: 'Live courier location updates',
      color: 'var(--orange)' }
  ];

  constructor(
    public router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  fill(email: string, pass: string) {
    this.form = { emailOrId: email, password: pass };
  }

  onLogin() {
    this.submitted = true;
    if (!this.form.emailOrId || !this.form.password) return;
    this.loading = true; this.error = '';

    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.toast.success(
            'Welcome, ' + res.data.customerName + '!');
          this.router.navigate([
            res.data.role === 'OFFICER'
              ? '/officer/dashboard'
              : '/customer/dashboard'
          ]);
        } else { this.error = res.message; }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed.';
      }
    });
  }
}