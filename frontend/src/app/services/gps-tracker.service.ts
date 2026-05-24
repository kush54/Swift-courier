import { Injectable } from '@angular/core';
import { Subject, Observable, interval, Subscription } from 'rxjs';
import { BookingService } from './booking.service';
import { ToastService } from './toast.service';

export interface GpsPosition {
  bookingId: string;
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class GpsTrackerService {
  private watchId: number | null = null;
  private intervalSub: Subscription | null = null;
  private positionSubject = new Subject<GpsPosition>();
  private currentBookingId = '';
  private isTracking = false;

  position$ = this.positionSubject.asObservable();

  constructor(
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  startTracking(bookingId: string): Observable<GpsPosition> {
    this.currentBookingId = bookingId;
    this.isTracking = true;

    if (!navigator.geolocation) {
      this.toast.error(
        'Geolocation not supported by this browser');
      this.simulateGps(bookingId);
      return this.position$;
    }

    // Watch real GPS position
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const gpsPos: GpsPosition = {
          bookingId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        };
        this.positionSubject.next(gpsPos);
        // Push to backend every update
        this.pushToBackend(bookingId,
          pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn('GPS error:', err.message);
        // Fallback to simulation
        this.simulateGps(bookingId);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 8000
      }
    );

    return this.position$;
  }

  // Simulate GPS movement for demo/testing
  simulateGps(bookingId: string) {
    this.toast.info(
      'Using simulated GPS (demo mode)');
    let lat = 22.7196; // Nagda, MP
    let lng = 75.4120;
    const destLat = 22.7196;
    const destLng = 75.8577; // Indore

    const steps = 50;
    let step = 0;
    const dLat = (destLat - lat) / steps;
    const dLng = (destLng - lng) / steps;

    this.intervalSub = interval(3000).subscribe(() => {
      if (step >= steps || !this.isTracking) {
        this.stopTracking();
        return;
      }
      lat += dLat + (Math.random() - 0.5) * 0.001;
      lng += dLng + (Math.random() - 0.5) * 0.001;
      step++;

      const gpsPos: GpsPosition = {
        bookingId,
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        accuracy: 10,
        timestamp: Date.now()
      };
      this.positionSubject.next(gpsPos);
      this.pushToBackend(bookingId, gpsPos.lat, gpsPos.lng);
    });
  }

  private pushToBackend(bookingId: string,
      lat: number, lng: number) {
    this.bookingService.updateGps(bookingId, lat, lng)
      .subscribe({
        error: (e) => console.warn('GPS push failed:', e)
      });
  }

  stopTracking() {
    this.isTracking = false;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
      this.intervalSub = null;
    }
  }

  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }
}