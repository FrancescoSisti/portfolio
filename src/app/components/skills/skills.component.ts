import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Command {
  type: 'input' | 'output';
  text: string;
  status?: 'error' | 'success' | 'info';
}

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  time: string;
  options?: string[];
}

interface WeatherData {
  forecast: WeatherForecast[];
}

interface WeatherForecast {
  date: string;
  temp: number;
  condition: string;
  icon: string;
}

interface ColorTheme {
  name: string;
  colors: string[];
  isDefault?: boolean;
}

interface FileSystemItem {
  type: 'file' | 'dir';
  content: string | { [key: string]: FileSystemItem };
}

interface FileSystem {
  '~': FileSystemItem;
}

const weatherIcons = {
  sun: 'fas fa-sun',
  cloud: 'fas fa-cloud',
  rain: 'fas fa-cloud-rain',
  storm: 'fas fa-bolt',
  snow: 'fas fa-snowflake'
} as const;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class SkillsComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly OPENWEATHER_API_KEY = 'YOUR_API_KEY';
  private readonly OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly STORAGE_KEYS = {
    THEMES: 'portfolio_saved_themes',
    LOCATIONS: 'portfolio_recent_locations'
  };
  private isBrowser: boolean;

  // Weather Widget
  locationQuery = '';
  recentLocations: string[] = [];
  weatherData: WeatherData | null = null;
  isLoadingWeather = false;

  // Chatbot Widget
  chatInput = '';
  chatMessages: ChatMessage[] = [];
  private readonly chatResponses = {
    competenze: {
      text: 'Le mie competenze principali includono:',
      options: [
        'Frontend Development (Angular, React, Vue.js)',
        'Backend Development (Node.js, PHP)',
        'Database Management (SQL, MongoDB)',
        'DevOps & Cloud (Docker, AWS)',
        'Mobile Development (React Native)'
      ]
    },
    progetti: {
      text: 'Ecco alcuni dei miei progetti più significativi:',
      options: [
        'Portfolio Interattivo - Angular & TypeScript',
        'E-commerce Platform - MERN Stack',
        'CMS Headless - Node.js & GraphQL',
        'Mobile App - React Native',
        'Mostra altri progetti'
      ]
    },
    contatti: {
      text: 'Puoi contattarmi attraverso:',
      options: [
        'Email: example@domain.com',
        'LinkedIn: /in/yourprofile',
        'GitHub: @yourusername',
        'Twitter: @yourhandle'
      ]
    },
    default: {
      text: 'Posso aiutarti con informazioni su:',
      options: [
        'Le mie competenze tecniche',
        'I progetti realizzati',
        'Come contattarmi',
        'Il mio background'
      ]
    },
    background: {
      text: 'Il mio background professionale include:',
      options: [
        'Laurea in Informatica',
        'Certificazioni professionali',
        'Esperienze lavorative',
        'Progetti personali'
      ]
    }
  };

  // Terminal Widget
  terminalInput = '';
  currentDirectory = '~';
  commandHistory: Command[] = [];
  commandIndex = -1;
  private commandBuffer: string[] = [];
  private readonly MAX_HISTORY = 50;

  // Color Picker Widget
  newThemeName = '';
  currentTheme: ColorTheme;
  savedThemes: ColorTheme[] = [];
  private readonly defaultThemes: ColorTheme[] = [
    {
      name: 'Ocean',
      colors: ['#4facfe', '#00f2fe', '#a8edea'],
      isDefault: true
    },
    {
      name: 'Sunset',
      colors: ['#ff6b6b', '#feca57', '#ff9f43'],
      isDefault: true
    },
    {
      name: 'Forest',
      colors: ['#1dd1a1', '#10ac84', '#2ecc71'],
      isDefault: true
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentTheme = this.defaultThemes[0];
    if (this.isBrowser) {
      this.loadSavedData();
    }
    this.initializeChat();
  }

  ngOnInit() {
    this.initializeTerminal();
    if (this.isBrowser) {
      this.applyTheme(this.currentTheme);
    }
  }

  // Weather Widget Methods
  async searchLocation() {
    if (!this.locationQuery.trim() || this.isLoadingWeather) return;

    this.isLoadingWeather = true;
    try {
      // Simulate API call (replace with actual API call when key is available)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockWeatherData: WeatherData = {
        forecast: [
          { date: 'Oggi', temp: Math.round(15 + Math.random() * 10), condition: 'Soleggiato', icon: 'fa-sun' },
          { date: 'Domani', temp: Math.round(15 + Math.random() * 10), condition: 'Nuvoloso', icon: 'fa-cloud' },
          { date: 'Dopodomani', temp: Math.round(15 + Math.random() * 10), condition: 'Pioggia', icon: 'fa-cloud-rain' }
        ]
      };

      this.weatherData = mockWeatherData;
      this.updateRecentLocations(this.locationQuery);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      this.isLoadingWeather = false;
    }
  }

  selectLocation(location: string) {
    this.locationQuery = location;
    this.searchLocation();
  }

  private updateRecentLocations(location: string) {
    if (!this.isBrowser) return;

    if (!this.recentLocations.includes(location)) {
      this.recentLocations = [location, ...this.recentLocations].slice(0, 3);
      localStorage.setItem(this.STORAGE_KEYS.LOCATIONS, JSON.stringify(this.recentLocations));
    }
  }

  // Chatbot Widget Methods
  private initializeChat() {
    this.addBotMessage(this.chatResponses.default.text, this.chatResponses.default.options);
  }

  sendMessage() {
    if (!this.chatInput.trim()) return;

    this.addUserMessage(this.chatInput);
    const input = this.chatInput.toLowerCase();
    this.chatInput = '';

    setTimeout(() => {
      let response = this.chatResponses.default;

      if (input.includes('competen')) {
        response = this.chatResponses.competenze;
      } else if (input.includes('progett')) {
        response = this.chatResponses.progetti;
      } else if (input.includes('contatt')) {
        response = this.chatResponses.contatti;
      } else if (input.includes('background') || input.includes('esperien')) {
        response = this.chatResponses.background;
      }

      this.addBotMessage(response.text, response.options);
    }, 500);
  }

  selectChatOption(option: string) {
    this.addUserMessage(option);

    setTimeout(() => {
      switch (option) {
        case 'Mostra altri progetti':
          this.addBotMessage('Altri progetti interessanti:', [
            'API Gateway - Kong & Node.js',
            'Machine Learning Model - Python & TensorFlow',
            'IoT Dashboard - Angular & Socket.io'
          ]);
          break;
        case 'Certificazioni professionali':
          this.addBotMessage('Le mie certificazioni:', [
            'AWS Certified Developer',
            'Google Cloud Professional',
            'MongoDB Certified Developer'
          ]);
          break;
        default:
          this.addBotMessage('Vuoi sapere altro su:', this.chatResponses.default.options);
      }
    }, 500);
  }

  private addUserMessage(text: string) {
    this.chatMessages.push({
      type: 'user',
      text,
      time: new Date().toLocaleTimeString()
    });
    this.scrollChatToBottom();
  }

  private addBotMessage(text: string, options?: string[]) {
    this.chatMessages.push({
      type: 'bot',
      text,
      time: new Date().toLocaleTimeString(),
      options
    });
    this.scrollChatToBottom();
  }

  private scrollChatToBottom() {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  // Terminal Widget Methods
  private initializeTerminal() {
    this.addCommandOutput('Terminal inizializzato. Digita "help" per vedere i comandi disponibili.', 'info');
  }

  handleTerminalKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.executeCommand();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateCommandHistory(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateCommandHistory(1);
        break;
      case 'Tab':
        event.preventDefault();
        this.autocompleteCommand();
        break;
    }
  }

  private executeCommand() {
    if (!this.terminalInput.trim()) return;

    this.commandHistory.push({
      type: 'input',
      text: this.terminalInput
    });

    this.commandBuffer = [...this.commandBuffer, this.terminalInput].slice(-this.MAX_HISTORY);
    const [command, ...args] = this.terminalInput.split(' ');
    this.terminalInput = '';
    this.commandIndex = -1;

    switch (command.toLowerCase()) {
      case 'help':
        this.addCommandOutput(`
Comandi disponibili:
  help     - Mostra questo messaggio
  clear    - Pulisce il terminale
  echo     - Ripete il testo inserito
  pwd      - Mostra la directory corrente
  ls       - Lista i file nella directory
  date     - Mostra la data e ora corrente
  whoami   - Mostra informazioni sull'utente
  history  - Mostra la cronologia dei comandi
  weather  - Mostra le previsioni del tempo
  theme    - Gestisce i temi del portfolio`, 'info');
        break;

      case 'clear':
        this.commandHistory = [];
        break;

      case 'echo':
        this.addCommandOutput(args.join(' ') || '', 'success');
        break;

      case 'pwd':
        this.addCommandOutput(this.currentDirectory, 'success');
        break;

      case 'date':
        this.addCommandOutput(new Date().toLocaleString(), 'success');
        break;

      case 'whoami':
        this.addCommandOutput('Developer & Tech Enthusiast', 'success');
        break;

      case 'history':
        const history = this.commandBuffer
          .map((cmd, i) => `${i + 1}  ${cmd}`)
          .join('\n');
        this.addCommandOutput(history, 'info');
        break;

      case 'weather':
        if (this.weatherData) {
          const forecast = this.weatherData.forecast
            .map(f => `${f.date}: ${f.temp}°C, ${f.condition}`)
            .join('\n');
          this.addCommandOutput(forecast, 'info');
        } else {
          this.addCommandOutput('Nessun dato meteo disponibile. Usa il widget meteo per cercare una località.', 'error');
        }
        break;

      case 'theme':
        if (args[0] === 'list') {
          const themes = this.savedThemes
            .map(t => `${t.name}${t === this.currentTheme ? ' (active)' : ''}`)
            .join('\n');
          this.addCommandOutput(themes || 'Nessun tema salvato', 'info');
        } else if (args[0] === 'apply' && args[1]) {
          const theme = this.savedThemes.find(t => t.name.toLowerCase() === args[1].toLowerCase());
          if (theme) {
            this.applyTheme(theme);
            this.addCommandOutput(`Tema "${theme.name}" applicato`, 'success');
          } else {
            this.addCommandOutput(`Tema "${args[1]}" non trovato`, 'error');
          }
        } else {
          this.addCommandOutput('Uso: theme list | theme apply <nome>', 'error');
        }
        break;

      case 'ls':
        this.addCommandOutput(this.listDirectory(), 'info');
        break;

      case 'cd':
        const result = this.changeDirectory(args[0] || '~');
        if (result) {
          this.addCommandOutput(result, 'error');
        }
        break;

      default:
        this.addCommandOutput(`Comando non riconosciuto: ${command}. Digita "help" per vedere i comandi disponibili.`, 'error');
    }
  }

  private addCommandOutput(text: string, status: 'error' | 'success' | 'info') {
    this.commandHistory.push({
      type: 'output',
      text,
      status
    });
  }

  private navigateCommandHistory(direction: number) {
    if (this.commandBuffer.length === 0) return;

    this.commandIndex = Math.max(
      -1,
      Math.min(
        this.commandBuffer.length - 1,
        this.commandIndex + direction
      )
    );

    if (this.commandIndex === -1) {
      this.terminalInput = '';
    } else {
      this.terminalInput = this.commandBuffer[this.commandBuffer.length - 1 - this.commandIndex];
    }
  }

  private autocompleteCommand() {
    const commands = [
      'help', 'clear', 'echo', 'pwd', 'ls', 'date', 'whoami',
      'history', 'weather', 'theme'
    ];

    const input = this.terminalInput.toLowerCase();
    const matches = commands.filter(cmd => cmd.startsWith(input));

    if (matches.length === 1) {
      this.terminalInput = matches[0];
    } else if (matches.length > 1) {
      this.addCommandOutput(matches.join('  '), 'info');
    }
  }

  private initializeFileSystem() {
    const fileSystem: FileSystem = {
      '~': {
        type: 'dir',
        content: {
          'README.md': {
            type: 'file',
            content: 'Welcome to my portfolio terminal!\nType "help" to see available commands.'
          },
          'projects': {
            type: 'dir',
            content: {
              'portfolio.md': {
                type: 'file',
                content: 'Interactive Portfolio\n- Built with Angular\n- Features multiple interactive widgets'
              },
              'other-projects.md': {
                type: 'file',
                content: 'Other Projects\n- E-commerce Platform\n- CMS System\n- Mobile Apps'
              }
            }
          },
          'skills': {
            type: 'dir',
            content: {
              'frontend.md': {
                type: 'file',
                content: 'Frontend Skills\n- Angular\n- React\n- Vue.js'
              },
              'backend.md': {
                type: 'file',
                content: 'Backend Skills\n- Node.js\n- PHP\n- Python'
              }
            }
          }
        }
      }
    };

    return fileSystem;
  }

  private getCurrentDirectory(): FileSystemItem {
    const parts = this.currentDirectory.split('/').filter(Boolean);
    let current = this.initializeFileSystem()['~'];

    for (const part of parts) {
      if (current.type === 'dir' && typeof current.content === 'object') {
        current = current.content[part] as FileSystemItem;
      }
    }

    return current;
  }

  private listDirectory(): string {
    const current = this.getCurrentDirectory();
    if (current.type !== 'dir' || typeof current.content !== 'object') {
      return 'Not a directory';
    }

    const entries = Object.entries(current.content);
    const dirs = entries
      .filter(([_, item]) => item.type === 'dir')
      .map(([name]) => `${name}/`);
    const files = entries
      .filter(([_, item]) => item.type === 'file')
      .map(([name]) => name);

    return [...dirs, ...files].join('\n');
  }

  private changeDirectory(path: string): string {
    if (path === '..') {
      const parts = this.currentDirectory.split('/').filter(Boolean);
      if (parts.length > 0) {
        parts.pop();
        this.currentDirectory = parts.length ? `~/${parts.join('/')}` : '~';
        return '';
      }
      return 'Already at root';
    }

    const targetPath = path.startsWith('~') ? path : `${this.currentDirectory}/${path}`.replace('//', '/');
    const parts = targetPath.split('/').filter(Boolean);
    let current = this.initializeFileSystem()['~'];

    for (const part of parts) {
      if (current.type !== 'dir' || typeof current.content !== 'object' || !current.content[part]) {
        return `Directory not found: ${path}`;
      }
      current = current.content[part] as FileSystemItem;
    }

    if (current.type !== 'dir') {
      return `Not a directory: ${path}`;
    }

    this.currentDirectory = targetPath;
    return '';
  }

  // Color Picker Widget Methods
  saveTheme() {
    if (!this.newThemeName.trim()) return;

    const theme: ColorTheme = {
      name: this.newThemeName,
      colors: [...this.currentTheme.colors]
    };

    if (!this.savedThemes.some(t => t.name === theme.name)) {
      this.savedThemes = [...this.savedThemes, theme];
      this.saveToPersistentStorage();
      this.newThemeName = '';
    }
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '79, 172, 254'; // default fallback
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }

  applyTheme(theme: ColorTheme) {
    if (!this.isBrowser) return;

    this.currentTheme = { ...theme };
    const root = document.documentElement;

    // Set main colors
    root.style.setProperty('--primary-color', theme.colors[0]);
    root.style.setProperty('--secondary-color', theme.colors[1]);
    root.style.setProperty('--accent-color', theme.colors[2]);

    // Set RGB values for opacity/rgba usage
    root.style.setProperty('--primary-color-rgb', this.hexToRgb(theme.colors[0]));
    root.style.setProperty('--secondary-color-rgb', this.hexToRgb(theme.colors[1]));
    root.style.setProperty('--accent-color-rgb', this.hexToRgb(theme.colors[2]));
  }

  private loadSavedData() {
    if (!this.isBrowser) return;

    try {
      const savedThemes = localStorage.getItem(this.STORAGE_KEYS.THEMES);
      if (savedThemes) {
        this.savedThemes = [...this.defaultThemes, ...JSON.parse(savedThemes)];
      } else {
        this.savedThemes = [...this.defaultThemes];
      }

      const savedLocations = localStorage.getItem(this.STORAGE_KEYS.LOCATIONS);
      if (savedLocations) {
        this.recentLocations = JSON.parse(savedLocations);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      this.savedThemes = [...this.defaultThemes];
    }
  }

  private saveToPersistentStorage() {
    if (!this.isBrowser) return;

    const themesToSave = this.savedThemes.filter(theme => !theme.isDefault);
    localStorage.setItem(this.STORAGE_KEYS.THEMES, JSON.stringify(themesToSave));
  }

  // Shared Widget Methods
  toggleFullscreen(event: MouseEvent) {
    if (!this.isBrowser) return;

    const widget = (event.target as HTMLElement).closest('.widget') as HTMLElement;
    if (widget) {
      widget.classList.toggle('fullscreen');
      if (widget.classList.contains('chatbot')) {
        this.scrollChatToBottom();
      }
    }
  }
}
