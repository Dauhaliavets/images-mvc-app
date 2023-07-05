type ProductDescription = {
  [index: string]: string;
};

export type Category = 'Laptop' | 'Monoblock' | 'Smartphone' | 'Tablet' | 'TV';
export type Brand =
  | 'Asus'
  | 'Lenovo'
  | 'IRBIS'
  | 'Haier'
  | 'Acer'
  | 'Echips'
  | 'Poco'
  | 'realme'
  | 'ZTE'
  | 'Xiaomi'
  | 'Vivo'
  | 'Samsung'
  | 'Horizont'
  | 'KIVI'
  | 'HP'
  | 'MSI'
  | 'Dell'
  | 'Huawei'
  | 'Realme'
  | 'KIWI';

export interface Product {
  id: number;
  brand: Brand;
  category: Category;
  title: string;
  description: ProductDescription;
  price: number;
  isPopular: boolean;
  isNew: boolean;
  year: number;
  currency: string;
  img: string;
  count: number;
  [key: string]: number | string | boolean | ProductDescription;
}

export interface Filters {
  category: Category[];
  brand: Brand[];
  [key: string]: Category[] | Brand[] | string[];
}

export enum RangeValues {
  MIN_COUNT = 0,
  MAX_COUNT = 20,
  MIN_YEAR = 2015,
  MAX_YEAR = 2022,
}
export interface Ranges {
  count: RangeValues[];
  year: RangeValues[];
  [key: string]: RangeValues[];
}

export interface AppState {
  products: Product[];
  visible: Product[];
  sortSettings: string;
  defaultFilters: Filters;
  filters: Filters;
  ranges: Ranges;
}
