import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AboutComponent {
  personalStory = 'Come sviluppatore Full Stack con sede a Verona, combino competenze tecniche con problem-solving creativo per costruire applicazioni web moderne. Il mio percorso nello sviluppo web mi ha fornito una profonda comprensione delle tecnologie sia frontend che backend.';
  personalStory2 = 'Mi impegno a creare codice pulito ed efficiente e interfacce user-friendly che fanno la differenza nelle esperienze digitali delle persone.';
}
