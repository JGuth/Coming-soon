export interface SiteColors {
  primaryAccent: string; // e.g. #8ABFFF (electric light blue)
  secondaryAccent: string; // e.g. #4C9FFF (bright blue)
  bgDark: string; // e.g. #0B1425 (midnight dark blue background)
  cardSurface: string; // e.g. #111B2B (card / panel surface)
  navySurface: string; // e.g. #11213A (elevated badge / nested card surface)
  textPrimary: string; // e.g. #F5F8FC (crisp readable text)
  textMuted: string; // e.g. #A7B4C7 (subtle secondary text)
}

export interface SiteAnnouncement {
  enabled: boolean;
  text: string;
  badgeText: string;
  linkText: string;
  linkUrl: string;
}

export interface SiteNavigation {
  brandName: string;
  brandDomain: string;
  logoSubtitle: string;
  featuresLabel: string;
  roadmapLabel: string;
  ctaButtonText: string;
}

export interface HeroStat {
  value: string;
  label: string;
  color?: string;
}

export interface SiteHero {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  ctaText: string;
  inputPlaceholder: string;
  featureNote1: string;
  featureNote2: string;
  featureNote3: string;
  stats: HeroStat[];
}

export interface SiteFeaturesSection {
  tag: string;
  title: string;
  subtitle: string;
}

export interface SiteRoadmapSection {
  tag: string;
  title: string;
  subtitle: string;
}

export interface SiteSignupSection {
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  consentText: string;
  disclaimer: string;
}

export interface SiteFooter {
  tagline: string;
  description: string;
  communityNote: string;
  disclaimer: string;
  contactEmail: string;
  copyrightText: string;
}

export interface AscentMilestone {
  id: string;
  year: string;
  grade: string;
  eventTitle: string;
  isPromotion: boolean;
  isWorldChampion: boolean;
  badgeText?: string;
  notes?: string;
}

export interface AscentChartConfig {
  bandName: string;
  journeySubtitle: string;
  startingGrade: string;
  startingYear: string;
  peakGrade: string;
  peakSubtitle: string;
  promotionsCount: string;
  promotionsSubtitle: string;
  yearsToGrade1: string;
  speedSubtitle: string;
  trajectoryGradientStart: string;
  trajectoryGradientMid: string;
  trajectoryGradientEnd: string;
  worldTitlesLabel: string;
  landmark1Label: string;
  landmark2Label: string;
  landmark3Label: string;
  landmark4Label: string;
  landmark5Label: string;
  landmark6Label: string;
  accentThemeMatch?: boolean;
  defaultMobileView?: 'stepper' | 'curve';
  curveStrokeWidth?: 'fine' | 'medium' | 'bold';
  showGridlines?: boolean;
  showNodeGlow?: boolean;
  milestoneDisplayFormat?: 'cards' | 'timeline';
  rivalOverlayBandName?: string;
  rivalOverlayGrade?: string;
  milestones?: AscentMilestone[];
}

export interface SiteVisualOptions {
  glowIntensity: 'subtle' | 'vibrant' | 'none';
  gridStyle: 'subtle' | 'dense' | 'off';
  fontFamily: 'sans' | 'mono' | 'serif';
  cardRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  tartanOverlay?: 'visible' | 'subtle' | 'none';
  buttonStyle?: 'pill' | 'rounded' | 'sharp';
  containerMaxWidth?: 'compact' | 'standard' | 'wide';
}

export interface SiteSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterHandle?: string;
}

export interface AdjudicatorChartConfig {
  adjudicatorName: string;
  discipline: string;
  careerSpan: string;
  worldsPanels: string;
  majorAppearances: string;
  assignments: string;
  bandsScored: string;
  contests: string;
  majors: string;
}

export interface RivalryChartConfig {
  band1Name: string;
  band1Wins: number;
  band1WinPercent: string;
  band1Color: string;
  band2Name: string;
  band2Wins: number;
  band2WinPercent: string;
  band2Color: string;
  drawsCount: number;
  pipingScore: string;
  drummingScore: string;
  ensembleScore: string;
  iconicDeciderTitle: string;
  iconicDeciderDesc: string;
}

export interface TrophyCabinetConfig {
  bandName: string;
  bandSummary: string;
  trophy1Title: string;
  trophy1Year: string;
  trophy1Score: string;
  trophy2Title: string;
  trophy2Year: string;
  trophy2Score: string;
  trophy3Title: string;
  trophy3Year: string;
  trophy3Score: string;
  trophy4Title: string;
  trophy4Year: string;
  trophy4Score: string;
  leadershipText: string;
}

export interface SiteChartsConfig {
  ascent: AscentChartConfig;
  adjudicator: AdjudicatorChartConfig;
  rivalry: RivalryChartConfig;
  trophy: TrophyCabinetConfig;
}

export interface WebsiteSettings {
  colors: SiteColors;
  themePreset: string;
  siteMode?: 'splash' | 'live';
  visuals?: SiteVisualOptions;
  seo?: SiteSEO;
  announcement: SiteAnnouncement;
  navigation: SiteNavigation;
  hero: SiteHero;
  features: SiteFeaturesSection;
  charts: SiteChartsConfig;
  roadmap: SiteRoadmapSection;
  signup: SiteSignupSection;
  footer: SiteFooter;
  updatedAt?: string;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  colors: {
    primaryAccent: '#8ABFFF',
    secondaryAccent: '#4C9FFF',
    bgDark: '#0B1425',
    cardSurface: '#111B2B',
    navySurface: '#11213A',
    textPrimary: '#F5F8FC',
    textMuted: '#A7B4C7',
  },
  themePreset: 'classic-blue',
  siteMode: 'splash',
  visuals: {
    glowIntensity: 'subtle',
    gridStyle: 'subtle',
    fontFamily: 'sans',
    cardRadius: 'rounded-2xl',
    tartanOverlay: 'subtle',
    buttonStyle: 'rounded',
    containerMaxWidth: 'standard',
  },
  seo: {
    metaTitle: 'PipeBand.app — 28 Years of Championship Pipe Band Archives',
    metaDescription: 'Historic RSPBA competition results, grade trajectories, adjudicator variance, and rivalry analytics from 1998 to 2026.',
    keywords: 'pipe band, RSPBA, world pipe band championships, bagpipes, piping statistics',
    ogTitle: 'PipeBand.app — 28 Years of Championship Pipe Band Archives',
    ogDescription: 'Historic RSPBA competition results, grade trajectories, and adjudicator analytics.',
    twitterHandle: '@PipeBandApp',
  },
  announcement: {
    enabled: true,
    text: '28-year competition database architecture now entering phase 2 testing.',
    badgeText: 'ARCHIVE UPDATE',
    linkText: 'Explore Teasers',
    linkUrl: '#features',
  },
  navigation: {
    brandName: 'PipeBand',
    brandDomain: '.app',
    logoSubtitle: '1998–2026 Archive',
    featuresLabel: 'Teased Features',
    roadmapLabel: '2026 Roadmap',
    ctaButtonText: 'Join the launch list',
  },
  hero: {
    badge: '1998 – 2026 OFFICIAL ARCHIVES · 28 SEASONS',
    titleLine1: 'Every contest..',
    titleLine2: 'Every result.',
    titleLine3: 'Every story.',
    description:
      'The home of pipe band results, competitive history and statistics. Transforming 28 years of RSPBA championship archives into interactive band profiles, historic rivalry arenas, and forensic adjudication analytics.',
    ctaText: 'Join launch list',
    inputPlaceholder: 'Enter your email address',
    featureNote1: 'Free early access',
    featureNote2: 'Zero spam',
    featureNote3: 'Teased features',
    stats: [
      { value: '28 Years', label: '1998–2026 Archive', color: '#FFFFFF' },
      { value: '600+', label: 'Major Contests', color: '#8ABFFF' },
      { value: '4,800+', label: 'Judge Marks', color: '#FFFFFF' },
      { value: '100%', label: 'Verified Records', color: '#34D399' },
    ],
  },
  features: {
    tag: 'COMING SOON · PLATFORM TEASERS',
    title: 'Unlocking 28 years of competitive history.',
    subtitle:
      'Explore the flagship modules launching soon on PipeBand.app, built directly from official 1998–2026 championship records.',
  },
  charts: {
    ascent: {
      bandName: 'Inveraray and District',
      journeySubtitle: 'Chronological ascent from Novice Juvenile (2005) through to Grade 1 (2026).',
      startingGrade: 'Novice Juvenile',
      startingYear: '2005',
      peakGrade: 'Grade 1',
      peakSubtitle: 'Premier Flight',
      promotionsCount: '3',
      promotionsSubtitle: 'Tiers Climbed',
      yearsToGrade1: '6 Yrs',
      speedSubtitle: 'Ascent Speed',
      trajectoryGradientStart: '#8ABFFF',
      trajectoryGradientMid: '#4C9FFF',
      trajectoryGradientEnd: '#F59E0B',
      worldTitlesLabel: 'Grade 1 World Champions in 2017 & 2019',
      landmark1Label: "'07 WORLDS",
      landmark2Label: "'08 WORLDS & PROMO",
      landmark3Label: "'09 WORLDS & PROMO",
      landmark4Label: "'10 TO GRADE 1",
      landmark5Label: "'17 WORLDS",
      landmark6Label: "'19 WORLDS",
      accentThemeMatch: true,
      defaultMobileView: 'stepper',
      curveStrokeWidth: 'medium',
      showGridlines: true,
      showNodeGlow: true,
      milestoneDisplayFormat: 'cards',
      rivalOverlayBandName: 'Field Marshal Montgomery',
      rivalOverlayGrade: 'Grade 1',
      milestones: [
        {
          id: 'm1',
          year: '2005',
          grade: 'Novice Juvenile',
          eventTitle: 'Band Inception & Debut',
          isPromotion: false,
          isWorldChampion: false,
          badgeText: 'DEBUT',
          notes: 'Youth academy founded in Argyll under Pipe Major Stuart Liddell.',
        },
        {
          id: 'm2',
          year: '2007',
          grade: 'Juvenile',
          eventTitle: 'World Champions (Juvenile)',
          isPromotion: true,
          isWorldChampion: true,
          badgeText: "'07 WORLDS",
          notes: 'Clinched Juvenile World Title at Glasgow Green; promoted to Grade 2.',
        },
        {
          id: 'm3',
          year: '2008',
          grade: 'Grade 2',
          eventTitle: 'Grade 2 World Champions',
          isPromotion: true,
          isWorldChampion: true,
          badgeText: "'08 WORLDS",
          notes: 'Back-to-back major sweep across Cowal, Scottish & World Championships.',
        },
        {
          id: 'm4',
          year: '2009',
          grade: 'Grade 2',
          eventTitle: 'Champion of Champions',
          isPromotion: false,
          isWorldChampion: false,
          badgeText: "'09 AGGREGATE",
          notes: 'Consolidated dominant Grade 2 form with clean sweep across majors.',
        },
        {
          id: 'm5',
          year: '2010',
          grade: 'Grade 1',
          eventTitle: 'Elevated to Grade 1 Premier',
          isPromotion: true,
          isWorldChampion: false,
          badgeText: 'PREMIER FLIGHT',
          notes: 'One of the fastest ascents in pipe band history: Novice to Grade 1 in 5 seasons.',
        },
        {
          id: 'm6',
          year: '2014',
          grade: 'Grade 1',
          eventTitle: 'First Grade 1 Major Crown',
          isPromotion: false,
          isWorldChampion: false,
          badgeText: '1st MAJOR',
          notes: 'Dumbarton Scottish Championships victory, breaking into top tier.',
        },
        {
          id: 'm7',
          year: '2017',
          grade: 'Grade 1',
          eventTitle: 'World Pipe Band Champions',
          isPromotion: false,
          isWorldChampion: true,
          badgeText: "'17 WORLDS",
          notes: 'Lifted the Grade 1 World Championship trophy on Glasgow Green.',
        },
        {
          id: 'm8',
          year: '2019',
          grade: 'Grade 1',
          eventTitle: 'World Champions Golden Double',
          isPromotion: false,
          isWorldChampion: true,
          badgeText: "'19 WORLDS",
          notes: 'Won second World Championship title, capturing both MSR & Medley rounds.',
        },
        {
          id: 'm9',
          year: '2026',
          grade: 'Grade 1',
          eventTitle: 'Global Elite Contender',
          isPromotion: false,
          isWorldChampion: false,
          badgeText: 'CURRENT',
          notes: '28-year archive analytics highlight consistent top-three major aggregate record.',
        },
      ],
    },
    adjudicator: {
      adjudicatorName: 'James Campbell',
      discipline: 'Piping 1',
      careerSpan: '1999 – 2026 (28 Years)',
      worldsPanels: '54 World Championship Panels',
      majorAppearances: '160',
      assignments: '574',
      bandsScored: '4341',
      contests: '179',
      majors: '160',
    },
    rivalry: {
      band1Name: 'Field Marshal Montgomery',
      band1Wins: 34,
      band1WinPercent: '58.6%',
      band1Color: '#8ABFFF',
      band2Name: 'Inveraray & District',
      band2Wins: 22,
      band2WinPercent: '37.9%',
      band2Color: '#34D399',
      drawsCount: 2,
      pipingScore: 'FMM 36 · IDPB 20',
      drummingScore: 'IDPB 33 · FMM 22',
      ensembleScore: 'FMM 31 · IDPB 25',
      iconicDeciderTitle: 'Iconic Decider: 2019 World Championship Final',
      iconicDeciderDesc: 'Tied at 13-13 aggregate. Inveraray captured the World Title on Drumming countback (2nd vs 3rd).',
    },
    trophy: {
      bandName: 'PEOPLES FORD BOGHALL & BATHGATE CALEDONIA',
      bandSummary: '18 Major Titles · 2 World Championships · 14 World Drumming Banners',
      trophy1Title: 'WORLD CHAMP',
      trophy1Year: '2023',
      trophy1Score: 'Score: 10 pts',
      trophy2Title: 'WORLD DRUMS',
      trophy2Year: '2023 & 2012',
      trophy2Score: '14 Career Banners',
      trophy3Title: 'SCOTTISH',
      trophy3Year: '2019 & 2017',
      trophy3Score: 'Dumbarton',
      trophy4Title: 'CHAMPIONS',
      trophy4Year: '2023 Season',
      trophy4Score: 'Overall Season',
      leadershipText: 'Leadership: P/M Ross Harvey · L/D Kerr McQuillan',
    },
  },
  roadmap: {
    tag: '2026 DELIVERY TIMELINE',
    title: 'A methodical roadmap for the pipe band world.',
    subtitle:
      'Built with algorithmic rigor and respect for competitive piping and drumming heritage. Here is what is live and what arrives next.',
  },
  signup: {
    tag: 'EARLY ACCESS LAUNCH LIST',
    title: "Be part of what's next.",
    subtitle:
      "The pipe band world's results and history are coming together in one place. Sign up to hear when PipeBand.app launches.",
    ctaText: 'Join the launch list',
    consentText:
      'Yes, keep me notified about the launch of PipeBand.app and platform preview access. No spam, ever.',
    disclaimer: 'Zero spam. Strict privacy.',
  },
  footer: {
    tagline: '"Every contest. Every result. Every story."',
    description:
      'The home of pipe band results, competitive history and statistics. Bringing performances, rivalries and records from the pipe band world together in one place.',
    communityNote: 'Made with ❤️ for the pipe band community',
    disclaimer: 'Independent community archive platform. Not affiliated with or endorsed by the RSPBA.',
    contactEmail: 'privacy@pipeband.app',
    copyrightText: 'PipeBand.app. All rights reserved.',
  },
};

export interface ThemePresetOption {
  id: string;
  name: string;
  description: string;
  colors: SiteColors;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'classic-blue',
    name: 'Midnight Electric (Original)',
    description: 'Deep midnight navy with electric blue and cyan accents.',
    colors: {
      primaryAccent: '#8ABFFF',
      secondaryAccent: '#4C9FFF',
      bgDark: '#0B1425',
      cardSurface: '#111B2B',
      navySurface: '#11213A',
      textPrimary: '#F5F8FC',
      textMuted: '#A7B4C7',
    },
  },
  {
    id: 'highland-emerald',
    name: 'Highland Emerald & Gold',
    description: 'Scottish highland forest greens with golden brass highlights.',
    colors: {
      primaryAccent: '#34D399',
      secondaryAccent: '#10B981',
      bgDark: '#081C15',
      cardSurface: '#0F2D23',
      navySurface: '#183F32',
      textPrimary: '#F0FDF4',
      textMuted: '#98BAAB',
    },
  },
  {
    id: 'royal-stuart',
    name: 'Royal Stuart Crimson',
    description: 'Rich royal tartan crimson with warm ruby glows and dark mahogany slate.',
    colors: {
      primaryAccent: '#FB7185',
      secondaryAccent: '#E11D48',
      bgDark: '#170A0F',
      cardSurface: '#241018',
      navySurface: '#361623',
      textPrimary: '#FFF1F2',
      textMuted: '#CCA1AD',
    },
  },
  {
    id: 'hebridean-purple',
    name: 'Hebridean Thistle',
    description: 'Regal Scottish thistle violet with lavender and twilight obsidian.',
    colors: {
      primaryAccent: '#C084FC',
      secondaryAccent: '#9333EA',
      bgDark: '#120D1D',
      cardSurface: '#1D142E',
      navySurface: '#2B1C44',
      textPrimary: '#FAF5FF',
      textMuted: '#B9A8CF',
    },
  },
  {
    id: 'golden-champion',
    name: 'Golden Champion (Trophy)',
    description: 'Championship gold with warm amber luster and sleek midnight onyx.',
    colors: {
      primaryAccent: '#FBBF24',
      secondaryAccent: '#F59E0B',
      bgDark: '#14120B',
      cardSurface: '#1F1B12',
      navySurface: '#2D2719',
      textPrimary: '#FEFCE8',
      textMuted: '#C5BD9F',
    },
  },
  {
    id: 'cyber-slate',
    name: 'Monochrome High-Tech',
    description: 'Crisp titanium silver and cold slate monochrome aesthetic.',
    colors: {
      primaryAccent: '#E2E8F0',
      secondaryAccent: '#94A3B8',
      bgDark: '#090D14',
      cardSurface: '#111827',
      navySurface: '#1F2937',
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
    },
  },
];
