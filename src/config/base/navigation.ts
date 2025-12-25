export const NAVIGATION_CONFIG = {
  MAX_RECENT_ITEMS: 5,
  STORAGE_KEY: 'recent-navigation',
  DEFAULT_ICON: 'SquareTerminal',
  ANIMATION_DURATION: 200,
  CHEVRON_ROTATION_DURATION: 200,
  TRANSITIONS: {
    EASE_IN_OUT: 'ease-in-out',
    OPACITY: 'opacity',
    TRANSFORM: 'transform',
  },
  CLASSES: {
    DURATION: 'duration-200',
    TRANSITION_ALL: 'transition-all',
    HOVER_SCALE: 'hover:scale-110',
  },
} as const;

export const SIDEBAR_LABELS = {
  PLATFORM: 'Platform',
  RECENT_NAVIGATIONS: 'Recent',
  PIN: 'Pin shortcut',
  UNPIN: 'Unpin shortcut',
} as const;
