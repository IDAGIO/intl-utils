import test from 'ava';
import sinon from 'sinon';

import { extractOnCollect } from '../src/extract';

// To be mocked
import fs from 'fs';

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


test('extracts messages to correct file structure', t => {
  const writeFake = sinon.fake();
  sinon.replace(fs, 'writeFileSync', writeFake);
  sinon.stub(console, 'log');
  extractOnCollect(aggregatedMessages, targetPath);
  t.true(writeFake.calledWith(targetPath, expectedOutput, 'utf-8'));
});

test.after('cleanup', t => {
	sinon.restore();
});
