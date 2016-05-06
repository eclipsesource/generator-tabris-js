import { Page, Button, TextView } from 'tabris';

export default class MainPage extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Example App'
    });
    this.createUI();
  }

  private createUI() {
    new Button({
      centerX: 0, top: 100,
      text: 'Native Widgets'
    }).on('select', () => {
      this.apply({'#text': {text: 'Totally Rock!'}});
    }).appendTo(this);

    new TextView({
      id: 'text',
      centerX: 0, top: ['prev()', 50],
      font: '24px'
    }).appendTo(this);
  }

}
