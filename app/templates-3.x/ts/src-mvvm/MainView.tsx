import {Composite, TextView, Button, Constraint, Properties} from 'tabris';
import {component, bindAll} from 'tabris-decorators';
import {MainViewModel} from './MainViewModel';

@component // Enabled data binding syntax
export class MainView extends Composite {

  @bindAll({
    message: '#label.text'
  })
  public model: MainViewModel;

  constructor(properties: Properties<MainView>) {
    super();
    this.set(properties).append(
      <$>
        <TextView id='label' centerX padding={16} bottom={Constraint.next} font={{size: 24}}/>
        <Button center onSelect={() => this.model.continue()}>Tap here</Button>
      </$>
    );
  }

}
