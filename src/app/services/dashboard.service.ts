import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private _isDashboardCollapsed = new BehaviorSubject<boolean>(false);
    isDashboardCollapsed$ = this._isDashboardCollapsed.asObservable();

    constructor() { }

    setDashboardCollapsed(value: boolean) {
        this._isDashboardCollapsed.next(value);
    }
}
