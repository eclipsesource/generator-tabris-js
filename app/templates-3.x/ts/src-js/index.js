import {Button, TextView, contentView} from 'tabris';

new Button({layoutData: 'center', text: 'Tap here'})
  .onSelect(showText)
  .appendTo(contentView);

new TextView({centerX: true, bottom: 'prev() 20', font: '24px'})
  .appendTo(contentView);

function showText() {
  $(TextView).only().text = 'Tabris.js rocks!';
}
