import {contentView} from 'tabris';
import {inject} from 'tabris-decorators';
import {MainViewModel} from './MainViewModel';
import {MainView} from './MainView';

export class App {

  constructor(
    @inject private main: MainViewModel
  ) {}

  public start() {
    contentView.append(
      <MainView stretch model={this.main}/>
    );
  }

}
