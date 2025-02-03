import { Injectable } from '@angular/core';
import { PreloadAllModules, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadAllModules {
    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data?.['preload']) {
            // Precarica i componenti marcati per il precaricamento
            return load();
        }
        // Non precaricare gli altri componenti
        return of(null);
    }
}
