import {Composite, TextView, Button, Constraint, Properties, Listeners} from 'tabris';
import {component, event, property} from 'tabris-decorators';

@component // Enabled data binding syntax
export class MainView extends Composite {

  @property public message: string = '';
  @event public onContinue: Listeners<{target: MainView}>;

  constructor(properties: Properties<MainView>) {
    super();
    this.set(properties).append(
      <$>
        <Button center onSelect={() => this.onContinue.trigger()}>Tap here</Button>
        <TextView centerX padding={16} bottom={Constraint.prev} font={{size: 24}}
            bind-text='message'/>
      </$>
    );
  }

}
