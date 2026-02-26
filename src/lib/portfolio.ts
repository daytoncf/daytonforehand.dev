export type PageSection = 'home' | 'projects' | 'resume' | 'blog';

export interface ThemeDefinition {
  name: string;
  tone: string;
  bg: string;
  bgAlt: string;
  tint: string;
  accent: string;
  accentSoft: string;
  ink: string;
  glass: string;
  glassBorder: string;
  glow: string;
  fontDisplay: string;
  fontBody: string;
}

export const theme: ThemeDefinition = {
  name: 'Canopy Night',
  tone: 'Deep glass on dark botanical tones',
  bg: '#11201a',
  bgAlt: '#1a2d24',
  tint: '#325441',
  accent: '#9fcba7',
  accentSoft: '#7ea687',
  ink: '#e6f1e7',
  glass: 'rgba(24, 43, 33, 0.56)',
  glassBorder: 'rgba(183, 212, 188, 0.35)',
  glow: 'rgba(128, 179, 140, 0.25)',
  fontDisplay: '"Literata", "Iowan Old Style", serif',
  fontBody: '"Alegreya Sans", "Gill Sans", sans-serif',
};

export interface Identity {
  name: string;
  role: string;
  location: string;
  email: string;
  availability: string;
}

export const identity: Identity = {
  name: 'Dayton Forehand',
  role: 'Software Engineer',
  location: 'Based in Dallas, TX',
  email: 'work@daytonforehand.dev',
  availability: 'Open to consulting and full-time opportunities',
};

export function buildNavLinks(): Record<PageSection, string> {
  return {
    home: '/',
    projects: '/projects',
    resume: '/resume',
    blog: '/blog',
  };
}

export function sortPostsByDateDesc<T extends { data: { date: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
