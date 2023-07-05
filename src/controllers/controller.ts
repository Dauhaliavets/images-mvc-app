import { Brand, Category, RangeValues } from './../models/model.types';
import { Model } from '../models/model';
import { Product } from '../models/model.types';

export class Controller {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public checkAllSettings(): boolean {
    const hasAnyFilters = this.hasAnyFilters();
    const isChangedRanges = this.isChangedRanges();
    const sortSettings = this.model.getState().sortSettings;
    return hasAnyFilters || isChangedRanges || !!sortSettings.length;
  }

  private isChangedRanges(): boolean {
    const ranges = this.model.getState().ranges;
    const isChangedRangeCount = ranges.count[0] !== RangeValues.MIN_COUNT || ranges.count[1] !== RangeValues.MAX_COUNT;
    const isChangedRangeYear = ranges.year[0] !== RangeValues.MIN_YEAR || ranges.year[1] !== RangeValues.MAX_YEAR;
    return isChangedRangeCount || isChangedRangeYear;
  }

  private hasAnyFilters(): boolean {
    const filters = this.model.getState().filters;
    return !!Object.values(filters).filter((filterTypes) => filterTypes.length).length;
  }

  public sortItems = (config: string, products: Product[]): Product[] => {
    const [key, direction] = config.split('_');
    const sortableItems = [...products];

    if (key === 'title') {
      sortableItems.sort((a, b) => {
        if (a[key].toLowerCase() < b[key].toLowerCase()) {
          return direction === 'asc' ? 1 : -1;
        }
        if (a[key].toLowerCase() > b[key].toLowerCase()) {
          return direction === 'asc' ? -1 : 1;
        }
        return 0;
      });
    } else if (key === 'price') {
      sortableItems.sort((a, b) => (direction === 'asc' ? a.price - b.price : b.price - a.price));
    }

    return sortableItems;
  };

  public sortBy = (config: string) => {
    let sortableItems: Product[];
    if (!this.model.getState().visible.length) {
      sortableItems = this.sortItems(config, this.model.getState().products);
    } else {
      sortableItems = this.sortItems(config, this.model.getState().visible);
    }

    this.model.setState({
      visible: sortableItems,
      sortSettings: config,
    });
  };

  public filterItems(): Product[] {
    const filters = this.model.getState().filters;
    const ranges = this.model.getState().ranges;
    const [category, brand] = Object.keys(filters);
    let filteredItems = [...this.model.getState().products];

    if (filters[category].length) {
      filteredItems = filteredItems.filter((product) => {
        return (filters[category] as Category[]).find((filter) => Object.values(product).includes(filter));
      });
    }
    if (filters[brand].length) {
      filteredItems = filteredItems.filter((product) => {
        return (filters[brand] as Brand[]).find((filter) => Object.values(product).includes(filter));
      });
    }

    filteredItems = filteredItems.filter(
      (product) => product.count >= ranges.count[0] && product.count <= ranges.count[1],
    );
    filteredItems = filteredItems.filter((product) => product.year >= ranges.year[0] && product.year <= ranges.year[1]);

    return filteredItems;
  }

  public changeFilters(event: MouseEvent, filter: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const idFilter = (event.target as HTMLElement).id;
    const filters = this.model.getState().filters;
    let newFiltersCategory: Category[] = filters.category;
    let newFiltersBrand: Brand[] = filters.brand;

    if (checked) {
      if (filter === 'category') {
        newFiltersCategory = [...filters.category, idFilter as Category];
      } else if (filter === 'brand') {
        newFiltersBrand = [...filters.brand, idFilter as Brand];
      }
    } else {
      if (filter === 'category') {
        newFiltersCategory = filters.category.filter((cat) => cat !== idFilter);
      } else if (filter === 'brand') {
        newFiltersBrand = filters.brand.filter((cat) => cat !== idFilter);
      }
    }

    this.model.setState({
      filters: {
        category: newFiltersCategory,
        brand: newFiltersBrand,
      },
    });

    const foundItems = this.filterItems();
    const sortedItems = this.sortItems(this.model.getState().sortSettings, foundItems);

    this.model.setState({
      visible: sortedItems,
    });
  }

  public changeRanges(idRange: string, values: number[]) {
    const newRanges = this.model.getState().ranges;

    for (const key in newRanges) {
      if (idRange === key) {
        newRanges[idRange] = values;
      }
    }

    this.model.setState({ ranges: newRanges });

    const foundItems = this.filterItems();
    const sortedItems = this.sortItems(this.model.getState().sortSettings, foundItems);

    this.model.setState({ visible: sortedItems });
  }
}
