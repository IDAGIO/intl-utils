import test from 'ava';
import sinon from 'sinon';

import { lintOnCollect } from '../src/lint';

const violatingMessages = [
  {
    id: 'a',
    defaultMessage: 'Message a',
  },
  {
    id: 'a',
    defaultMessage: 'Message b',
  },
];

const validMessages = [
  {
    id: 'a',
    defaultMessage: 'Message a',
  },
  {
    id: 'a',
    defaultMessage: 'Message a',
  },
];

test.beforeEach('setup', t => {
  sinon.stub(console, 'log');
  sinon.stub(console, 'error');
});

test('exits process with 1 for violating duplicates', t => {
  const processExitStub = sinon.stub(process, 'exit');
  lintOnCollect(violatingMessages);
  t.true(processExitStub.calledWith(1));
});

test('exits process with 0 for valid duplicates', t => {
  const processExitStub = sinon.stub(process, 'exit');
  lintOnCollect(validMessages);
  t.true(processExitStub.calledWith(0));
});

test.afterEach('cleanup', t => {
	sinon.restore();
});
