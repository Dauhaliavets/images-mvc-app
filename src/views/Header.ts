import { Control } from '../controllers/Control';

export class Header extends Control<HTMLElement> {
  title: Control<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'header', 'header');
    this.title = new Control(this.node, 'h2', 'header__title', 'Каталог компьютерной техники');
  }
}
