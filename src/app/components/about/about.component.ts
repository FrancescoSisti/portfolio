import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvGeneratorService } from '../../services/cv-generator.service';
import { CvTemplateComponent } from '../cv-template/cv-template.component';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule, CvTemplateComponent, SafePipe]
})
export class AboutComponent {
  isGenerating = false;
  previewUrl: string | null = null;
  personalStory = 'Come sviluppatore Full Stack con base a Verona, unisco competenze tecniche e passione per il problem-solving per creare applicazioni web moderne ed efficienti. La mia formazione in Boolean Careers mi ha fornito solide basi sia nel frontend che nel backend.';
  personalStory2 = 'Mi impegno costantemente nell\'apprendimento di nuove tecnologie e best practices, con l\'obiettivo di sviluppare soluzioni web che siano non solo funzionali ma anche intuitive e piacevoli da utilizzare.';
  personalStory3 = 'Al di là della programmazione, coltivo diverse passioni legate al mondo tecnologico e creativo. Sono un appassionato lettore, principalmente di fantascienza e saggi tecnici, e mi dedico alla scrittura come hobby. Nel tempo libero, apprezzo i videogiochi, specialmente quelli che offrono sfide strategiche e narrative coinvolgenti.';
  personalStory4 = 'La mia curiosità per la tecnologia si estende anche ad altri ambiti dell\'informatica, come la personalizzazione del sistema operativo e l\'esplorazione di nuovi strumenti e software che possano migliorare il workflow quotidiano.';

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
