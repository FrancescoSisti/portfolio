import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScrollService } from './services/scroll.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoaderComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <app-loader></app-loader>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'portfolio';

  constructor(
    private scrollService: ScrollService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loaderService.hide();
        }, 500); // Minimo mezzo secondo di loader per evitare flash
      }
    });
  }
}
