import {tabris, ClientMock, sandbox, expect} from './sandbox';
import {App} from '../src/App'; // this must be done AFTER importing sandbox!
import {Button, TextView} from 'tabris';

describe('App', () => {

  let app: App;

  beforeEach(() => {
    tabris._init(new ClientMock()); // reset tabris before each new test
    app = new App();
    app.start();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('creates a Button and empty TextView', () => {
    expect($(Button).length).to.equal(1);
    expect($(TextView).only().text).to.equal('');
  });

  it('shows message on button tap', () => {
    $(Button).only().onSelect.trigger();
    expect($(TextView).only().text).to.equal('Tabris.js rocks!');
  });

});
