import {Page, Button, TextView} from 'tabris';

let page = new Page({
  title: 'Example App',
  topLevel: true
});

let button = new Button({
  centerX: 0, top: 100,
  text: 'Native Widgets'
}).appendTo(page);

let textView = new TextView({
  centerX: 0, top: [button, 50],
  font: '24px'
}).appendTo(page);

button.on('select', () => textView.set('text', 'Totally Rock!'));

page.open();
