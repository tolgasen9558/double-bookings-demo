import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) { }

  async resetSystem() {
    return firstValueFrom(this.http.post(`${environment.apiUrl}/reset`, {}));
  }

  async simulateTraffic(mode: 'unsafe' | 'safe') {
    const requests = [];
    // 20 requests at the exact same millisecond
    for (let i = 0; i < 20; i++) {
      requests.push(firstValueFrom(this.http.post(`${environment.apiUrl}/book/${mode}`, {
        clientName: `Simulated User ${i + 1}`
      })));
    }
    return Promise.allSettled(requests);
  }
}