import test from 'ava';
import sinon from 'sinon';
import EventEmitter from 'events';

import collect from '../src/collect';

// To be mocked
import fs from 'fs';
import * as babel from 'babel-core';
import path from 'path';

const messagesFile1 = [
  {
    id: 'a',
    defaultMessage: 'Message a',
  },
  {
    id: 'b',
    defaultMessage: 'Message b',
  }
];

const messagesFile2 = [
  {
    id: 'c',
    defaultMessage: 'Message c',
  },
  {
    id: 'd',
    defaultMessage: 'Message d',
  }
];

const messagesFile3 = [
  {
    id: 'e',
    defaultMessage: 'Message e',
  }
];

test('aggregates messages passed from file traverser', t => {
  const onCollected = sinon.fake();
  const fileTraverser = new EventEmitter();
  sinon.replace(path, 'extname', () => '.js');
  sinon.replace(fs, 'readFileSync', (messages) => messages);
  sinon.replace(babel, 'transform', (messages) => ({
    metadata: {
      'react-intl': {
        messages,
      }
    }
  }));

  collect(fileTraverser, onCollected);
  fileTraverser.emit('file', messagesFile1);
  fileTraverser.emit('file', messagesFile2);
  fileTraverser.emit('file', messagesFile3);
  fileTraverser.emit('end');

  t.true(onCollected.calledWith([
    ...messagesFile1,
    ...messagesFile2,
    ...messagesFile3
  ]));
});

test.after('cleanup', t => {
	sinon.restore();
});
