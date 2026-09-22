import { useEffect } from 'react';

export const useTypekitFonts = (fontCssFiles: string[]) => {
  useEffect(() => {
    // Remove any existing Adobe Fonts stylesheets
    document
      .querySelectorAll('link[href*="typekit.net"]')
      .forEach((link) => link.remove());

    // Load the new stylesheets
    fontCssFiles.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://use.typekit.net/${font}`;
      document.head.appendChild(link);
    });
  }, [fontCssFiles]);
};
