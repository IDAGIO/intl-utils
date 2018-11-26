const assert = require('assert');
const sinon =  require('sinon');
const EventEmitter = require('events');

const collect = require('../src/collect');

// To be mocked
const fs = require('fs');
const readFileSyncOriginal = fs.readFileSync;
const babel = require('babel-core');
const path = require('path');

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

describe('Collect', function() {
  it('throws error if no babelConfigPath is supplied', function() {
    assert.throws(
      () => {
        collect(null, null);
      },
      /Please pass a path to your babel config/
    );
  });

  it('loads babelconfig and aggregates messages passed from file traverser', function() {
    const onCollected = sinon.fake();
    const babelTransformSpy = sinon.spy((messages) => ({
      metadata: {
        'react-intl': {
          messages,
        }
      }
    }));
    const fileTraverser = new EventEmitter();
    sinon.replace(path, 'extname', () => '.js');
    sinon.replace(fs, 'readFileSync', (filePathOrMessages, encoding) => {
      // We want it to work as normal for actual paths
      if (typeof filePathOrMessages === 'string') {
        return readFileSyncOriginal(filePathOrMessages, encoding)
      }
      // Fake to pass through the message objects emitted instead of paths
      return filePathOrMessages;
    });
    sinon.replace(babel, 'transform', babelTransformSpy);

    collect(fileTraverser, onCollected, './test/.fakebabelrc');
    fileTraverser.emit('file', messagesFile1);
    fileTraverser.emit('file', messagesFile2);
    fileTraverser.emit('file', messagesFile3);
    fileTraverser.emit('end');

    assert.deepStrictEqual(babelTransformSpy.firstCall.args[1], {
      presets: [ 'some-preset' ],
      plugins: [ 'some-plugin', 'react-intl' ]}
    );

    assert.ok(onCollected.calledWith([
      ...messagesFile1,
      ...messagesFile2,
      ...messagesFile3
    ]));
  });

  afterEach(function() {
    sinon.restore();
  });
});
