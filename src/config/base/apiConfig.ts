export const API_URLS = {
  BASE: process.env.NEXT_PUBLIC_API_BASE || 'https://dummyjson.com',
  AUTH: process.env.NEXT_PUBLIC_API_AUTH || 'https://dummyjson.com/auth',
  INVENTORY: process.env.NEXT_PUBLIC_API_INVENTORY || 'https://gamma.addstaging.com/api/v1',
  INVENTORY_V2:
    process.env.NEXT_PUBLIC_API_INVENTORY_V2 || 'https://dev1-inventoryv2.addstaging.com/api/v1',
  WEBSITE: process.env.NEXT_PUBLIC_API_WEBSITE || 'https://vega.addstaging.com/api',
  SUPPORT_WEBSITE:
    process.env.NEXT_PUBLIC_API_SUPPORT_WEBSITE || 'https://rigel.addstaging.com/api',
  CRM: process.env.NEXT_PUBLIC_API_CRM || 'https://mirra.addstaging.com/api',
  BOOKINGS: process.env.NEXT_PUBLIC_API_BOOKINGS || 'https://automation.addstaging.com/api',
  INVENTORY_LUMA: 'https://inventory-luma.addstaging.com/api',
  VINAUDIT: 'https://marketvalue.vinaudit.com',
  DASHBOARD_ADMIN:
    process.env.NEXT_PUBLIC_API_DASHBOARD_ADMIN || 'https://682769556b7628c5291041d7.mockapi.io',
  BILLING: process.env.NEXT_PUBLIC_API_BILLING || 'https://lux.addstaging.com',
  FBMP: process.env.NEXT_PUBLIC_API_FBMP || 'https://altair.addstaging.com/api',
  DIGITAL_ADS: process.env.NEXT_PUBLIC_API_DIGITAL_ADS || 'https://sol.addstaging.com/api',
  SOCIAL_AUTOMATION:
    process.env.NEXT_PUBLIC_API_SOCIAL_AUTOMATION || 'https://orion.addstaging.com/api',
} as const;

export type ApiModule = keyof typeof API_URLS;
