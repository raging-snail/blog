interface Window {
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
}

declare module 'astro:env/client' {
  export const PUBLIC_GOOGLE_SITE_VERIFICATION: string | undefined;
  export const PUBLIC_GOOGLE_ANALYTICS_ID: string | undefined;
}
