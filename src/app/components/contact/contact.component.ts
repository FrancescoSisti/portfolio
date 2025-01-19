import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  imports: [FormsModule, CommonModule]
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
  private map: L.Map | null = null;

  // Map configuration
  private readonly center: L.LatLngExpression = [45.4396, 11.0025]; // Corso Venezia 83, Verona
  private readonly customIcon = L.icon({
    iconUrl: 'assets/icons/map-marker.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  constructor() { }

  ngOnInit() {
    // Non è più necessario caricare il CSS qui
  }

  ngAfterViewInit() {
    // Diamo un po' di tempo al DOM per renderizzare completamente
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap(): void {
    try {
      // Verifichiamo che il container della mappa esista
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map container not found');
        return;
      }

      // Se c'è già una mappa, la rimuoviamo
      if (this.map) {
        this.map.remove();
      }

      // Inizializziamo la mappa
      this.map = L.map(mapElement, {
        center: this.center,
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true
      });

      // Aggiungiamo il layer della mappa con stile scuro personalizzato
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.map);

      // Aggiungiamo il marker personalizzato
      const marker = L.marker(this.center, { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup('Corso Venezia 83, Verona 📍', {
          closeButton: false,
          className: 'custom-popup'
        })
        .openPopup();

      // Aggiorniamo la mappa dopo un breve ritardo per assicurarci che il container sia completamente renderizzato
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 200);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  scrollToMap() {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
      // Aggiorniamo la mappa dopo lo scroll
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 500);
    }
  }

  async onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.submitSuccess = true;
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
