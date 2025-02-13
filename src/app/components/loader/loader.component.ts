import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" [class.visible]="isLoading">
      <div class="loader-content">
        <div class="spinner-wrapper">
          <div class="spinner-circle"></div>
          <div class="spinner-circle-inner"></div>
        </div>
        <div class="loading-message">Caricamento...</div>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(var(--background-rgb), 0.92);
      display: grid;
      place-items: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      backdrop-filter: blur(12px);
    }

    .loader-overlay.visible {
      opacity: 1;
      pointer-events: all;
    }

    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
      transform: translateY(-2rem);
    }

    .spinner-wrapper {
      width: 6rem;
      height: 6rem;
      position: relative;
    }

    .spinner-circle {
      width: 100%;
      height: 100%;
      border: 5px solid var(--primary);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .spinner-circle-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 70%;
      height: 70%;
      border: 5px solid var(--primary);
      border-bottom-color: transparent;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: spin-reverse 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .loading-message {
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--primary);
      text-shadow: 0 2px 10px rgba(var(--primary-rgb), 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes spin-reverse {
      to {
        transform: translate(-50%, -50%) rotate(-360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
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
