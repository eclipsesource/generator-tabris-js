import {ui, Button, TextView} from 'tabris';

let button = new Button({
  centerX: 0, top: 100,
  text: 'Show Message'
}).appendTo(ui.contentView);

let textView = new TextView({
  centerX: 0, top: [button, 50],
  font: '24px'
}).appendTo(ui.contentView);

button.on({select: () => textView.text = 'Tabris.js rocks!'});
