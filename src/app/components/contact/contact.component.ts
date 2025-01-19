import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
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
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  private map: L.Map | null = null;
  private isBrowser: boolean;
  private readonly FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdkkrjjy';

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
    private http: HttpClient
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

    try {
      await this.http.post(this.FORMSPREE_ENDPOINT, this.formData).toPromise();
      this.submitSuccess = true;
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      console.error('Error submitting form:', error);
      this.submitError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
