const fs = require('fs');
const path = require('path');
const { pickBy, identity } = require('lodash');
const babel = require('@babel/core');

module.exports = function collectMessages(fileTraverser, onCollected, babelConfigPath) {
  if (!babelConfigPath) {
    throw new Error('Please pass a path to your babel config');
  }
  const absolutePath = path.isAbsolute(babelConfigPath)
    ? babelConfigPath
    : path.join(process.cwd(), babelConfigPath);
  const babelConfig = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  if (babelConfig.plugins) {
    babelConfig.plugins.push('react-intl');
  } else {
    babelConfig.plugins = ['react-intl'];
  }

  let aggregatedMessages = [];
  fileTraverser.on('file', (file) => {
    const fileExt = path.extname(file);
    if (fileExt === '.js' || fileExt === '.jsx') {
      const transformed = babel.transformFileSync(file, babelConfig);
      const messages = transformed.metadata['react-intl'].messages;
      const messagesWithoutEmptyDescription = messages.map(message => pickBy(message, identity));

      aggregatedMessages = [...aggregatedMessages, ...messagesWithoutEmptyDescription];
    }
  });

  fileTraverser.on('end', () => onCollected(aggregatedMessages));
};
