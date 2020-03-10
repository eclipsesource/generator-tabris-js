import {Button, TextView, contentView, Constraint} from 'tabris';

export class App {

  public start() {
    contentView.append(
      <$>
        <Button center onSelect={this.showText}>Tap here</Button>
        <TextView centerX bottom={[Constraint.prev, 20]} font={{size: 24}}/>
      </$>
    );
  }

  private showText = () => {
    $(TextView).only().text = 'Tabris.js rocks!';
  };

}
