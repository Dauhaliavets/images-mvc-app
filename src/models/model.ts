import { Signal } from '../controllers/Signal';
import { AppState, Product, RangeValues } from './model.types';

const initialState: AppState = {
  products: [],
  visible: [],
  sortSettings: '',
  defaultFilters: {
    category: ['Laptop', 'Monoblock', 'Smartphone', 'Tablet', 'TV'],
    brand: [
      'Asus',
      'Lenovo',
      'IRBIS',
      'Haier',
      'Acer',
      'Echips',
      'Poco',
      'realme',
      'ZTE',
      'Xiaomi',
      'Vivo',
      'Samsung',
      'Horizont',
      'KIVI',
      'HP',
      'MSI',
      'Dell',
      'Huawei',
      'Realme',
      'KIWI',
    ],
  },
  filters: {
    category: [],
    brand: [],
  },
  ranges: {
    count: [RangeValues.MIN_COUNT, RangeValues.MAX_COUNT],
    year: [RangeValues.MIN_YEAR, RangeValues.MAX_YEAR],
  },
};

export class Model {
  private _state;
  public events = new Signal<AppState>();

  constructor(state: AppState = initialState) {
    this._state = state;
    this.loadData();
  }

  public getState(): AppState {
    return this._state;
  }

  public setState(newState: Partial<AppState>): void {
    this._state = { ...this.getState(), ...newState };
    this.events.emit(this.getState());
  }

  private async loadData() {
    await fetch('../DB/db.json')
      .then((res) => res.json())
      .then((productsData: Product[]) => this.setState({ products: productsData }))
      .catch((error) => alert(`Ошибка ${error}`));
  }
}
