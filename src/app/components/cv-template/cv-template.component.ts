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
  previewUrl: string | null = null;

  constructor(private cvGenerator: CvGeneratorService) { }

  async generatePreview(): Promise<void> {
    if (this.isGenerating) return;

    this.isGenerating = true;
    try {
      this.previewUrl = await this.cvGenerator.generatePreview('cv-template');
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async downloadPDF(): Promise<void> {
    if (!this.previewUrl) return;

    try {
      await this.cvGenerator.downloadCV();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }
}
