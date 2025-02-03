import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly MOBILE_BREAKPOINT = 768;
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIfMobile());

  constructor() {
    this.initializeResponsiveObserver();
  }

  private initializeResponsiveObserver(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        map(() => this.checkIfMobile()),
        distinctUntilChanged(),
        startWith(this.checkIfMobile())
      )
      .subscribe(isMobile => {
        this.isMobileSubject.next(isMobile);
      });
  }

  private checkIfMobile(): boolean {
    return window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  get isMobile$(): Observable<boolean> {
    return this.isMobileSubject.asObservable();
  }

  get isMobile(): boolean {
    return this.checkIfMobile();
  }
}
