import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-notifications',
  template: `
    <div class="toast-container" *ngIf="toast$ | async as toast">
      <div class="toast" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .toast {
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      min-width: 200px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .toast.success { background-color: #28a745; }
    .toast.error { background-color: #dc3545; }
  `]
})
export class ToastNotificationsComponent {
  toast$ = this.toastService.toast$;
  constructor(private toastService: ToastService) { }
}
