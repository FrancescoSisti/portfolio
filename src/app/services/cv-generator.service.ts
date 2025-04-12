import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class CvGeneratorService {
  private pdfDoc: jsPDF | null = null;
  private readonly PAGE_WIDTH = 210;
  private readonly PAGE_HEIGHT = 297;

  constructor() { }

  async generatePreview(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      throw new Error('Element not found');
    }

    // Store original styles
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;
    const originalVisibility = element.style.visibility;
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    const originalOpacity = element.style.opacity;

    try {
      // Make element visible for capture
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.visibility = 'visible';
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      element.style.opacity = '1';

      // Wait for fonts and styles to load
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting PDF generation...');

      // Add print-specific class to prepare for printing
      element.classList.add('printing');

      // Create canvas with better quality and resource handling
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        imageTimeout: 15000,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          console.log('Cloning document...');
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.position = 'fixed';
            clonedElement.style.left = '0';
            clonedElement.style.top = '0';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.classList.add('printing');

            // Ensure Font Awesome is loaded in the clone
            const fontAwesomeLink = clonedDoc.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            clonedDoc.head.appendChild(fontAwesomeLink);
          }

          // Copy styles
          Array.from(document.styleSheets).forEach(styleSheet => {
            try {
              const cssRules = Array.from(styleSheet.cssRules || []);
              const style = clonedDoc.createElement('style');
              style.innerHTML = cssRules.map(rule => rule.cssText).join('\n');
              clonedDoc.head.appendChild(style);
            } catch (e: unknown) {
              // Ignore CORS errors for external stylesheets
              if (e instanceof Error && !e.message.includes('CSSStyleSheet.cssRules')) {
                console.warn('Could not copy styles', e);
              }
            }
          });
        }
      });

      // Calculate dimensions
      const imgWidth = this.PAGE_WIDTH;
      const pageHeight = this.PAGE_HEIGHT;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      this.pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      // Add the image with better quality
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Handle multiple pages with better page breaks
      const totalPages = Math.ceil(imgHeight / pageHeight);
      let heightLeft = imgHeight;

      for (let i = 0; i < totalPages; i++) {
        // For the first page
        if (i === 0) {
          this.pdfDoc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');
        } else {
          // For subsequent pages
          this.pdfDoc.addPage();
          this.pdfDoc.addImage(
            imgData,
            'JPEG',
            0,
            -pageHeight * i,
            imgWidth,
            imgHeight,
            '',
            'FAST'
          );
        }

        heightLeft -= pageHeight;
      }

      // Remove print-specific class
      element.classList.remove('printing');

      // Generate preview URL with better quality
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Francesco_Sisti_Curriculum_Vitae_${timestamp}.pdf`;
      const previewUrl = this.pdfDoc.output('datauristring', {
        filename: filename
      });
      return previewUrl;

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      // Restore original styles
      element.style.position = originalPosition;
      element.style.left = originalLeft;
      element.style.top = originalTop;
      element.style.visibility = originalVisibility;
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
      element.style.opacity = originalOpacity;
      element.classList.remove('printing');
    }
  }

  downloadCV(): void {
    if (this.pdfDoc) {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Francesco_Sisti_Curriculum_Vitae_${timestamp}.pdf`;

      // Crea un blob dal PDF
      const blob = this.pdfDoc.output('blob');

      // Crea un URL per il blob
      const url = window.URL.createObjectURL(blob);

      // Crea un elemento anchor temporaneo
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Aggiungi l'elemento al DOM, cliccalo e rimuovilo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Pulisci l'URL del blob
      window.URL.revokeObjectURL(url);
    } else {
      console.error('No PDF document available. Generate it first.');
    }
  }
}

