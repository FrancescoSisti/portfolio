import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loader-container" [class.show]="isLoading">
      <div class="loader">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div>
  `,
    styles: [`
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--background);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .loader-container.show {
      opacity: 1;
      visibility: visible;
    }

    .loader {
      display: flex;
      gap: 0.5rem;
    }

    .circle {
      width: 1rem;
      height: 1rem;
      background: var(--primary);
      border-radius: 50%;
      animation: bounce 0.5s ease-in-out infinite;
    }

    .circle:nth-child(2) {
      animation-delay: 0.1s;
    }

    .circle:nth-child(3) {
      animation-delay: 0.2s;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-1rem);
      }
    }
  `]
})
export class LoaderComponent implements OnInit {
    isLoading = false;

    constructor(private loaderService: LoaderService) { }

    ngOnInit() {
        this.loaderService.isLoading$.subscribe(
            isLoading => this.isLoading = isLoading
        );
    }
}
