import { useQuery } from '@tanstack/react-query';
import {
  getJsonDaynamicFormData,
  getRecentPages,
} from '@/services/dynamic-from/dynamicFormServices';
import { RECENT_PAGES_QUERY_KEYS } from './dynamicFormsQueryKeys';
import { RecentPage } from '@/types/dashboard-apis/recentPages';

export function useDynamicFormsQuery(file: string, lang: string) {
  return useQuery({
    queryKey: ['dynamicForm', file, lang],
    queryFn: () => getJsonDaynamicFormData(file, lang),
    enabled: !!file,
  });
}

export function useRecentPagesQuery(userId: string) {
  return useQuery<RecentPage[]>({
    queryKey: RECENT_PAGES_QUERY_KEYS.list(userId),
    queryFn: () => getRecentPages(userId),
    enabled: !!userId,
  });
}
