import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvGeneratorService } from '../../services/cv-generator.service';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-cv-template',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './cv-template.component.html',
  styleUrls: ['./cv-template.component.scss']
})
export class CvTemplateComponent {
  isGenerating = false;

  constructor(private cvGenerator: CvGeneratorService) { }

  async downloadPDF(): Promise<void> {
    if (this.isGenerating) return;

    this.isGenerating = true;
    try {
      await this.cvGenerator.downloadCV();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      this.isGenerating = false;
    }
  }
}
