import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withHashLocation(),  // Use hash-based routing
      withViewTransitions()  // Enable view transitions
    ),
    provideClientHydration(),
    provideHttpClient(withFetch())
  ]
};
