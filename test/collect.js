const path = require('path');
const assert = require('assert');
const sinon =  require('sinon');

const EventEmitter = require('events');

const collect = require('../src/collect');

describe('Collect', function() {
  it('throws error if no babelConfigPath is supplied', function() {
    assert.throws(
      () => {
        collect(null, null);
      },
      /Please pass a path to your babel config/
    );
  });

  it('loads babel config and aggregates messages passed from file traverser', function() {
    const onCollected = sinon.fake();
    const fileTraverser = new EventEmitter();

    collect(fileTraverser, onCollected, './test/fixture/.babelrc');
    fileTraverser.emit('file', path.join(__dirname, 'fixture/component1.js'));
    fileTraverser.emit('file', path.join(__dirname, 'fixture/component2.js'));
    fileTraverser.emit('file', path.join(__dirname, 'fixture/component3.js'));

    fileTraverser.emit('end');

    assert.deepStrictEqual(onCollected.firstCall.args[0], [
      { id: 'a', defaultMessage: 'Message a' },
      { id: 'b', defaultMessage: 'Message b' },
      { id: 'c', defaultMessage: 'Message c' },
      { id: 'd', defaultMessage: 'Message d' },
      { id: 'e', defaultMessage: 'Message e', description: 'e' },
    ]);
  });
});
