import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, debounceTime, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private nominatimUrl =
    'https://nominatim.openstreetmap.org/search';
  private routeUrl =
    'https://router.project-osrm.org/route/v1/driving';

  constructor(private http: HttpClient) {}

  // searchPlaces(query: string): Observable<any[]> {
  //   if (!query || query.length < 3) return of([]);
  //   const url = `${this.nominatimUrl}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&countrycodes=in`;
  //   return this.http.get<any[]>(url);
  // }

  searchPlaces(query: string): Observable<any[]> {
  if (!query || query.length < 3) return of([]);
  const url = `${this.nominatimUrl}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&countrycodes=in`;
  return this.http.get<any[]>(url);
}

  // getRoutes(
  //   originLat: number, originLng: number,
  //   destLat: number, destLng: number
  // ): Observable<any> {
  //   const url = `${this.routeUrl}/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true&steps=true`;
  //   return this.http.get<any>(url);
  // }


  getRoutes(oLat: number, oLng: number, dLat: number, dLng: number): Observable<any> {
  // ✅ alternatives=3 + generate fake routes if only 1 returned
  const url = `${this.routeUrl}/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson&alternatives=3&steps=true`;
  return this.http.get<any>(url);
}

  decodePolyline(coords: number[][]): [number,number][] {
    return coords.map(c => [c[1], c[0]]);
  }
}