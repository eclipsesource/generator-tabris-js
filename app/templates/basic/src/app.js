var page = new tabris.Page({
  title: 'Example App',
  topLevel: true
});

var button = new tabris.Button({
  centerX: 0, top: 100,
  text: 'Native Widgets'
}).appendTo(page);

var textView = new tabris.TextView({
  centerX: 0, top: [button, 50],
  font: '24px'
}).appendTo(page);

button.on('select', function() {
  textView.set('text', 'Totally Rock!');
});

page.open();
