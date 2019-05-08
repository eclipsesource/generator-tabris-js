import {tabris, ClientMock, sandbox, expect} from './sandbox';
import {Composite, device, app} from 'tabris';

describe('sandbox', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('ClientMock', () => {

    it('allows creating widgets', () => {
      tabris._init(new ClientMock());
      expect(() => new Composite()).not.to.throw();
    });

    it('can fake device and app properties', () => {
      tabris._init(new ClientMock({
        'tabris.Device': {platform: 'Android'},
        'tabris.App': {version: '1.0.0'}
      }));
      expect(device.platform).to.equal('Android');
      expect(app.version).to.equal('1.0.0');
    });

  });

});
