import { Controller } from './controllers/controller';
import { Model } from './models/model';
import { View } from './views/view';
import './styles.scss';

const model = new Model();
const controller = new Controller(model);
new View(document.body, model, controller);
