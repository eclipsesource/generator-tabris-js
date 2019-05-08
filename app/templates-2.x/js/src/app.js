const {Button, TextView, ui} = require('tabris');

new Button({
  centerX: 0, top: 100,
  text: 'Show message'
}).on({select: () => {
  textView.text = 'Tabris.js rocks!';
}}).appendTo(ui.contentView);

const textView = new TextView({
  centerX: 0, top: 'prev() 50',
  font: '24px'
}).appendTo(ui.contentView);
