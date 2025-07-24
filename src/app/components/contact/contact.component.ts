import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import * as L from 'leaflet';
import { ContactApiService, ContactFormData, ContactApiResponse } from '../../services/contact-api.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class ContactComponent implements OnInit, AfterViewInit {
  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  validationErrors: { [key: string]: string[] } = {};
  private map: L.Map | null = null;
  private isBrowser: boolean;

  // Map configuration
  private readonly center: L.LatLngExpression = [45.4396, 11.0025]; // Corso Venezia 83, Verona
  private readonly customIcon = L.icon({
    iconUrl: 'assets/icons/map-marker.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private contactApiService: ContactApiService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  private initMap(): void {
    if (!this.isBrowser) return;

    try {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map container not found');
        return;
      }

      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(mapElement, {
        center: this.center,
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.map);

      const marker = L.marker(this.center, { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup('Corso Venezia 83, Verona 📍', {
          closeButton: false,
          className: 'custom-popup'
        })
        .openPopup();

      setTimeout(() => {
        this.map?.invalidateSize();
      }, 200);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  scrollToMap() {
    if (!this.isBrowser) return;

    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 500);
    }
  }

  async onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';
    this.validationErrors = {};

    // Prepare data for the API
    const contactData: ContactFormData = {
      name: this.formData.name,
      email: this.formData.email,
      message: this.formData.message
    };

    // Add optional fields if they have values
    if (this.formData.subject?.trim()) {
      contactData.subject = this.formData.subject;
    }
    if (this.formData.phone?.trim()) {
      contactData.phone = this.formData.phone;
    }
    if (this.formData.company?.trim()) {
      contactData.company = this.formData.company;
    }

    this.contactApiService.submitContact(contactData)
      .subscribe({
        next: (response: ContactApiResponse) => {
          if (response.success) {
            this.submitSuccess = true;
            // Reset form on success
            this.formData = {
              name: '',
              email: '',
              subject: '',
              message: '',
              phone: '',
              company: ''
            };
            console.log('Message sent successfully. Contact ID:', response.contact_id);
          } else {
            this.submitError = true;
            this.errorMessage = response.message || 'Si è verificato un errore durante l\'invio.';
            if (response.errors) {
              this.validationErrors = response.errors;
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error submitting form:', error);
          this.submitError = true;
          
          if (error.status === 422 && error.error?.errors) {
            // Validation errors
            this.validationErrors = error.error.errors;
            this.errorMessage = error.error.message || 'I dati forniti non sono validi';
          } else if (error.status === 429) {
            // Rate limit exceeded
            this.errorMessage = 'Troppi tentativi. Riprova tra qualche minuto.';
          } else if (error.status === 0) {
            // Network error
            this.errorMessage = 'Errore di connessione. Controlla la tua connessione internet.';
          } else {
            // Generic error
            this.errorMessage = error.error?.message || 'Si è verificato un errore durante l\'invio. Riprova più tardi.';
          }
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  // Helper method to get validation error for a specific field
  getFieldError(fieldName: string): string | null {
    return this.validationErrors[fieldName]?.[0] || null;
  }

  // Helper method to check if a field has validation errors
  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  getDirections() {
    const address = encodeURIComponent('Corso Venezia 83, Verona');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  }
}
