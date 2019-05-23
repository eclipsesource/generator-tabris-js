import {contentView} from 'tabris';
import {inject} from 'tabris-decorators';
import {MainViewPresenter} from './MainViewPresenter';
import {MainView} from './MainView';

export class App {

  constructor(
    @inject private presenter: MainViewPresenter
  ) {}

  public start() {
    contentView.append(<MainView stretch/>);
    this.presenter.bind($(MainView).only());
  }

}
