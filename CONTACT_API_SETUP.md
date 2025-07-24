# Configurazione API Form di Contatto

## Configurazione dell'Ambiente

1. **Aggiorna l'URL dell'API** nel file `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     googleMapsApiKey: '',
     apiUrl: 'https://your-domain.com' // Sostituisci con l'URL del tuo server API
   };
   ```

2. **Per l'ambiente di produzione**, crea anche il file `src/environments/environment.prod.ts` se non esiste:
   ```typescript
   export const environment = {
     production: true,
     googleMapsApiKey: 'your-google-maps-api-key',
     apiUrl: 'https://your-production-domain.com'
   };
   ```

## Caratteristiche Implementate

### ✅ Form di Contatto Completo
- **Campi obbligatori**: Nome, Email, Messaggio
- **Campi opzionali**: Oggetto, Telefono, Azienda
- **Validazione in tempo reale** con messaggi di errore specifici per campo
- **Gestione degli stati**: Loading, Success, Error

### ✅ Integrazione API REST
- **Endpoint**: `POST /api/v1/contacts`
- **Rate limiting**: Gestione automatica degli errori 429
- **Validazione server-side**: Errori specifici per campo (422)
- **Tracking automatico**: Origin, timestamp, user agent

### ✅ Gestione Errori Avanzata
- **Errori di validazione**: Mostrati sotto ogni campo specifico
- **Errori di rete**: Messaggi informativi per l'utente
- **Rate limiting**: Avviso quando si superano i limiti
- **Fallback**: Messaggi generici per errori non previsti

### ✅ Servizio Dedicato
- `ContactApiService` per centralizzare la logica API
- Interfacce TypeScript per type safety
- Metodi per controllare lo stato dei messaggi inviati
- Gestione automatica degli errori

## Struttura API

### Richiesta
```json
{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "message": "Messaggio di contatto",
  "subject": "Richiesta informazioni",
  "phone": "+39 123 456 7890",
  "company": "Acme Corp",
  "origin": "https://your-website.com",
  "extra_data": {
    "source": "portfolio_website",
    "timestamp": "2025-01-24T10:30:00.000Z",
    "user_agent": "Mozilla/5.0..."
  }
}
```

### Risposta di Successo
```json
{
  "success": true,
  "message": "Messaggio inviato con successo. Ti risponderemo al più presto!",
  "contact_id": 123
}
```

### Risposta di Errore
```json
{
  "success": false,
  "message": "I dati forniti non sono validi",
  "errors": {
    "email": ["L'email è obbligatoria"],
    "message": ["Il messaggio deve essere di almeno 10 caratteri"]
  }
}
```

## Testing

Per testare l'integrazione:

1. **Configura l'URL dell'API** corretto nell'environment
2. **Assicurati che il server API sia attivo** e risponda all'endpoint
3. **Testa i vari scenari**:
   - Form valido
   - Campi mancanti
   - Rate limiting
   - Errori di rete

## Note Tecniche

- Il form utilizza Angular Reactive Forms per la validazione
- Gli errori vengono mostrati in tempo reale sotto ogni campo
- Il servizio `ContactApiService` può essere riutilizzato in altri componenti
- Tutti i tipi TypeScript sono definiti per garantire type safety
- La gestione degli errori è centralizzata nel servizio

## File Modificati

- `src/app/components/contact/contact.component.ts` - Componente principale
- `src/app/components/contact/contact.component.html` - Template con nuovi campi
- `src/app/components/contact/contact.component.scss` - Stili per gestione errori
- `src/app/services/contact-api.service.ts` - Nuovo servizio API
- `src/environments/environment.ts` - Configurazione API URL 