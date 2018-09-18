import { Button, WidgetCollection, TextView, ui } from 'tabris';

ui.contentView.append(
  <WidgetCollection>
    <Button centerX={0} centerY={0} onSelect={showText} >Tap here</Button>
    <TextView centerX={0} bottom='prev() 20' font='24px' />
  </WidgetCollection>
);

function showText() {
  ui.find(TextView).first().text = 'Tabris.js rocks!';
}
