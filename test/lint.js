const assert = require('assert');
const sinon = require('sinon');

const { lintOnCollect } = require('../src/lint');

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

describe('Lint', function() {
  beforeEach(function() {
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  });

  it('exits process with 1 for violating duplicates', function() {
    const processExitStub = sinon.stub(process, 'exit');
    lintOnCollect(violatingMessages);
    assert.ok(processExitStub.calledWith(1));
  });

  it('exits process with 0 for valid duplicates', function() {
    const processExitStub = sinon.stub(process, 'exit');
    lintOnCollect(validMessages);
    assert.ok(processExitStub.calledWith(0));
  });

  afterEach(function() {
    sinon.restore();
  });
});
