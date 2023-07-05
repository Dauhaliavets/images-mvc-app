import { Controller } from './../controllers/controller';
import { Cards } from './Cards';
import { AppState } from '../models/model.types';
import { Header } from './Header';
import { Model } from '../models/model';
import { Control } from '../controllers/Control';
import { Filters } from './Filters';

export class View {
  parentElement: HTMLElement;
  header: Header | undefined;
  mainScreen: Control<HTMLElement> | Cards | undefined;

  constructor(parentElement: HTMLElement, model: Model, controller: Controller) {
    this.parentElement = parentElement;
    this.onUpdate(controller)(model.getState());
    model.events.add(this.onUpdate(controller));
  }

  public onUpdate = (controller: Controller) => (newState: AppState) => {
    this.parentElement.innerHTML = '';
    this.header = new Header(this.parentElement);
    this.mainScreen = new Control(this.parentElement, 'main', 'main__container container');
    const filtersView = new Filters(this.mainScreen.node, newState, controller);
    const cardsView = new Cards(this.mainScreen.node, newState, controller);
    this.mainScreen.node.append(filtersView.node, cardsView.node);
  };
}
