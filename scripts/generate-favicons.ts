import { FaviconSettings, MasterIcon, generateFaviconFiles, generateFaviconHtml, IconTransformationType } from '@realfavicongenerator/generate-favicon';
import { getNodeImageAdapter, loadAndConvertToSvg } from "@realfavicongenerator/image-adapter-node";
import * as fs from 'fs/promises';
import * as path from 'path';

async function generateFavicons() {
  try {
    const imageAdapter = await getNodeImageAdapter();

    // Carica l'icona master
    const masterIcon: MasterIcon = {
      icon: await loadAndConvertToSvg(path.join(__dirname, '../src/assets/icons/favicon.svg')),
    }

    const iconTransformation = {
      type: IconTransformationType.None,
      backgroundRadius: 0.08,
      backgroundColor: "#ffffff",
      imageScale: 1,
      brightness: 0
    };

    const faviconSettings: FaviconSettings = {
      icon: {
        desktop: {
          regularIconTransformation: iconTransformation,
          darkIconTransformation: iconTransformation,
          darkIconType: "none",
        },
        touch: {
          transformation: iconTransformation,
          appTitle: "Francesco Sisti"
        },
        webAppManifest: {
          transformation: iconTransformation,
          backgroundColor: "#ffffff",
          themeColor: "#4f46e5",
          name: "Francesco Sisti • Full Stack Developer",
          shortName: "Francesco Sisti"
        }
      },
      path: "/assets/icons/",
    };

    // Genera i file delle favicon
    const files = await generateFaviconFiles(masterIcon, faviconSettings, imageAdapter);

    // Crea la directory di output se non esiste
    const outputDir = path.join(__dirname, '../src/assets/icons');
    await fs.mkdir(outputDir, { recursive: true });

    // Salva i file generati
    for (const [filename, content] of Object.entries(files)) {
      // Estrai solo il nome del file dal percorso completo
      const basename = path.basename(filename);
      const filePath = path.join(outputDir, basename);

      if (content instanceof Blob) {
        const buffer = Buffer.from(await content.arrayBuffer());
        await fs.writeFile(filePath, buffer);
      } else if (Buffer.isBuffer(content)) {
        await fs.writeFile(filePath, content);
      } else if (typeof content === 'string') {
        await fs.writeFile(filePath, content);
      }
      console.log(`Generated: ${basename} in ${outputDir}`);
    }

    // Genera l'HTML
    const markups = await generateFaviconHtml(faviconSettings);

    // Aggiorna index.html
    const indexPath = path.join(__dirname, '../src/index.html');
    let indexContent = await fs.readFile(indexPath, 'utf-8');

    // Sostituisci la sezione delle favicon
    const startComment = '<!-- Favicon -->';
    const endComment = '<!-- Font Awesome -->';
    const startIndex = indexContent.indexOf(startComment);
    const endIndex = indexContent.indexOf(endComment);

    if (startIndex !== -1 && endIndex !== -1) {
      const faviconSection = `${startComment}
  <link rel="icon" type="image/png" href="assets/icons/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg" />
  <link rel="shortcut icon" href="assets/icons/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png" />
  <link rel="manifest" href="assets/icons/site.webmanifest" />

  `;

      indexContent =
        indexContent.substring(0, startIndex) +
        faviconSection +
        endComment +
        indexContent.substring(endIndex + endComment.length);

      await fs.writeFile(indexPath, indexContent);
      console.log('Updated index.html with new favicon tags');
    }

    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
