import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, Toast } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts"
           class="toast toast-{{toast.type}}">
        <span class="material-icons" style="font-size:18px">
          {{toast.type==='success'?'check_circle':toast.type==='error'?'error':'info'}}
        </span>
        {{toast.message}}
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
      }, 4000);
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}