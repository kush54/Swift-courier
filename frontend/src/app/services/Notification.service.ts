import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'status' | 'payment' | 'info';
  bookingId?: string;
  timestamp: Date;
  read: boolean;
}

declare var SockJS: any;
declare var Stomp: any;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private stompClient: any;
  private notifSubject = new Subject<Notification>();
  private notifsStore = new BehaviorSubject<Notification[]>([]);

  notifs$ = this.notifsStore.asObservable();
  newNotif$ = this.notifSubject.asObservable();

  get unreadCount(): number {
    return this.notifsStore.value.filter(n => !n.read).length;
  }
private connected = false; // ✅ add karo

  connectForCustomer(customerId: string) {
    if (this.connected) return; // ✅ already connected toh skip
  this.connected = true;
    try {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {};

      this.stompClient.connect({}, () => {
        // Subscribe to personal notifications
        this.stompClient.subscribe(
          `/topic/notifications/${customerId}`,
          (msg: any) => {
            const data = JSON.parse(msg.body);
            const notif: Notification = {
              id: Date.now().toString(),
              title: data.title || 'Update',
              body: data.body || data.message || '',
              type: data.type || 'status',
              bookingId: data.bookingId,
              timestamp: new Date(),
              read: false
            };
            const current = this.notifsStore.value;
            this.notifsStore.next([notif, ...current]);
            this.notifSubject.next(notif);
          }
        );
      }, () => {
         this.connected = false; // ✅ error pe reset karo
      });
    } catch (e) {
      this.connected = false;
    }
  }

  markAllRead() {
    const updated = this.notifsStore.value
      .map(n => ({ ...n, read: true }));
    this.notifsStore.next(updated);
  }

  addLocal(notif: Omit<Notification, 'id'|'timestamp'|'read'>) {
    const n: Notification = {
      ...notif, id: Date.now().toString(),
      timestamp: new Date(), read: false
    };
    this.notifsStore.next([n, ...this.notifsStore.value]);
    this.notifSubject.next(n);
  }

 disconnect() {
  if (this.stompClient) this.stompClient.disconnect();
  this.connected = false; // ✅ disconnect pe reset
}
}