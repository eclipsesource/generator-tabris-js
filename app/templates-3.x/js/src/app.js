const {Button, TextView, contentView} = require('tabris');

contentView.append(
  Button({
    centerX: true, top: 100,
    text: 'Show message',
    onSelect: () => $(TextView).only().text = 'Tabris.js rocks!'
  }),
  TextView({
    centerX: true, top: 'prev() 50',
    font: '24px'
  })
);
