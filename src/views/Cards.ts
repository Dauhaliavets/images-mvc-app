import { Controller } from './../controllers/controller';
import { Control } from '../controllers/Control';
import { AppState, Product } from '../models/model.types';
import { Card } from './Card';

export class Cards extends Control<HTMLElement> {
  cardsWrapper: Control<HTMLElement>;
  select: Control<HTMLSelectElement>;
  optionSortByHighPrice: Control<HTMLOptionElement>;
  optionSortByLowPrice: Control<HTMLOptionElement>;
  optionSortByNameAZ: Control<HTMLOptionElement>;
  optionSortByNameZA: Control<HTMLOptionElement>;

  constructor(parentElement: HTMLElement, data: AppState, controller: Controller) {
    super(parentElement, 'div', 'cards__container');
    this.select = new Control(this.node, 'select', 'cards__sort');

    this.optionSortByHighPrice = new Control(this.select.node, 'option', '', 'По убыванию цены');
    this.optionSortByHighPrice.node.id = 'price_desc';

    this.optionSortByLowPrice = new Control(this.select.node, 'option', '', 'По возрастанию цены');
    this.optionSortByLowPrice.node.id = 'price_asc';

    this.optionSortByNameAZ = new Control(this.select.node, 'option', '', 'По названию А-Я');
    this.optionSortByNameAZ.node.id = 'title_desc';

    this.optionSortByNameZA = new Control(this.select.node, 'option', '', 'По названию Я-А');
    this.optionSortByNameZA.node.id = 'title_asc';

    for (const node of this.select.node.children) {
      if (node.id === data.sortSettings) {
        node.setAttribute('selected', 'true');
      }
    }

    this.select.node.onchange = () => {
      controller.sortBy(this.select.node.selectedOptions[0].id);
    };

    this.cardsWrapper = new Control(this.node, 'div', 'cards__wrapper');

    if (controller.checkAllSettings()) {
      if (data.visible.length) {
        data.visible.map((product: Product) => {
          const card = new Card(this.cardsWrapper.node, product);
          card.node.onclick = () => this.onCardClick(product);
          return card;
        });
      } else {
        this.cardsWrapper.node.textContent = 'Извините, совпадений не обнаружено';
      }
    } else {
      data.products.map((product: Product) => {
        const card = new Card(this.cardsWrapper.node, product);
        card.node.onclick = () => this.onCardClick(product);
        return card;
      });
    }
  }

  onCardClick(product: Product) {
    document.body.style.overflow = 'hidden';
    const modal = new Control(document.body, 'div', 'modal');
    const contentContainer = new Control(modal.node, 'div', 'modal__container');
    new Control(contentContainer.node, 'h4', 'modal__title', product.title);
    const modalInfo = new Control(contentContainer.node, 'div', 'modal__info');
    const previewImage = new Control<HTMLImageElement>(modalInfo.node, 'img', 'modal__info-image');
    previewImage.node.src = product.img;
    const description = new Control(modalInfo.node, 'div', 'modal__info-description');
    new Control(description.node, 'h5', 'modal__info-description-title', 'Характеристики');
    const descriptionList = new Control(description.node, 'ul', 'modal__info-description-list');

    for (const [key, value] of Object.entries(product.description)) {
      new Control(descriptionList.node, 'li', 'modal__info-description-item', `${key}: ${value}`);
    }

    modal.node.onclick = (e) => {
      if (e.target === e.currentTarget) {
        document.body.style.overflow = 'auto';
        modal.destroy();
      }
    };
  }
}
