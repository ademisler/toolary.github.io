/**
 * Coffee Messages System
 * Contains friendly developer support messages for all tools
 * Messages are displayed after successful tool operations
 */

// Message data structure for all 24 tools
const MESSAGES = {
  'color-picker': {
    tr: "Bu rengi bulana kadar 3 kahve içtim, 2 sinir krizi geçirdim. Bir fincanla moral olur!",
    en: "I drank three coffees and had two minor breakdowns to find this color. A refill would boost morale!",
    fr: "J'ai bu trois cafés et fait deux crises de nerfs pour trouver cette couleur. Un autre café pour le moral ?"
  },
  'element-picker': {
    tr: "Bu kadar CSS selector'la uğraşınca kahve değil, intravenöz espresso lazım!",
    en: "After dealing with this many CSS selectors, I don't need coffee—I need espresso in an IV drip!",
    fr: "Après autant de sélecteurs CSS, j'ai besoin d'un espresso en perfusion, pas d'un simple café !"
  },
  'link-picker': {
    tr: "404 kahve bulunamadı. Düzeltmek ister misin?",
    en: "Error 404: Coffee not found. Would you like to fix that?",
    fr: "Erreur 404 : Café introuvable. Tu veux corriger ça ?"
  },
  'font-picker': {
    tr: "Tipografi savaşında 4 sigara içtim, kahvem bitti!",
    en: "Four cigarettes and one empty mug later, the typography war is won!",
    fr: "Quatre cigarettes et une tasse vide plus tard, la guerre typographique est gagnée !"
  },
  'media-picker': {
    tr: "Bu kadar görseli yakalarken RAM'im değil, kahvem tükendi.",
    en: "While fetching all these media files, it wasn't my RAM that ran out—it was my coffee.",
    fr: "En récupérant tous ces médias, ce n'est pas ma RAM qui a manqué, mais mon café."
  },
  'text-picker': {
    tr: "Metni çıkardım, anlamı kaldı. Kahve olsaydı belki onu da anlardım.",
    en: "Extracted the text, but the meaning stayed behind. Maybe coffee could've helped me find it.",
    fr: "J'ai extrait le texte, mais le sens s'est enfui. Avec un café, j'aurais peut-être compris."
  },
  'screenshot-picker': {
    tr: "Screenshot çekerken fare değil elim titredi, kahve eksikliğinden.",
    en: "While taking the screenshot, it wasn't the mouse that shook—it was my hand, from lack of coffee.",
    fr: "En prenant la capture d'écran, ce n'est pas la souris qui tremblait, c'était ma main… faute de café."
  },
  'pdf-generator': {
    tr: "PDF'yi oluştururken kahvem bitmişti. O yüzden köşeler hafif sinirli olabilir.",
    en: "My coffee ran out while generating this PDF—so forgive the slightly grumpy corners.",
    fr: "Mon café s'est vidé pendant la création du PDF. Les coins sont peut-être un peu nerveux."
  },
  'qr-code-generator': {
    tr: "Bu kare kodun her pikselinde bir kahve kırıntısı var.",
    en: "Every pixel in this QR code contains a trace of caffeine and despair.",
    fr: "Chaque pixel de ce QR code contient une trace de caféine et un soupçon de désespoir."
  },
  'video-recorder': {
    tr: "Video kaydı tamam, ama kamerada değil kahvede fokuslanmışım.",
    en: "Video recording complete—but I accidentally focused on my coffee instead of the screen.",
    fr: "Enregistrement terminé, mais j'ai fait la mise au point sur mon café au lieu de l'écran."
  },
  'sticky-notes-picker': {
    tr: "Bir de 'kahve al' notu ekle, ne olur ne olmaz.",
    en: "Maybe add another one that says 'Buy coffee,' just in case.",
    fr: "Ajoute aussi une note qui dit 'Acheter du café', on ne sait jamais."
  },
  'reading-mode': {
    tr: "Okuma modu: aktif. Sosyal hayat: pasif. Kahve: yok.",
    en: "Reading mode: ON. Social life: OFF. Coffee: EMPTY.",
    fr: "Mode lecture : activé. Vie sociale : désactivée. Café : inexistant."
  },
  'text-highlighter': {
    tr: "Highlight tamam, göz altı morlukları da cabası.",
    en: "Highlight done. Dark circles included for free.",
    fr: "Surlignage terminé. Les cernes sont offerts."
  },
  'bookmark-manager': {
    tr: "Favorilere ekledim. Keşke kahve de favori listeme düşse.",
    en: "Added to favorites. Wish coffee could be bookmarked too.",
    fr: "Ajouté aux favoris. Dommage qu'on ne puisse pas mettre le café en favori."
  },
  'dark-mode-toggle': {
    tr: "Karanlık modda bile kahve ışık saçıyor.",
    en: "Even in dark mode, coffee still shines bright.",
    fr: "Même en mode sombre, le café continue de briller."
  },
  'site-info-picker': {
    tr: "Sitenin tüm bilgilerini buldum. Tek eksik: kahve menüsü.",
    en: "Collected all site info. Only thing missing? The coffee menu.",
    fr: "J'ai trouvé toutes les infos du site. Il ne manque que le menu café."
  },
  'color-palette-generator': {
    tr: "Bu paleti yaparken kahvemi renk paletine döktüm. Tüh...",
    en: "I spilled my coffee on the color palette. That's why it looks so warm.",
    fr: "J'ai renversé mon café sur la palette de couleurs. C'est pour ça qu'elle est si chaleureuse."
  },
  'copy-history-manager': {
    tr: "Tüm kopyaları tuttum, ama kahve molasını kaçırdım.",
    en: "I tracked every copy—but missed my coffee break doing it.",
    fr: "J'ai tout copié, mais j'ai raté ma pause café."
  },
  'text-summarizer': {
    tr: "AI bile kahvesiz çalışmıyor. Bana inan, denedim.",
    en: "Even AI doesn't work without coffee. Believe me, I've tested it.",
    fr: "Même l'IA ne fonctionne pas sans café. Crois-moi, j'ai essayé."
  },
  'text-translator': {
    tr: "Çeviri tamam! 'Bir kahve alır mısın?' her dilde geçerlidir.",
    en: "Translation done! 'Would you like a coffee?' works in every language.",
    fr: "Traduction terminée ! 'Tu veux un café ?' marche dans toutes les langues."
  },
  'content-detector': {
    tr: "AI mi yazmış, insan mı? Kim olursa olsun bir kahve hak eder.",
    en: "AI or human, whoever wrote it deserves a coffee.",
    fr: "IA ou humain, peu importe, l'auteur mérite un café."
  },
  'email-generator': {
    tr: "E-posta hazır! Ama kahveyle yazılmış bir 'merhaba' her zaman daha içten.",
    en: "Email ready! But a coffee-fueled 'hello' always feels more genuine.",
    fr: "E-mail prêt ! Mais un 'bonjour' écrit sous caféine, c'est toujours plus sincère."
  },
  'seo-analyzer': {
    tr: "SEO raporu tamam. Kahve içmeden bu kadar sabırlı olabildiğime şaşkınım.",
    en: "SEO report done. I'm shocked I managed this without coffee.",
    fr: "Rapport SEO terminé. Je suis surpris d'avoir tenu sans café."
  },
  'ai-chat': {
    tr: "Bu sohbetten sonra kahveme bile 'nasılsın?' dedim.",
    en: "After this chat, I even asked my coffee how it's doing.",
    fr: "Après cette conversation, j'ai même demandé à mon café comment il allait."
  }
};

/**
 * Get the current language from Chrome's i18n system
 * @returns {string} Language code (tr, en, fr)
 */
export function getCurrentLanguage() {
  try {
    const uiLanguage = chrome.i18n.getUILanguage();
    // Extract language code (e.g., 'tr-TR' -> 'tr')
    const langCode = uiLanguage.split('-')[0].toLowerCase();
    
    // Return supported language or fallback to English
    if (['tr', 'en', 'fr'].includes(langCode)) {
      return langCode;
    }
    return 'en';
  } catch (error) {
    console.debug('Coffee Messages: Language detection failed, using English', error);
    return 'en';
  }
}

/**
 * Get coffee message for a specific tool
 * @param {string} toolId - The tool identifier
 * @returns {string|null} The message in current language, or null if not found
 */
export function getCoffeeMessage(toolId) {
  try {
    const messages = MESSAGES[toolId];
    if (!messages) {
      console.debug(`Coffee Messages: No message found for tool: ${toolId}`);
      return null;
    }
    
    const language = getCurrentLanguage();
    const message = messages[language] || messages['en'] || null;
    
    if (!message) {
      console.debug(`Coffee Messages: No message found for tool ${toolId} in language ${language}`);
    }
    
    return message;
  } catch (error) {
    console.error('Coffee Messages: Error getting message for tool', toolId, error);
    return null;
  }
}

/**
 * Check if a tool has coffee messages available
 * @param {string} toolId - The tool identifier
 * @returns {boolean} True if messages are available
 */
export function hasCoffeeMessage(toolId) {
  return MESSAGES.hasOwnProperty(toolId);
}
