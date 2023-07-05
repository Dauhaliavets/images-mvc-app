import { Controller } from './../controllers/controller';
import { AppState, RangeValues } from './../models/model.types';
import { Control } from '../controllers/Control';
import noUiSlider, { API } from 'nouislider';

export class Filters extends Control<HTMLElement> {
  filtersTitle: Control<HTMLElement>;
  filtersSubTitle: Control<HTMLElement>;
  filterItem: Control<HTMLElement> | undefined;
  label: Control<HTMLLabelElement> | undefined;
  checkbox: Control<HTMLInputElement> | undefined;
  clearBtns: Control<HTMLElement>;
  sliderWrapper: Control<HTMLElement>;
  rangeSliderYear: API;
  rangeSliderQuantity: API;
  filterGroup: Control<HTMLElement>;

  constructor(parentElement: HTMLElement, data: AppState, controller: Controller) {
    super(parentElement, 'div', 'filters__container');
    this.filtersTitle = new Control(this.node, 'h3', 'filters__title', 'Фильтры');
    this.clearBtns = new Control(this.node, 'div', 'filter-buttons');

    this.filtersSubTitle = new Control(this.node, 'h4', 'filters__subtitle', 'Количество');
    this.sliderWrapper = new Control(this.node, 'div', 'range-slider-quantity');
    this.sliderWrapper.node.id = 'count';
    this.rangeSliderQuantity = noUiSlider.create(this.sliderWrapper.node, {
      start: [data.ranges.count[0], data.ranges.count[1]],
      connect: true,
      step: 1,
      range: {
        min: RangeValues.MIN_COUNT,
        max: RangeValues.MAX_COUNT,
      },
      format: {
        from: (formattedValue) => Number(formattedValue),
        to: (numericValue) => Math.round(numericValue),
      },
      tooltips: {
        to: (numericValue) => numericValue.toFixed(0),
      },
    });
    this.rangeSliderQuantity.on('change', function (values) {
      controller.changeRanges(this.target.id, values as number[]);
    });

    this.filtersSubTitle = new Control(this.node, 'h4', 'filters__subtitle', 'Год выпуска');
    this.sliderWrapper = new Control(this.node, 'div', 'range-slider-year');
    this.sliderWrapper.node.id = 'year';
    this.rangeSliderYear = noUiSlider.create(this.sliderWrapper.node, {
      start: [data.ranges.year[0], data.ranges.year[1]],
      connect: true,
      step: 1,
      range: {
        min: RangeValues.MIN_YEAR,
        max: RangeValues.MAX_YEAR,
      },
      format: {
        from: (formattedValue) => Number(formattedValue),
        to: (numericValue) => Math.round(numericValue),
      },
      tooltips: {
        to: (numericValue) => numericValue.toFixed(0),
      },
    });
    this.rangeSliderYear.on('change', function (values) {
      controller.changeRanges(this.target.id, values as number[]);
    });

    this.filtersSubTitle = new Control(this.node, 'h4', 'filters__subtitle', 'Категории');
    this.filterGroup = new Control(this.node, 'div', 'filters__group');
    data.defaultFilters.category.forEach((item) =>
      this.createFilterItem(this.filterGroup.node, 'category', item as never, data, controller),
    );

    this.filtersSubTitle = new Control(this.node, 'h4', 'filters__subtitle', 'Бренды');
    this.filterGroup = new Control(this.node, 'div', 'filters__group');
    data.defaultFilters.brand.forEach((item) =>
      this.createFilterItem(this.filterGroup.node, 'brand', item as never, data, controller),
    );
  }

  private createFilterItem = (
    parentNode: HTMLElement,
    filter: string,
    name: never,
    data: AppState,
    controller: Controller,
  ) => {
    this.filterItem = new Control(parentNode, 'div', 'filter__item');
    this.label = new Control(this.filterItem.node, 'label', 'filter__item-label', name);
    this.label.node.htmlFor = name;
    this.checkbox = new Control(this.filterItem.node, 'input', 'filter__item-input');
    this.checkbox.node.type = 'checkbox';
    this.checkbox.node.id = name;

    if (data.filters[filter].includes(name)) {
      this.checkbox.node.checked = true;
    }

    this.checkbox.node.onclick = (e: MouseEvent) => controller.changeFilters(e, filter);
  };
}
