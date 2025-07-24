import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
  company?: string;
  origin?: string;
  extra_data?: any;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  contact_id?: number;
  errors?: { [key: string]: string[] };
}

export interface ContactStatus {
  id: number;
  status: string;
  created_at: string;
}

export interface ContactStatusResponse {
  success: boolean;
  contact: ContactStatus;
}

export interface ApiInfoResponse {
  success: boolean;
  api_version: string;
  status: string;
  endpoints: {
    submit: string;
    status: string;
  };
  rate_limits: {
    requests_per_5_minutes: number;
    max_message_length: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {
  private readonly baseUrl = `${environment.apiUrl}/api/v1/contacts`;

  constructor(private http: HttpClient) {}

  // Submit a new contact form
  submitContact(data: ContactFormData): Observable<ContactApiResponse> {
    const payload: ContactFormData = {
      ...data,
      origin: window.location.origin,
      extra_data: {
        source: 'portfolio_website',
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ...data.extra_data
      }
    };

    return this.http.post<ContactApiResponse>(this.baseUrl, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Check the status of a submitted contact
  checkContactStatus(contactId: number): Observable<ContactStatusResponse> {
    return this.http.get<ContactStatusResponse>(`${this.baseUrl}/${contactId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get API information and status
  getApiInfo(): Observable<ApiInfoResponse> {
    return this.http.get<ApiInfoResponse>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Si è verificato un errore durante l\'invio.';

    if (error.status === 422 && error.error?.errors) {
      // Validation errors - pass through for component to handle
      return throwError(() => error);
    } else if (error.status === 429) {
      errorMessage = 'Troppi tentativi. Riprova tra qualche minuto.';
    } else if (error.status === 0) {
      errorMessage = 'Errore di connessione. Controlla la tua connessione internet.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => ({ ...error, customMessage: errorMessage }));
  }
} 