import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface WeatherData {
    temperature: number;
    description: string;
    icon: string;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    cloudiness: number;
    sunrise: string;
    sunset: string;
    cityName: string;
    lastUpdate: string;
    coordinates?: {
        lat: number;
        lon: number;
    };
}

export interface WeatherForecast {
    date: string;
    dayOfWeek: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    feelsLike: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    cloudiness: number;
    pop: number;
    rainAmount?: number;
    snowAmount?: number;
}

export interface AirQuality {
    aqi: number; // Air Quality Index
    components: {
        co: number;    // Carbon monoxide
        no2: number;   // Nitrogen dioxide
        o3: number;    // Ozone
        pm2_5: number; // Fine particles matter
        pm10: number;  // Coarse particulate matter
    };
    qualityLevel: string;
}

export interface CityAutocomplete {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export interface Country {
    code: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private readonly API_KEY = 'e19e461738326c8a8d3e5e52508b5f75';
    private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
    private readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0';
    private readonly MAPS_URL = 'https://tile.openweathermap.org/map';
    private readonly DEFAULT_CITY = 'Verona';
    private readonly DEFAULT_COUNTRY = 'IT';

    readonly availableCountries: Country[] = [
        { code: 'IT', name: 'Italia' },
        { code: 'FR', name: 'Francia' },
        { code: 'DE', name: 'Germania' },
        { code: 'ES', name: 'Spagna' },
        { code: 'GB', name: 'Regno Unito' },
        { code: 'US', name: 'Stati Uniti' }
    ];

    constructor(private http: HttpClient) { }

    getCurrentWeather(city: string = this.DEFAULT_CITY, countryCode: string = this.DEFAULT_COUNTRY): Observable<WeatherData> {
        const query = `${city},${countryCode}`;
        return this.http.get<any>(`${this.API_URL}/weather?q=${query}&appid=${this.API_KEY}&units=metric&lang=it`).pipe(
            map(response => {
                console.log('Raw weather data:', response); // Debug log
                return {
                    temperature: Math.round(response.main.temp),
                    description: response.weather[0].description,
                    icon: response.weather[0].icon,
                    feelsLike: Math.round(response.main.feels_like),
                    humidity: response.main.humidity,
                    windSpeed: Math.round(response.wind.speed * 3.6), // Convert to km/h
                    windDirection: this.getWindDirection(response.wind.deg),
                    pressure: response.main.pressure,
                    visibility: response.visibility / 1000, // Convert to km
                    cloudiness: response.clouds.all,
                    sunrise: new Date(response.sys.sunrise * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date(response.sys.sunset * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                    cityName: response.name,
                    lastUpdate: new Date(response.dt * 1000).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                    }),
                    coordinates: {
                        lat: response.coord.lat,
                        lon: response.coord.lon
                    }
                };
            }),
            catchError(error => {
                console.error('Error fetching weather data:', error);
                throw error;
            })
        );
    }

    getForecast(city: string = this.DEFAULT_CITY, countryCode: string = this.DEFAULT_COUNTRY): Observable<WeatherForecast[]> {
        const query = `${city},${countryCode}`;
        return this.http.get<any>(`${this.API_URL}/forecast?q=${query}&appid=${this.API_KEY}&units=metric&lang=it`).pipe(
            map(response => {
                console.log('Raw forecast data:', response); // Debug log
                const dailyForecasts = new Map<string, any[]>();

                response.list.forEach((item: any) => {
                    const date = new Date(item.dt * 1000);
                    const dateKey = date.toLocaleDateString('it-IT');

                    if (!dailyForecasts.has(dateKey)) {
                        dailyForecasts.set(dateKey, []);
                    }
                    dailyForecasts.get(dateKey)?.push(item);
                });

                return Array.from(dailyForecasts.entries())
                    .slice(0, 5)
                    .map(([dateKey, items]) => {
                        const date = new Date(items[0].dt * 1000);
                        const temps = items.map(item => item.main.temp);
                        const feelsLike = items.map(item => item.main.feels_like);

                        // Find the most frequent weather condition
                        const conditions = items.map(item => ({
                            condition: item.weather[0].main,
                            description: item.weather[0].description,
                            icon: item.weather[0].icon
                        }));
                        const conditionCounts = conditions.reduce((acc, curr) => {
                            const key = curr.condition + curr.description + curr.icon;
                            acc[key] = (acc[key] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>);

                        const mostFrequent = Object.entries(conditionCounts)
                            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
                        
                        // LOGIC FIX: Properly extract condition, description, and icon from the most frequent weather
                        // Find the original condition data that matches the most frequent key
                        const mostFrequentCondition = conditions.find(c => 
                            (c.condition + c.description + c.icon) === mostFrequent
                        ) || conditions[0]; // fallback to first condition if not found
                        
                        const { condition, description, icon } = mostFrequentCondition;

                        // Calculate precipitation amounts
                        const rainAmount = items.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);
                        const snowAmount = items.reduce((sum, item) => sum + (item.snow?.['3h'] || 0), 0);

                        return {
                            date: date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
                            dayOfWeek: date.toLocaleDateString('it-IT', { weekday: 'long' }),
                            temp: Math.round(temps.reduce((a, b) => a + b) / temps.length),
                            tempMin: Math.round(Math.min(...temps)),
                            tempMax: Math.round(Math.max(...temps)),
                            feelsLike: Math.round(feelsLike.reduce((a, b) => a + b) / feelsLike.length),
                            condition,
                            description,
                            icon,
                            humidity: Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length),
                            windSpeed: Math.round(items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length * 3.6),
                            windDirection: this.getWindDirection(items.reduce((sum, item) => sum + item.wind.deg, 0) / items.length),
                            cloudiness: Math.round(items.reduce((sum, item) => sum + item.clouds.all, 0) / items.length),
                            pop: Math.round(Math.max(...items.map(item => item.pop)) * 100),
                            rainAmount: rainAmount > 0 ? Math.round(rainAmount * 10) / 10 : undefined,
                            snowAmount: snowAmount > 0 ? Math.round(snowAmount * 10) / 10 : undefined
                        };
                    });
            }),
            catchError(error => {
                console.error('Error fetching forecast data:', error);
                throw error;
            })
        );
    }

    getAirQuality(lat: number, lon: number): Observable<AirQuality> {
        return this.http.get<any>(`${this.API_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`).pipe(
            map(response => {
                const data = response.list[0];
                return {
                    aqi: data.main.aqi,
                    components: {
                        co: Math.round(data.components.co),
                        no2: Math.round(data.components.no2),
                        o3: Math.round(data.components.o3),
                        pm2_5: Math.round(data.components.pm2_5),
                        pm10: Math.round(data.components.pm10)
                    },
                    qualityLevel: this.getAirQualityLevel(data.main.aqi)
                };
            })
        );
    }

    getGeoLocation(city: string): Observable<{ lat: number, lon: number }> {
        return this.http.get<any[]>(`${this.GEO_URL}/direct?q=${city}&limit=1&appid=${this.API_KEY}`).pipe(
            map(response => {
                if (!response || response.length === 0) {
                    throw new Error('Città non trovata');
                }
                console.log('Geo location data:', response); // Debug log
                return {
                    lat: response[0].lat,
                    lon: response[0].lon
                };
            }),
            catchError(error => {
                console.error('Error getting geolocation:', error);
                throw error;
            })
        );
    }

    private getAirQualityLevel(aqi: number): string {
        switch (aqi) {
            case 1: return 'Ottima';
            case 2: return 'Buona';
            case 3: return 'Moderata';
            case 4: return 'Scarsa';
            case 5: return 'Molto scarsa';
            default: return 'Non disponibile';
        }
    }

    getCitySuggestions(query: string, countryCode: string = this.DEFAULT_COUNTRY): Observable<CityAutocomplete[]> {
        if (!query || query.length < 3) return of([]);

        return this.http.get<any[]>(
            `${this.GEO_URL}/direct?q=${query}&limit=5&appid=${this.API_KEY}`
        ).pipe(
            map(cities => {
                console.log('Raw city data:', cities);
                return cities
                    .filter(city => city.country === countryCode)
                    .map(city => {
                        const cityName = city.local_names?.[this.getLanguageCode(countryCode)] || city.name;
                        const state = countryCode === 'IT' ? this.validateItalianRegion(city.state) : city.state;

                        return {
                            name: cityName,
                            country: this.getCountryName(city.country),
                            state: state,
                            lat: city.lat,
                            lon: city.lon
                        };
                    });
            }),
            catchError(error => {
                console.error('Error fetching city suggestions:', error);
                return of([]);
            })
        );
    }

    private getLanguageCode(countryCode: string): string {
        const languageCodes: { [key: string]: string } = {
            'IT': 'it',
            'FR': 'fr',
            'DE': 'de',
            'ES': 'es',
            'GB': 'en',
            'US': 'en'
        };
        return languageCodes[countryCode] || 'en';
    }

    private validateItalianRegion(state: string | undefined): string | undefined {
        const italianRegions = new Set([
            'Abruzzo',
            'Basilicata',
            'Calabria',
            'Campania',
            'Emilia-Romagna',
            'Friuli-Venezia Giulia',
            'Lazio',
            'Liguria',
            'Lombardia',
            'Marche',
            'Molise',
            'Piemonte',
            'Puglia',
            'Sardegna',
            'Sicilia',
            'Toscana',
            'Trentino-Alto Adige',
            'Umbria',
            'Valle d\'Aosta',
            'Veneto'
        ]);

        // Se lo stato è undefined o non è una regione italiana valida, ritorniamo undefined
        if (!state || !italianRegions.has(state)) {
            return undefined;
        }

        return state;
    }

    private getWindDirection(degrees: number): string {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        const index = Math.round(((degrees + 11.25) % 360) / 22.5);
        return directions[index % 16];
    }

    private getCountryName(countryCode: string): string {
        const countries: { [key: string]: string } = {
            'IT': 'Italia',
            'FR': 'Francia',
            'DE': 'Germania',
            'ES': 'Spagna',
            'GB': 'Regno Unito',
            'US': 'Stati Uniti',
            // Aggiungi altri paesi secondo necessità
        };
        return countries[countryCode] || countryCode;
    }
}

