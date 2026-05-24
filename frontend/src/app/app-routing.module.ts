import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/shared/landing/landing.component';
// import { LandingComponent } from './components/shared/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CustomerDashboardComponent } from './components/customer/dashboard/dashboard.component';
import { CreateBookingComponent } from './components/customer/create-booking/create-booking.component';
import { BookingHistoryComponent } from './components/customer/booking-history/booking-history.component';
import { PaymentComponent } from './components/customer/payment/payment.component';
import { OfficerDashboardComponent } from './components/officer/dashboard/dashboard.component';
import { AllBookingsComponent } from './components/officer/all-bookings/all-bookings.component';
import { CounterBookingComponent } from './components/officer/counter-booking/counter-booking.component';
import { LiveTrackingComponent } from './components/officer/live-tracking/live-tracking.component';
import { TrackingComponent } from './components/shared/tracking/tracking.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'track', component: TrackingComponent },
  { path: 'track/:bookingId', component: TrackingComponent },
  { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [AuthGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/book', component: CreateBookingComponent, canActivate: [AuthGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/history', component: BookingHistoryComponent, canActivate: [AuthGuard], data: { role: 'CUSTOMER' } },
  { path: 'customer/payment/:bookingId', component: PaymentComponent, canActivate: [AuthGuard], data: { role: 'CUSTOMER' } },
  { path: 'officer/dashboard', component: OfficerDashboardComponent, canActivate: [AuthGuard], data: { role: 'OFFICER' } },
  { path: 'officer/bookings', component: AllBookingsComponent, canActivate: [AuthGuard], data: { role: 'OFFICER' } },
  { path: 'officer/counter-book', component: CounterBookingComponent, canActivate: [AuthGuard], data: { role: 'OFFICER' } },
  { path: 'officer/live-tracking', component: LiveTrackingComponent, canActivate: [AuthGuard], data: { role: 'OFFICER' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }