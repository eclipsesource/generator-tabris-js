import {Listeners} from 'tabris';
import {injectable} from 'tabris-decorators';

@injectable
export class MainViewPresenter {

  private view: MainView;

  public bind(view: MainView) {
    this.view = view;
    view.onContinue(this.handleContinue);
  }

  private handleContinue = () => {
    this.view.message = 'Tabris.js rocks!';
  }

}

export interface MainView {
  onContinue: Listeners<{target: MainView}>;
  message: string;
}
