import ApiService from '@/core/services/base/apiService';
import { RecentPage, RecentPageInput } from '@/core/types/dashboard-apis/recentPages';
export async function getJsonDaynamicFormData(id: string, lang: string) {
  return ApiService.get(`/forms`, {
    module: 'DASHBOARD_ADMIN',
    params: {
      id: id,
      lang: lang,
    },
    noCredentials: true,
  });
}

export async function getRecentPages(userId: string): Promise<RecentPage[]> {
  return await ApiService.get(`/recent-pages`, {
    module: 'DASHBOARD_ADMIN',
    params: {
      userId,
    },
    noCredentials: true,
  });
}

export async function createRecentPage(data: RecentPageInput) {
  return ApiService.post(`/recent-pages`, data, {
    module: 'DASHBOARD_ADMIN',
    noCredentials: true,
  });
}

export async function updateRecentPage(data: { id: string; isPinned?: boolean }) {
  return ApiService.patch(`/recent-pages`, data, {
    module: 'DASHBOARD_ADMIN',
    noCredentials: true,
  });
}
