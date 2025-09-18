import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<{ eventName: string, payload?: any }>();

  // Emit event
  emit(eventName: string, payload?: any): void {
    this.subject.next({ eventName, payload });
  }

  // Listen event
  on(eventName: string): Observable<any> {
    return this.subject.asObservable().pipe(
      filter(event => event.eventName === eventName)
    );
  }

  // Subscribe langsung
  subscribe(eventName: string, action: (payload?: any) => void): Subscription {
    return this.subject.asObservable().subscribe((event: { eventName: string; payload?: any }) => {
      if (event.eventName === eventName) {
        action(event.payload);
      }
    });
  }
}
