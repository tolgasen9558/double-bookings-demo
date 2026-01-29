import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html'
})
export class BookingComponent {
  logs: string[] = [];
  isProcessing = false;
  isResetting = false;
  isSoldOut = false;
  raceResult: { successCount: number; mode: 'safe' | 'unsafe' } | null = null;

  constructor(public bookingService: BookingService) {}

  async resetAndLog() {
    this.logs = ['Resetting System...'];
    this.isResetting = true;

    try {
      await this.bookingService.resetSystem();

      this.isSoldOut = false;
      this.raceResult = null;

      this.logs.push('Database Cleared.');
      this.logs.push('Available Slots: 1');
    } catch (err) {
      this.logs.push('Error: Could not reset DB.');
    } finally {
      this.isResetting = false;
    }
  }

  async runDemo(mode: 'unsafe' | 'safe') {
    this.isProcessing = true;
    this.logs = [`Starting ${mode.toUpperCase()} simulation...`];
    this.raceResult = null;

    try {
      await this.bookingService.resetSystem();
      this.logs.push('DB Reset. 1 Slot Available.');

      this.logs.push('Firing 20 concurrent requests...');
      const results = await this.bookingService.simulateTraffic(mode);

      const successCount = results.filter((r: any) => r.status === 'fulfilled' && r.value.success).length;

      this.isSoldOut = successCount > 0;
      this.raceResult = { successCount, mode };

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