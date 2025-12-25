export interface Article {
  id: number;
  user_id: number;
  stock: string;
  vin: string;
  title: string;
  make: string;
  model: string;
  year: string;
  mileage: number;
  price: number;
  odometer_units: number;
  photo_count: number;
  main_photo: string;
  pending: boolean;
  date_pending: string | null;
  age_date: string;
  sold_on: string | null;
  featured_inventory: boolean;
  internet_specials: boolean;
  featured_price: number;
  display_msrp: boolean;
  msrp: number;
  views: number;
  below: number | null;
  average: number | null;
  above: number | null;
}

export interface ArticlesParams {
  status: 'published' | 'draft' | 'archived' | string;
  page: number;
  per_page: number;
  sortBy: 'price' | 'year' | 'mileage' | string;
  order: 'asc' | 'desc' | string;
  search?: string;
}

export interface ArticleResponce {
  data: Article[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
