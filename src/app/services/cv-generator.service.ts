import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class CvGeneratorService {
  private readonly MARGIN = 20;
  private readonly PAGE_WIDTH = 210;
  private readonly PAGE_HEIGHT = 297;
  private readonly CONTENT_WIDTH = 170;
  private readonly COLORS = {
    primary: { r: 41, g: 128, b: 185 },    // Professional blue
    secondary: { r: 44, g: 62, b: 80 },     // Dark slate
    text: { r: 52, g: 73, b: 94 },          // Soft black
    light: { r: 236, g: 240, b: 241 },      // Light gray
    white: { r: 255, g: 255, b: 255 }
  };

  constructor() { }

  async generateCV(profileImagePath: string) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add modern sidebar
    await this.addSidebar(doc, profileImagePath);

    // Add main content
    this.addMainContent(doc);

    // Save the PDF
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`Francesco_Sisti_CV_${timestamp}.pdf`);
  }

  private async addSidebar(doc: jsPDF, profileImagePath: string) {
    // Sidebar background
    doc.setFillColor(this.COLORS.primary.r, this.COLORS.primary.g, this.COLORS.primary.b);
    doc.rect(0, 0, 70, this.PAGE_HEIGHT, 'F');

    // Profile section with image handling
    try {
      // Create circular clip path
      doc.setFillColor(this.COLORS.white.r, this.COLORS.white.g, this.COLORS.white.b);
      doc.circle(35, 45, 25, 'F');

      // Load and add profile image if path is provided
      if (profileImagePath) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = profileImagePath;
        });
        doc.addImage(img, 'JPEG', 15, 25, 40, 40, undefined, 'MEDIUM');
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
      // Fallback: just show the white circle if image fails to load
    }

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(this.COLORS.white.r, this.COLORS.white.g, this.COLORS.white.b);
    doc.text('FRANCESCO', 10, 100, { align: 'left' });
    doc.text('SISTI', 10, 108, { align: 'left' });

    // Title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Full Stack Developer', 10, 120, { align: 'left' });

    // Contact Info
    this.addContactInfo(doc);

    // Skills
    this.addSkillsToSidebar(doc);
  }

  private addContactInfo(doc: jsPDF) {
    const startY = 140;
    const contacts = [
      { text: 'francescosisti61@gmail.com', link: 'mailto:francescosisti61@gmail.com' },
      { text: 'Verona, Italy' },
      { text: 'github.com/FrancescoSisti', link: 'https://github.com/FrancescoSisti' },
      { text: 'LinkedIn', link: 'https://linkedin.com/in/francesco-sisti-21b88023a' }
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(this.COLORS.white.r, this.COLORS.white.g, this.COLORS.white.b);

    contacts.forEach((contact, index) => {
      const y = startY + (index * 10);
      if (contact.link) {
        doc.setTextColor(this.COLORS.light.r, this.COLORS.light.g, this.COLORS.light.b);
        doc.text(contact.text, 10, y);
        doc.link(10, y - 3, 50, 5, { url: contact.link });
      } else {
        doc.text(contact.text, 10, y);
      }
    });
  }

  private addSkillsToSidebar(doc: jsPDF) {
    const startY = 190;

    // Skills Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.white.r, this.COLORS.white.g, this.COLORS.white.b);
    doc.text('SKILLS', 10, startY);

    // Skills Categories
    const skills = {
      'Frontend': ['Angular', 'TypeScript', 'HTML5', 'CSS3/SCSS'],
      'Backend': ['Node.js', 'Express', 'RESTful APIs'],
      'Database': ['MongoDB', 'SQL'],
      'Tools': ['Git', 'Docker']
    };

    let currentY = startY + 10;
    doc.setFontSize(10);

    Object.entries(skills).forEach(([category, items]) => {
      // Category
      doc.setFont('helvetica', 'bold');
      doc.text(category, 10, currentY);
      currentY += 5;

      // Skills
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      items.forEach(skill => {
        doc.text('• ' + skill, 12, currentY);
        currentY += 5;
      });
      currentY += 3;
    });
  }

  private addMainContent(doc: jsPDF) {
    const mainX = 80;
    let currentY = 30;

    // About Me Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(this.COLORS.secondary.r, this.COLORS.secondary.g, this.COLORS.secondary.b);
    doc.text('ABOUT ME', mainX, currentY);

    currentY += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(this.COLORS.text.r, this.COLORS.text.g, this.COLORS.text.b);
    const aboutText = 'Come sviluppatore Full Stack con base a Verona, unisco competenze tecniche e passione per il problem-solving per creare applicazioni web moderne ed efficienti. La mia formazione in Boolean Careers mi ha fornito solide basi sia nel frontend che nel backend.';
    const splitAbout = doc.splitTextToSize(aboutText, 120);
    doc.text(splitAbout, mainX, currentY);

    currentY += splitAbout.length * 7 + 15;

    // Experience Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(this.COLORS.secondary.r, this.COLORS.secondary.g, this.COLORS.secondary.b);
    doc.text('EXPERIENCE', mainX, currentY);

    currentY += 10;
    this.addExperience(doc, mainX, currentY);

    currentY += 50;

    // Education Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('EDUCATION', mainX, currentY);

    currentY += 10;
    this.addEducation(doc, mainX, currentY);
  }

  private addExperience(doc: jsPDF, x: number, y: number) {
    const experience = {
      title: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description: 'Sviluppo di applicazioni web moderne utilizzando Angular, Node.js e MongoDB.'
    };

    // Title and Company
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(this.COLORS.primary.r, this.COLORS.primary.g, this.COLORS.primary.b);
    doc.text(experience.title, x, y);

    // Period
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(this.COLORS.text.r, this.COLORS.text.g, this.COLORS.text.b);
    doc.text(experience.period, x, y + 5);

    // Company
    doc.setFont('helvetica', 'normal');
    doc.text(experience.company, x + 50, y + 5);

    // Description
    doc.setFontSize(11);
    const descLines = doc.splitTextToSize(experience.description, 120);
    doc.text(descLines, x, y + 12);
  }

  private addEducation(doc: jsPDF, x: number, y: number) {
    // School
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(this.COLORS.primary.r, this.COLORS.primary.g, this.COLORS.primary.b);
    doc.text('Boolean Careers', x, y);

    // Course and Year
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(this.COLORS.text.r, this.COLORS.text.g, this.COLORS.text.b);
    doc.text('Full Stack Development Course | 2023', x, y + 5);

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const details = [
      '• Intensive 6-month full-stack web development bootcamp',
      '• Focus on modern JavaScript frameworks and best practices',
      '• Development of real-world projects using Angular and Node.js'
    ];

    details.forEach((detail, index) => {
      doc.text(detail, x, y + 12 + (index * 6));
    });
  }
}
