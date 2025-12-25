// Helper functions - stubs for missing dependencies
export function getValidItems<T>(items: T[]): T[] {
  return items.filter(item => item != null);
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function truncateFileName(fileName: string, maxLength: number = 30): string {
  if (!fileName) return '';
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3);
  return `${truncatedName}...${extension}`;
}

export function generateBreadcrumbItemsFromPath(path: string): Array<{ label: string; href: string }> {
  if (!path) return [];
  const segments = path.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: '/' + segments.slice(0, index + 1).join('/'),
  }));
}

export function sortActionOptions<T>(options: T[]): T[] {
  return [...options].sort();
}

export function formatDateLocal(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

export function parseRangeDateString(dateString: string): { from: Date; to: Date } | null {
  if (!dateString) return null;
  // Simple parser - adjust based on your date format
  const parts = dateString.split(' - ');
  if (parts.length !== 2) return null;
  const from = new Date(parts[0]);
  const to = new Date(parts[1]);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
  return { from, to };
}

export function convertTo12HourFormat(time24: string): string {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatNumberWithCommas(value: string | number): string {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

export function getRawNumericValue(value: string): string {
  if (!value) return '';
  return value.replace(/[^\d.-]/g, '');
}

