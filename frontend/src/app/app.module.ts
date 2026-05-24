import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { LandingComponent } from './components/shared/landing/landing.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { GeocodingService } from './services/geocoding.service';
import { GpsTrackerService } from './services/gps-tracker.service';
// import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CustomerDashboardComponent,
    CreateBookingComponent,
    BookingHistoryComponent,
    PaymentComponent,
    OfficerDashboardComponent,
    AllBookingsComponent,
    CounterBookingComponent,
    LiveTrackingComponent,
    TrackingComponent,
    SidebarComponent,
    LandingComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }