const {Button, TextView, contentView} = require('tabris');

new Button({
  centerX: true, top: 100,
  text: 'Show message'
}).onSelect(() => {
  textView.text = 'Tabris.js rocks!';
}).appendTo(contentView);

const textView = new TextView({
  centerX: true, top: 'prev() 50',
  font: '24px'
}).appendTo(contentView);
