import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toastSubject.next({ message, type });
    setTimeout(() => this.clear(), 3000);
  }
  clear() {
    this.toastSubject.next(null);
  }
}
