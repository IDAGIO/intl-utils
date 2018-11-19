/* eslint-disable no-console */

const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const finder = require('findit');

let babelConfig = {
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['transform-runtime', 'react-intl'],
};

module.exports = function collectMessages(pathToFiles, onCollected, babelConfigPath) {
  if (babelConfigPath) {
    babelConfig = require(babelConfigPath);
  };
  let aggregatedMessages = [];
  const fileTraverser = finder(pathToFiles);
  fileTraverser.on('file', (file) => {
    if (path.extname(file) !== '.js') {
      return;
    }
    const code = fs.readFileSync(file, 'utf8');
    const transformed = babel.transform(code, babelConfig);
    const messages = transformed.metadata['react-intl'].messages;
    aggregatedMessages = [...aggregatedMessages, ...messages];
  });

  fileTraverser.on('end', () => onCollected(aggregatedMessages));
};
