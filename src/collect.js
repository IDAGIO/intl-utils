const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

let babelConfig = {
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['transform-runtime', 'react-intl'],
};

module.exports = function collectMessages(fileTraverser, onCollected, babelConfigPath) {
  if (babelConfigPath) {
    babelConfig = require(babelConfigPath);
  };
  let aggregatedMessages = [];
  fileTraverser.on('file', (file) => {
    const fileExt = path.extname(file);
    if (fileExt === '.js' || fileExt === '.jsx') {
      const code = fs.readFileSync(file, 'utf8');
      const transformed = babel.transform(code, babelConfig);
      const messages = transformed.metadata['react-intl'].messages;
      aggregatedMessages = [...aggregatedMessages, ...messages];
    }
  });

  fileTraverser.on('end', () => onCollected(aggregatedMessages));
};
