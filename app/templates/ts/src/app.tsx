import { Button, WidgetCollection, TextView, contentView } from 'tabris';

contentView.append(
  <WidgetCollection>
    <Button centerX={0} centerY={0} onSelect={showText} >Tap here</Button>
    <TextView centerX={0} bottom='prev() 20' font='24px' />
  </WidgetCollection>
);

function showText() {
  contentView.find(TextView).first().text = 'Tabris.js rocks!';
}
