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

interface ShareOption {
  name: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-contact-mobile',
  templateUrl: './contact-mobile.component.html',
  styleUrls: ['./contact-mobile.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class ContactMobileComponent implements OnInit, AfterViewInit {
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
  showShareOptions = false;

  // Map configuration
  private readonly center: L.LatLngExpression = [45.4396, 11.0025];
  private readonly customIcon = L.icon({
    iconUrl: 'assets/icons/map-marker.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  shareOptions: ShareOption[] = [
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      action: () => this.shareOnWhatsApp()
    },
    {
      name: 'Telegram',
      icon: 'fab fa-telegram',
      action: () => this.shareOnTelegram()
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      action: () => this.shareViaEmail()
    },
    {
      name: 'Copy Link',
      icon: 'fas fa-link',
      action: () => this.copyLink()
    }
  ];

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
      const mapElement = document.getElementById('map-mobile');
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

  toggleShareOptions() {
    this.showShareOptions = !this.showShareOptions;
  }

  private getShareText(): string {
    return 'Ciao! Sono Francesco Sisti, sviluppatore web. Ti invito a dare un\'occhiata al mio portfolio per scoprire come posso aiutarti a realizzare il tuo progetto digitale.';
  }

  private getShareUrl(): string {
    return window.location.origin;
  }

  shareOnWhatsApp() {
    const text = encodeURIComponent(this.getShareText());
    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  }

  shareOnTelegram() {
    const text = encodeURIComponent(this.getShareText());
    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  }

  shareViaEmail() {
    const subject = encodeURIComponent('Portfolio di Francesco Sisti');
    const body = encodeURIComponent(`${this.getShareText()}\n\n${this.getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.getShareUrl());
      // Qui potresti aggiungere un feedback visivo per l'utente
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  scrollToMap() {
    if (!this.isBrowser) return;

    const mapSection = document.getElementById('map-section-mobile');
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

  getDirections() {
    const address = encodeURIComponent('Corso Venezia 83, Verona');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  }
}
