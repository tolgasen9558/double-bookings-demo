import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html'
})
export class BookingComponent {
  logs: string[] = [];
  isProcessing = false;

  constructor(private bookingService: BookingService) {}

  async runDemo(mode: 'unsafe' | 'safe') {
    this.isProcessing = true;
    this.logs = [`Starting ${mode.toUpperCase()} simulation...`];

    try {
      await this.bookingService.resetSystem();
      this.logs.push('DB Reset. 1 Slot Available.');
      
      this.logs.push('Firing 20 concurrent requests...');
      const results = await this.bookingService.simulateTraffic(mode);

      // Count successes
      const successCount = results.filter((r: any) => r.status === 'fulfilled' && r.value.success).length;
      
      this.logs.push(`Result: ${successCount} bookings processed.`);
      
      if (successCount > 1) {
        this.logs.push('FAIL: Race Condition Detected! (Oversold)');
      } else {
        this.logs.push('SUCCESS: System secured (Transactions working).');
      }

    } catch (err) {
      console.error(err);
      this.logs.push('Error: Could not connect to AWS Backend.');
    } finally {
      this.isProcessing = false;
    }
  }
}