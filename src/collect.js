const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

module.exports = function collectMessages(fileTraverser, onCollected, babelConfigPath) {
  if (!babelConfigPath) {
    throw new Error('Please pass a path to your babel config');
  }
  const absolutePath = path.isAbsolute(babelConfigPath) ?
    babelConfigPath
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
      const code = fs.readFileSync(file, 'utf8');
      const transformed = babel.transform(code, babelConfig);
      const messages = transformed.metadata['react-intl'].messages;
      aggregatedMessages = [...aggregatedMessages, ...messages];
    }
  });

  fileTraverser.on('end', () => onCollected(aggregatedMessages));

};
