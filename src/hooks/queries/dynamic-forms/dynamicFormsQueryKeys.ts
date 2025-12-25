export const RECENT_PAGES_QUERY_KEYS = {
  all: ['recentPages'] as const,
  list: (userId: string) => [...RECENT_PAGES_QUERY_KEYS.all, userId] as const,
  dynamicForm: (file: string, lang: string) => ['dynamicForm', file, lang] as const,
};
