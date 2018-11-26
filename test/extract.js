const assert = require('assert');
const sinon = require('sinon');

const { extractOnCollect } = require('../src/extract');

// To be mocked
const fs = require('fs');

const aggregatedMessages = [
  {
    id: 'b',
    defaultMessage: 'Message b',
  },
  {
    id: 'a',
    defaultMessage: 'Message a',
  },
  {
    id: 'c',
    defaultMessage: 'Message c',
  }
];

const targetPath = 'some/path';
const expectedOutput =
`{
  "a": "Message a",
  "b": "Message b",
  "c": "Message c"
}
`;

describe('Extract', function() {
  it('extracts messages to correct file structure', function() {
    const writeFake = sinon.fake();
    sinon.replace(fs, 'writeFileSync', writeFake);
    sinon.stub(console, 'log');
    extractOnCollect(aggregatedMessages, targetPath);
    assert.ok(writeFake.calledWith(targetPath, expectedOutput, 'utf8'));
  });

  after(function() {
    sinon.restore();
  });
});
