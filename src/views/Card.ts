import { Product } from '../models/model.types';
import { Control } from '../controllers/Control';

export class Card extends Control<HTMLElement> {
  title: Control<HTMLElement>;
  image: Control<HTMLImageElement>;
  price: Control<HTMLElement>;
  brand: Control<HTMLElement>;
  year: Control<HTMLElement>;
  count: Control<HTMLElement>;
  category: Control<HTMLElement>;

  constructor(parentElement: HTMLElement, data: Product) {
    super(parentElement, 'div', 'card__item');
    this.image = new Control(this.node, 'img', 'card__item-image');
    this.image.node.src = data.img;
    this.title = new Control(this.node, 'h3', 'card__item-title', `${data.title.slice(0, 20)}...`);
    this.category = new Control(this.node, 'span', 'card__item-categiry', `Категория: ${data.category}`);
    this.brand = new Control(this.node, 'span', 'card__item-brand', `Бренд: ${data.brand}`);
    this.year = new Control(this.node, 'div', 'card__item-year', `Год выпуска: ${data.year}`);
    this.count = new Control(this.node, 'div', 'card__item-count', `Количество: ${data.count}`);
    this.price = new Control(this.node, 'div', 'card__item-price', `${data.price} BYN`);
  }
}
