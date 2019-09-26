import {injectable, property} from 'tabris-decorators';

@injectable
export class MainViewModel {

  @property public message: string = '';

  public continue() {
    this.message = 'Tabris.js rocks!';
  }

}
