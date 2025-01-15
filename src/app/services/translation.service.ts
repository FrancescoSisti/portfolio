import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'it';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<Language>('en');
  currentLang$ = this.currentLang.asObservable();

  translations = {
    en: {
      // Navbar
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      welcome: 'Welcome',
      aboutMe: 'About Me',
      myWork: 'My Work',
      myExpertise: 'My Expertise',
      getInTouch: 'Get in Touch',
      welcomeDesc: 'Modern and creative portfolio showcase',
      aboutDesc: 'Learn about my journey and experience',
      projectsDesc: 'Explore my latest projects and experiments',
      skillsDesc: 'Discover my technical skills and proficiency',
      contactDesc: 'Let\'s discuss your next project',
      basedIn: 'Based in',
      availableFor: 'Available for Freelance',

      // Home
      heroTitle: 'Creative Full Stack',
      heroSubtitle: 'Developer 2024',
      heroText: 'Crafting beautiful and functional web experiences with modern technologies',
      yearsExp: 'Years Experience',
      projectsCompleted: 'Projects Completed',
      happyClients: 'Happy Clients',
      viewProjects: 'View Projects',
      letsTalk: 'Let\'s Talk',
      techStack: 'Tech Stack',

      // About
      aboutTitle: 'Passionate about creating',
      aboutSubtitle: 'digital experiences',
      myStory: 'My Story',
      storyText: 'With over 3 years of experience in web development, I\'ve had the privilege of working on diverse projects that have shaped my expertise in creating modern, user-centric applications.',
      whatIDo: 'What I Do',
      webDev: 'Web Development',
      webDevDesc: 'Creating responsive and performant web applications using modern frameworks and best practices.',
      uiDesign: 'UI Design',
      uiDesignDesc: 'Designing intuitive and beautiful user interfaces that enhance user experience.',
      backendDev: 'Backend Development',
      backendDevDesc: 'Building robust and scalable server-side solutions with modern technologies.',

      // Projects
      featuredProjects: 'Featured Projects',
      projectsSubtitle: 'A collection of my best work and personal projects',
      viewLive: 'View Live',
      sourceCode: 'Source Code',
      otherProjects: 'Other Noteworthy Projects',
      moreOnGithub: 'More Projects on GitHub',

      // Skills
      technicalSkills: 'Technical Skills',
      skillsSubtitle: 'A showcase of my technical expertise and proficiency',
      frontendDev: 'Frontend Development',
      backendTech: 'Backend Technologies',
      toolsAndMore: 'Tools & More',
      otherSkills: 'Additional Skills',

      // Contact
      contactTitle: 'Let\'s Create Something',
      contactSubtitle: 'Great Together',
      contactText: 'I\'m always interested in hearing about new projects and opportunities.',
      emailMe: 'Email Me',
      findMe: 'Find Me',
      formName: 'Name',
      formEmail: 'Email',
      formSubject: 'Subject',
      formMessage: 'Message',
      sendMessage: 'Send Message',

      // Footer
      copyright: '© 2024 All rights reserved.',
      madeWith: 'Made with',
      followMe: 'Follow Me'
    },
    it: {
      // Navbar
      home: 'Home',
      about: 'Chi Sono',
      projects: 'Progetti',
      skills: 'Competenze',
      contact: 'Contatti',
      welcome: 'Benvenuto',
      aboutMe: 'Chi Sono',
      myWork: 'I Miei Lavori',
      myExpertise: 'Le Mie Competenze',
      getInTouch: 'Contattami',
      welcomeDesc: 'Portfolio moderno e creativo',
      aboutDesc: 'Scopri il mio percorso e la mia esperienza',
      projectsDesc: 'Esplora i miei ultimi progetti e esperimenti',
      skillsDesc: 'Scopri le mie competenze tecniche',
      contactDesc: 'Parliamo del tuo prossimo progetto',
      basedIn: 'Basato a',
      availableFor: 'Disponibile per Freelance',

      // Home
      heroTitle: 'Creative Full Stack',
      heroSubtitle: 'Developer 2024',
      heroText: 'Creo esperienze web belle e funzionali con tecnologie moderne',
      yearsExp: 'Anni di Esperienza',
      projectsCompleted: 'Progetti Completati',
      happyClients: 'Clienti Soddisfatti',
      viewProjects: 'Vedi Progetti',
      letsTalk: 'Parliamone',
      techStack: 'Tecnologie',

      // About
      aboutTitle: 'Appassionato di creare',
      aboutSubtitle: 'esperienze digitali',
      myStory: 'La Mia Storia',
      storyText: 'Con oltre 3 anni di esperienza nello sviluppo web, ho avuto il privilegio di lavorare su progetti diversi che hanno plasmato la mia competenza nella creazione di applicazioni moderne e incentrate sull\'utente.',
      whatIDo: 'Cosa Faccio',
      webDev: 'Sviluppo Web',
      webDevDesc: 'Creo applicazioni web responsive e performanti utilizzando framework moderni e best practice.',
      uiDesign: 'UI Design',
      uiDesignDesc: 'Progetto interfacce utente intuitive e belle che migliorano l\'esperienza utente.',
      backendDev: 'Sviluppo Backend',
      backendDevDesc: 'Costruisco soluzioni server-side robuste e scalabili con tecnologie moderne.',

      // Projects
      featuredProjects: 'Progetti in Evidenza',
      projectsSubtitle: 'Una raccolta dei miei migliori lavori e progetti personali',
      viewLive: 'Vedi Live',
      sourceCode: 'Codice Sorgente',
      otherProjects: 'Altri Progetti Degni di Nota',
      moreOnGithub: 'Altri Progetti su GitHub',

      // Skills
      technicalSkills: 'Competenze Tecniche',
      skillsSubtitle: 'Una panoramica delle mie competenze tecniche e della mia esperienza',
      frontendDev: 'Sviluppo Frontend',
      backendTech: 'Tecnologie Backend',
      toolsAndMore: 'Strumenti e Altro',
      otherSkills: 'Competenze Aggiuntive',

      // Contact
      contactTitle: 'Creiamo Qualcosa di',
      contactSubtitle: 'Grande Insieme',
      contactText: 'Sono sempre interessato a sentire parlare di nuovi progetti e opportunità.',
      emailMe: 'Scrivimi',
      findMe: 'Trovami',
      formName: 'Nome',
      formEmail: 'Email',
      formSubject: 'Oggetto',
      formMessage: 'Messaggio',
      sendMessage: 'Invia Messaggio',

      // Footer
      copyright: '© 2024 Tutti i diritti riservati.',
      madeWith: 'Fatto con',
      followMe: 'Seguimi'
    }
  };

  constructor() { }

  setLanguage(lang: Language) {
    this.currentLang.next(lang);
  }

  getCurrentLang(): Language {
    return this.currentLang.value;
  }

  translate(key: string): string {
    const lang = this.getCurrentLang();
    return this.translations[lang][key as keyof typeof this.translations[typeof lang]] || key;
  }
}
