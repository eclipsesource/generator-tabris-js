import {tabris, ClientMock, sandbox, expect} from './sandbox';
import {MainViewPresenter, MainView} from '../src/MainViewPresenter';
import {Listeners} from 'tabris';
import {event, create} from 'tabris-decorators';

describe('MainViewPresenter', () => {

  class MainViewMock implements MainView {
    @event public onContinue: Listeners<{target: MainView}>;
    public message: string = '';
  }

  let presenter: MainViewPresenter;
  let view: MainView;

  beforeEach(() => {
    tabris._init(new ClientMock()); // reset tabris before each new test
    presenter = create(MainViewPresenter);
    view = new MainViewMock();
    presenter.bind(view);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not change message initially', () => {
    expect(view.message).to.equal('');
  });

  it('sets message when continue event is triggered', () => {
    view.onContinue.trigger();
    expect(view.message).to.equal('Tabris.js rocks!');
  });

});
