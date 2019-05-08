/* tslint:disable no-namespace */
import {expect, use} from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {tabris} from 'tabris';
import ClientMock from 'tabris/ClientMock';

// Configure chai to work with sinon
use(sinonChai);

// Create a sandbox for easy cleanup after each test
const sandbox = sinon.createSandbox();
const spy = sandbox.spy.bind(sandbox) as sinon.SinonSpyStatic;
const stub = sandbox.stub.bind(sandbox) as sinon.SinonStubStatic;
const mock = sandbox.mock.bind(sandbox) as sinon.SinonMockStatic;

// Initialize tabris module at least once before application code is parsed
tabris._init(new ClientMock());

export {sandbox, tabris, ClientMock, expect, spy, stub, mock};
