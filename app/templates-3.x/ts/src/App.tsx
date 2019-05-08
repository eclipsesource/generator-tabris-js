import {Button, TextView, contentView} from 'tabris';

export class App {

  public start() {
    contentView.append(
      <$>
        <Button center onSelect={this.showText}>Tap here</Button>
        <TextView centerX bottom='prev() 20' font='24px'/>
      </$>
    );
  }

  private showText = () => {
    $(TextView).only().text = 'Tabris.js rocks!';
  }

}
