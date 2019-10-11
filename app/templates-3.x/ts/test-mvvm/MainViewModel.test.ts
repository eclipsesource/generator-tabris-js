import {tabris, ClientMock, sandbox, expect} from './sandbox';
import {MainViewModel} from '../src/MainViewModel';
import {create} from 'tabris-decorators';

describe('MainViewModel', () => {

  let model: MainViewModel;

  beforeEach(() => {
    tabris._init(new ClientMock()); // reset tabris before each new test
    model = create(MainViewModel);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not show message initially', () => {
    expect(model.message).to.equal('');
  });

  it('sets message when continue is called', () => {
    model.continue();
    expect(model.message).to.equal('Tabris.js rocks!');
  });

});
