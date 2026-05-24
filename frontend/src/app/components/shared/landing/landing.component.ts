// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-landing',
//   template: `
//   <div class="landing">
//     <header class="hero">
//       <nav class="navbar">
//         <div class="nav-logo">
//           <span style="font-size:28px">🚀</span>
//           <span class="nav-brand">Swift Courier</span>
//         </div>
//         <div class="nav-actions">
//           <button class="btn btn-ghost btn-sm"
//             (click)="router.navigate(['/track'])">
//             Track Parcel
//           </button>
//           <button class="btn btn-secondary btn-sm"
//             (click)="router.navigate(['/login'])">
//             Login
//           </button>
//           <button class="btn btn-primary btn-sm"
//             (click)="router.navigate(['/register'])">
//             Get Started
//           </button>
//         </div>
//       </nav>

//       <div class="hero-content">
//         <div class="hero-badge">⚡ India's Fastest Delivery Network</div>
//         <h1 class="hero-title">
//           Deliver Anywhere<br>
//           <span class="gradient-text">Track Everywhere</span>
//         </h1>
//         <p class="hero-subtitle">
//           Real-time GPS tracking, lightning-fast booking,
//           and door-to-door delivery. Trusted by 50,000+
//           customers across India.
//         </p>
//         <div class="hero-cta">
//           <button class="btn btn-primary btn-lg"
//             (click)="router.navigate(['/register'])">
//             <span class="material-icons">rocket_launch</span>
//             Start Shipping
//           </button>
//           <button class="btn btn-ghost btn-lg"
//             (click)="router.navigate(['/track'])">
//             <span class="material-icons">location_on</span>
//             Track a Parcel
//           </button>
//         </div>
//         <div class="hero-stats">
//           <div class="hero-stat">
//             <span class="hero-stat-num">50K+</span>
//             <span>Customers</span>
//           </div>
//           <div class="hero-stat-div"></div>
//           <div class="hero-stat">
//             <span class="hero-stat-num">2M+</span>
//             <span>Deliveries</span>
//           </div>
//           <div class="hero-stat-div"></div>
//           <div class="hero-stat">
//             <span class="hero-stat-num">99.2%</span>
//             <span>On-Time Rate</span>
//           </div>
//         </div>
//       </div>

//       <div class="floating-cards">
//         <div class="float-card">
//           <span style="font-size:24px">📦</span>
//           <div>
//             <div style="font-weight:700;font-size:13px">
//               BK-20240001
//             </div>
//             <div style="font-size:11px;color:var(--accent-success)">
//               ● Delivered
//             </div>
//           </div>
//         </div>
//         <div class="float-card" style="animation-delay:0.5s">
//           <span style="font-size:24px">🛵</span>
//           <div>
//             <div style="font-weight:700;font-size:13px">In Transit</div>
//             <div style="font-size:11px;color:var(--accent-warning)">
//               ● 2.4 km away
//             </div>
//           </div>
//         </div>
//         <div class="float-card" style="animation-delay:1s">
//           <span style="font-size:24px">✅</span>
//           <div>
//             <div style="font-weight:700;font-size:13px">Payment Done</div>
//             <div style="font-size:11px;color:var(--text-secondary)">
//               INV-20240042
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>

//     <section class="features">
//       <div class="section-tag">FEATURES</div>
//       <h2 class="section-title">Everything You Need</h2>
//       <div class="features-grid">
//         <div class="feature-card" *ngFor="let f of features">
//           <div class="feature-icon">{{f.icon}}</div>
//           <h3>{{f.title}}</h3>
//           <p>{{f.desc}}</p>
//         </div>
//       </div>
//     </section>

//     <section class="steps-section">
//       <div class="section-tag">HOW IT WORKS</div>
//       <h2 class="section-title">Ship in 3 Simple Steps</h2>
//       <div class="steps-grid">
//         <div class="step-card" *ngFor="let s of steps; let i=index">
//           <div class="step-num">0{{i+1}}</div>
//           <div class="step-icon">{{s.icon}}</div>
//           <h3>{{s.title}}</h3>
//           <p>{{s.desc}}</p>
//         </div>
//       </div>
//     </section>

//     <section class="cta-banner">
//       <h2>Ready to Ship?</h2>
//       <p>Join 50,000+ customers who trust Swift Courier.</p>
//       <button class="btn btn-primary btn-lg"
//         (click)="router.navigate(['/register'])">
//         Create Free Account
//       </button>
//     </section>

//     <footer class="footer">
//       <div class="footer-logo">🚀 Swift Courier</div>
//       <p style="color:var(--text-muted);font-size:13px;margin-top:8px">
//         © 2024 Swift Courier. Fast. Reliable. Trackable.
//       </p>
//     </footer>
//   </div>
//   `,
//   styles: [`
//     .landing { background:var(--bg-primary); min-height:100vh; }
//     .navbar { display:flex; align-items:center; justify-content:space-between;
//       padding:20px 60px; position:relative; z-index:10; }
//     .nav-logo { display:flex; align-items:center; gap:10px; }
//     .nav-brand { font-family:var(--font-display); font-size:1.4rem; font-weight:800;
//       background:var(--gradient-accent); -webkit-background-clip:text;
//       -webkit-text-fill-color:transparent; background-clip:text; }
//     .nav-actions { display:flex; gap:12px; align-items:center; }
//     .hero { min-height:100vh; background:
//       radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.06) 0%, transparent 60%),
//       radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 60%),
//       var(--bg-primary);
//       display:flex; flex-direction:column; padding-bottom:80px;
//       position:relative; overflow:hidden; }
//     .hero::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0;
//       background-image:radial-gradient(circle at 1px 1px,
//         rgba(255,255,255,0.04) 1px, transparent 0);
//       background-size:40px 40px; pointer-events:none; }
//     .hero-content { max-width:700px; padding:80px 60px; position:relative; z-index:1; }
//     .hero-badge { display:inline-flex; align-items:center; gap:8px;
//       background:rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.25);
//       color:var(--accent-primary); padding:8px 18px; border-radius:20px;
//       font-size:13px; font-weight:600; margin-bottom:28px; }
//     .hero-title { font-size:4rem; font-weight:800; line-height:1.1; margin-bottom:20px; }
//     .gradient-text { background:var(--gradient-accent); -webkit-background-clip:text;
//       -webkit-text-fill-color:transparent; background-clip:text; }
//     .hero-subtitle { font-size:1.1rem; color:var(--text-secondary);
//       margin-bottom:40px; max-width:520px; line-height:1.7; }
//     .hero-cta { display:flex; gap:16px; margin-bottom:48px; flex-wrap:wrap; }
//     .hero-stats { display:flex; align-items:center; gap:28px; }
//     .hero-stat { display:flex; flex-direction:column; gap:2px;
//       .hero-stat-num { font-family:var(--font-display); font-size:1.6rem;
//         font-weight:800; background:var(--gradient-accent);
//         -webkit-background-clip:text; -webkit-text-fill-color:transparent;
//         background-clip:text; }
//       span:last-child { font-size:12px; color:var(--text-secondary); } }
//     .hero-stat-div { width:1px; height:40px; background:var(--border-subtle); }
//     .floating-cards { position:absolute; right:60px; top:50%;
//       transform:translateY(-40%); display:flex; flex-direction:column; gap:16px; }
//     .float-card { background:var(--bg-card); border:1px solid var(--border-subtle);
//       border-radius:var(--radius-md); padding:16px 20px;
//       display:flex; align-items:center; gap:14px; min-width:200px;
//       box-shadow:var(--shadow-card); animation:floatAnim 3s ease-in-out infinite; }
//     @keyframes floatAnim {
//       0%,100% { transform:translateY(0); }
//       50% { transform:translateY(-8px); } }
//     section { padding:80px 60px; }
//     .section-tag { font-size:11px; font-weight:700; text-transform:uppercase;
//       letter-spacing:2px; color:var(--accent-primary); margin-bottom:12px; }
//     .section-title { font-size:2.5rem; font-weight:800; margin-bottom:48px; }
//     .features { background:var(--bg-secondary); }
//     .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
//     .feature-card { background:var(--gradient-card); border:1px solid var(--border-subtle);
//       border-radius:var(--radius-lg); padding:32px; transition:all 0.3s;
//       &:hover { transform:translateY(-4px); border-color:var(--border-active);
//         box-shadow:var(--shadow-glow); }
//       .feature-icon { font-size:36px; margin-bottom:16px; }
//       h3 { font-size:1.1rem; margin-bottom:10px; }
//       p { color:var(--text-secondary); font-size:14px; line-height:1.7; } }
//     .steps-section { background:var(--bg-primary); }
//     .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
//     .step-card { text-align:center;
//       .step-num { font-family:var(--font-display); font-size:4rem;
//         font-weight:800; color:var(--border-subtle); line-height:1; margin-bottom:8px; }
//       .step-icon { font-size:40px; margin-bottom:16px; }
//       h3 { margin-bottom:10px; }
//       p { color:var(--text-secondary); font-size:14px; line-height:1.7; } }
//     .cta-banner { background:linear-gradient(135deg,
//       rgba(0,212,255,0.1), rgba(124,58,237,0.1));
//       border-top:1px solid var(--border-subtle);
//       text-align:center; padding:80px 60px;
//       h2 { font-size:2.5rem; margin-bottom:16px; }
//       p { color:var(--text-secondary); margin-bottom:32px; font-size:1.1rem; } }
//     .footer { text-align:center; padding:40px 60px;
//       border-top:1px solid var(--border-subtle); }
//     .footer-logo { font-family:var(--font-display); font-size:1.5rem; font-weight:800;
//       background:var(--gradient-accent); -webkit-background-clip:text;
//       -webkit-text-fill-color:transparent; background-clip:text; }
//     @media(max-width:1024px) {
//       .floating-cards { display:none; }
//       .features-grid,.steps-grid { grid-template-columns:1fr; } }
//     @media(max-width:768px) {
//       .navbar,.hero-content,section { padding-left:24px; padding-right:24px; }
//       .hero-title { font-size:2.5rem; } }
//   `]
// })
// export class LandingComponent {
//   constructor(public router: Router) {}
//   features = [
//     { icon:'📍', title:'Live GPS Tracking',
//       desc:'Track your parcel in real-time with instant updates as your package moves.' },
//     { icon:'⚡', title:'Express Delivery',
//       desc:'Same-day and next-day delivery options. Priority handling for urgent packages.' },
//     { icon:'💳', title:'Secure Payments',
//       desc:'Cards, UPI, and cash on delivery. All transactions encrypted and safe.' },
//     { icon:'📄', title:'Digital Invoices',
//       desc:'Instant PDF invoice for every shipment. Download anytime from dashboard.' },
//     { icon:'🛡️', title:'Package Protection',
//       desc:'Fragile and heavy-duty packing options with insurance coverage.' },
//     { icon:'📊', title:'Full History',
//       desc:'Complete shipment history with filtering. Never lose track of deliveries.' }
//   ];
//   steps = [
//     { icon:'📝', title:'Book Online',
//       desc:'Fill receiver details, package info, and delivery type. Get instant price.' },
//     { icon:'🏠', title:'Pickup Scheduled',
//       desc:'Our courier arrives at your doorstep at the scheduled time.' },
//     { icon:'✅', title:'Delivered Safe',
//       desc:'Real-time tracking every step. Confirmation on delivery.' }
//   ];
// }


import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  template: `
  <div class="land">
    <!-- Nav -->
    <nav class="lnav">
      <div class="lnav-logo">
        <div style="width:30px;height:30px;background:var(--amber);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px">🚀</div>
        <span style="font-family:var(--font-sans);font-size:1rem;font-weight:800;color:var(--ink);letter-spacing:-0.02em">Swift Courier</span>
      </div>
      <div class="lnav-links">
        <button class="btn btn-ghost btn-sm" (click)="r.navigate(['/track'])">Track Parcel</button>
        <button class="btn btn-secondary btn-sm" (click)="r.navigate(['/login'])">Sign In</button>
        <button class="btn btn-primary btn-sm" (click)="r.navigate(['/register'])">Get Started</button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-tag">🇮🇳 India's Trusted Courier Platform</div>
        <h1 class="hero-h1">Ship it fast.<br><em>Track it live.</em></h1>
        <p class="hero-p">From booking to doorstep — real-time GPS tracking, smart routing, and instant invoices. Built for individuals and businesses alike.</p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" (click)="r.navigate(['/register'])">
            <span class="material-icons" style="font-size:18px">rocket_launch</span>
            Start Shipping Free
          </button>
          <button class="btn btn-secondary btn-lg" (click)="r.navigate(['/track'])">
            <span class="material-icons" style="font-size:18px">search</span>
            Track a Parcel
          </button>
        </div>
        <div class="hero-stats">
          <div class="hs"><span class="hs-n">50K+</span><span class="hs-l">Customers</span></div>
          <div class="hs-sep"></div>
          <div class="hs"><span class="hs-n">2M+</span><span class="hs-l">Deliveries</span></div>
          <div class="hs-sep"></div>
          <div class="hs"><span class="hs-n">99.2%</span><span class="hs-l">On-Time</span></div>
          <div class="hs-sep"></div>
          <div class="hs"><span class="hs-n">28</span><span class="hs-l">States</span></div>
        </div>
      </div>

      <!-- Right: card stack -->
      <div class="hero-cards">
        <div class="hcard hc1">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <div style="width:36px;height:36px;background:var(--teal-light);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px">📦</div>
            <div>
              <div style="font-weight:700;font-size:13px">BK-20240842</div>
              <div style="font-size:11px;color:var(--ink3)">Nagda → Indore</div>
            </div>
            <div class="badge badge-INTRANSIT" style="margin-left:auto">In Transit</div>
          </div>
          <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:65%;background:var(--amber);border-radius:2px"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--ink3)">
            <span>Picked up 9am</span><span>Est. 3pm today</span>
          </div>
        </div>

        <div class="hcard hc2">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink4);margin-bottom:8px">Live Location</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="live-dot" style="width:12px;height:12px"></div>
            <span style="font-size:13px;font-weight:600;color:var(--ink)">Courier at NH-3, Dewas Rd</span>
          </div>
          <div style="font-size:11px;color:var(--ink3);margin-top:4px">Updated 30 seconds ago</div>
        </div>

        <div class="hcard hc3">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:24px">✅</span>
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--teal)">Delivered!</div>
              <div style="font-size:11px;color:var(--ink3)">INV-20240041 · ₹284</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="sec-tag">What We Offer</div>
      <h2 class="sec-h2">Everything your<br>shipment needs</h2>
      <div class="feat-grid">
        <div class="feat-card" *ngFor="let f of feats">
          <div class="fc-ico" [style.background]="f.bg">{{f.icon}}</div>
          <h3 style="font-size:15px;font-weight:700;margin-bottom:6px">{{f.title}}</h3>
          <p style="font-size:13px;color:var(--ink3);line-height:1.6">{{f.desc}}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how" style="background:var(--cream2)">
      <div class="sec-tag">Process</div>
      <h2 class="sec-h2">Book in 3 steps</h2>
      <div class="steps-row">
        <div class="step-item" *ngFor="let s of steps; let i=index">
          <div class="si-num">{{i+1 < 10 ? '0'+(i+1) : i+1}}</div>
          <div class="si-icon">{{s.icon}}</div>
          <h3 style="font-size:15px;font-weight:700;margin-bottom:6px">{{s.title}}</h3>
          <p style="font-size:13px;color:var(--ink3);line-height:1.6">{{s.desc}}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-sec">
      <div class="cta-inner">
        <h2 style="font-size:2rem;font-weight:800;margin-bottom:12px;color:var(--white)">Ready to ship smarter?</h2>
        <p style="color:rgba(255,255,255,0.75);margin-bottom:28px;font-size:15px">Join 50,000+ customers across India.</p>
        <button class="btn btn-lg" (click)="r.navigate(['/register'])" style="background:#fff;color:var(--amber);font-weight:800">
          <span class="material-icons" style="font-size:18px">person_add</span>
          Create Free Account
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="lfooter">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="width:24px;height:24px;background:var(--amber);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px">🚀</div>
        <span style="font-weight:800;color:var(--ink)">Swift Courier</span>
      </div>
      <p style="font-size:12px;color:var(--ink4)">© 2024 Swift Courier · Fast. Reliable. Trackable.</p>
    </footer>
  </div>
  `,
  styles: [`
    .land { background:var(--cream); min-height:100vh; }
    .lnav { display:flex; align-items:center; justify-content:space-between; padding:16px 48px; background:var(--white); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; }
    .lnav-logo { display:flex; align-items:center; gap:8px; }
    .lnav-links { display:flex; gap:10px; align-items:center; }
    .hero { display:flex; align-items:center; gap:40px; padding:64px 48px; min-height:calc(100vh - 57px); background:var(--white); }
    .hero-inner { flex:1; max-width:560px; }
    .hero-tag { display:inline-flex; align-items:center; gap:6px; background:var(--amber-light); color:var(--amber); border:1px solid var(--amber-border); padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:20px; }
    .hero-h1 { font-size:3.2rem; font-weight:800; line-height:1.08; color:var(--ink); margin-bottom:16px; letter-spacing:-0.03em;
      em { font-family:var(--font-serif); font-style:italic; color:var(--amber); font-weight:400; }
    }
    .hero-p { font-size:15px; color:var(--ink3); line-height:1.7; margin-bottom:28px; max-width:460px; }
    .hero-cta { display:flex; gap:10px; margin-bottom:36px; flex-wrap:wrap; }
    .hero-stats { display:flex; align-items:center; gap:20px; }
    .hs { display:flex; flex-direction:column; gap:2px; .hs-n { font-family:var(--font-sans); font-size:1.4rem; font-weight:800; color:var(--amber); } .hs-l { font-size:11px; color:var(--ink4); font-weight:600; } }
    .hs-sep { width:1px; height:32px; background:var(--border); }
    .hero-cards { flex-shrink:0; display:flex; flex-direction:column; gap:12px; width:300px; }
    .hcard { background:var(--white); border:1px solid var(--border); border-radius:var(--r-xl); padding:16px; box-shadow:var(--shadow-md); }
    .hc1 { animation:floatA 4s ease-in-out infinite; }
    .hc2 { animation:floatA 4s ease-in-out infinite 1s; }
    .hc3 { animation:floatA 4s ease-in-out infinite 2s; }
    @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

    section { padding:64px 48px; }
    .sec-tag { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--amber); margin-bottom:10px; }
    .sec-h2 { font-size:2rem; font-weight:800; color:var(--ink); margin-bottom:40px; line-height:1.15; }

    .features { background:var(--cream); }
    .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .feat-card { background:var(--white); border:1px solid var(--border); border-radius:var(--r-xl); padding:24px; transition:all 0.2s;
      &:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
    }
    .fc-ico { width:44px; height:44px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:14px; }

    .how { }
    .steps-row { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
    .step-item { text-align:center; }
    .si-num { font-family:var(--font-serif); font-size:3rem; font-style:italic; color:var(--border2); line-height:1; margin-bottom:8px; }
    .si-icon { font-size:32px; margin-bottom:12px; }

    .cta-sec { background:var(--amber); padding:64px 48px; text-align:center; }
    .cta-inner { max-width:500px; margin:0 auto; }

    .lfooter { text-align:center; padding:28px 48px; border-top:1px solid var(--border); background:var(--white); }

    @media(max-width:1000px) {
      .hero { flex-direction:column; padding:40px 24px; }
      .hero-cards { width:100%; max-width:360px; }
      .feat-grid,.steps-row { grid-template-columns:1fr; }
      .lnav { padding:14px 20px; }
      section { padding:40px 24px; }
    }
  `]
})
export class LandingComponent {
  constructor(public r: Router) {}
  feats = [
    { icon:'📍', title:'Live GPS Tracking', desc:'Watch your parcel move in real-time on an interactive map with courier location updates every 3 seconds.', bg:'var(--amber-light)' },
    { icon:'🗺️', title:'Smart Route Planning', desc:'Our system finds the fastest road route and shows alternatives. Officers can track and optimize delivery paths.', bg:'var(--teal-light)' },
    { icon:'💳', title:'Secure Online Payment', desc:'16-digit card validation, encrypted processing, and instant PDF invoice generation for every transaction.', bg:'var(--blue-light)' },
    { icon:'🔔', title:'Real-Time Notifications', desc:'Get instant push notifications when your parcel status changes — from pickup to delivered.', bg:'var(--gold-light)' },
    { icon:'📄', title:'PDF Invoices', desc:'Professional invoice generated instantly on payment. Download anytime from your booking history.', bg:'var(--red-light)' },
    { icon:'🛡️', title:'Package Protection', desc:'Basic, fragile, and heavy-duty packing options to keep your items safe throughout the journey.', bg:'var(--cream2)' }
  ];
  steps = [
    { icon:'📝', title:'Fill Booking Form', desc:'Enter receiver details, package weight, and delivery preference. See the live price instantly.' },
    { icon:'🗺️', title:'Set Route on Map', desc:'Search origin and destination by name. See actual road routes with distances and time estimates.' },
    { icon:'✅', title:'Pay & Track Live', desc:'Complete payment securely. Track your parcel live on the map as the courier moves toward delivery.' }
  ];
}